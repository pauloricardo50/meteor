import { Mongo } from 'meteor/mongo';

import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import moment from 'moment';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import LoanService from 'core/api/loans/server/LoanService';
import Intl from '../../../utils/server/intl';
import { toMoney } from '../../../utils/conversionFunctions';
import { percentFormatters } from '../../../utils/formHelpers';
import { BORROWERS_COLLECTION, PROPERTIES_COLLECTION } from '../../constants';
import { updateWatcherNotification } from '../../slack/server/slackNotifications';
import UserService from '../../users/server/UserService';
import CollectionService from '../../helpers/CollectionService';
import UpdateWatchers from './updateWatchers';

class UpdateWatcherService extends CollectionService {
  constructor() {
    super(UpdateWatchers);
  }

  addUpdateWatching({ collection, fields, shouldWatch = () => true }) {
    const that = this;
    const hookHandle = collection.after.update(function(
      userId,
      doc,
      fieldNames,
    ) {
      const collectionName = collection._name;
      const changedFields = that.getChangedFields({ fieldNames, fields });

      if (!changedFields || changedFields.length === 0) {
        return;
      }

      if (shouldWatch({ userId, fieldNames })) {
        that.updateWatcher({
          userId,
          collectionName,
          doc,
          changedFields,
          previousDoc: this.previous,
        });
      }
    });

    return hookHandle;
  }

  getChangedFields({ fieldNames, fields }) {
    return intersection(fieldNames, fields);
  }

  updateWatcher({ collectionName, doc, changedFields, previousDoc, userId }) {
    const existingUpdateWatcher = this.get(
      {
        collection: collectionName,
        docId: doc._id,
      },
      { userId: 1, docId: 1, collection: 1, updatedFields: 1 },
    );

    if (!existingUpdateWatcher) {
      this.insertWatcher({
        userId,
        doc,
        previousDoc,
        collection: collectionName,
        changedFields,
      });
    } else {
      this.update({
        currentWatcher: existingUpdateWatcher,
        doc,
        previousDoc,
        changedFields,
      });
    }
  }

  insertWatcher({ doc, previousDoc, collection, changedFields, userId }) {
    return this.insert({
      userId,
      docId: doc._id,
      collection,
      updatedFields: this.createFieldDiffs({
        previous: previousDoc,
        current: doc,
        fieldNames: changedFields,
      }),
    });
  }

  createFieldDiffs({ previous, current, fieldNames }) {
    return fieldNames
      .map(fieldName => {
        if (previous[fieldName] === current[fieldName]) {
          return null;
        }

        return {
          fieldName,
          previousValue: previous[fieldName],
          currentValue: current[fieldName],
        };
      })
      .filter(x => x);
  }

  getUpdatedFieldDiffs({ updatedFields, doc }) {
    return updatedFields
      .map(updatedField => {
        const newValue = doc[updatedField.fieldName];

        // If a value is changed back to its old value, remove it
        if (newValue === updatedField.previousValue) {
          return null;
        }

        if (newValue !== undefined) {
          return { ...updatedField, currentValue: newValue };
        }

        return updatedField;
      })
      .filter(x => x);
  }

  update({ currentWatcher, doc, previousDoc, changedFields }) {
    const previouslyUpdatedFields = currentWatcher.updatedFields.map(
      ({ fieldName }) => fieldName,
    );
    const newFields = difference(changedFields, previouslyUpdatedFields);

    const updatedDiffs = this.getUpdatedFieldDiffs({
      updatedFields: currentWatcher.updatedFields,
      doc,
    });

    const newDiffs = this.createFieldDiffs({
      current: doc,
      previous: previousDoc,
      fieldNames: newFields,
    });

    return this.baseUpdate(
      { _id: currentWatcher._id },
      { $set: { updatedFields: [...updatedDiffs, ...newDiffs] } },
    );
  }

  getOldUpdateWatchers({ secondsFromNow }) {
    const date = new Date();
    date.setSeconds(date.getSeconds() - secondsFromNow);
    const foundWatchers = this.find({ updatedAt: { $lt: date } }).fetch();

    return foundWatchers;
  }

  processUpdateWatcher({
    _id: updateWatcherId,
    userId,
    docId,
    collection,
    updatedFields,
  }) {
    const user = UserService.get(userId, {
      assignedEmployee: { email: 1 },
      name: 1,
      roles: 1,
    });

    if (!user) {
      return this.remove(updateWatcherId);
    }

    const title = this.getNotificationTitle({ docId, collection });
    const message = this.formatUpdatedFields(updatedFields);

    updateWatcherNotification({
      user,
      title,
      collection,
      docId,
      message,
    });

    this.remove(updateWatcherId);
  }

  getNotificationTitle({ docId, collection }) {
    const doc = Mongo.Collection.get(collection).findOne({ _id: docId });

    // Document has been deleted
    if (!doc) {
      return;
    }

    switch (collection) {
      case BORROWERS_COLLECTION: {
        const { firstName, lastName } = doc;
        return `Modifications pour l'emprunteur "${firstName ||
          ''} ${lastName || ''}"`;
      }

      case PROPERTIES_COLLECTION: {
        const { address1 } = doc;
        return `Modifications pour le bien immo "${address1}"`;
      }

      case LOANS_COLLECTION: {
        const { name, promotions, hasPromotion } = LoanService.get(docId, {
          name: 1,
          promotions: { name: 1 },
          hasPromotion: 1,
        });
        const text = `Modifications dans le dossier ${name}`;
        const suffix = hasPromotion ? ` (${promotions[0].name})` : '';
        return text + suffix;
      }

      default:
        return `Modifications dans ${collection}`;
    }
  }

  formatUpdatedFields(updatedFields) {
    return updatedFields.map(field => this.formatField(field)).join('\n');
  }

  formatField({ fieldName, previousValue, currentValue }) {
    const previousValueIsNonEmpty =
      previousValue ||
      (Array.isArray(previousValue) && previousValue.length > 0);

    if (previousValueIsNonEmpty) {
      if (Array.isArray(currentValue)) {
        return this.formatArrayDiff(fieldName, previousValue, currentValue);
      }

      return `*${Intl.formatMessage({
        id: `Forms.${fieldName}`,
      })}*: ${this.formatValue(previousValue, fieldName)} -> ${this.formatValue(
        currentValue,
        fieldName,
      )}`;
    }

    return `*${Intl.formatMessage({
      id: `Forms.${fieldName}`,
    })}*: ${this.formatValue(currentValue, fieldName)}`;
  }

  formatArrayDiff(fieldName, previousValue, currentValue) {
    const stringifiedPrevious = previousValue.map(JSON.stringify);
    const stringifiedCurrent = currentValue.map(JSON.stringify);
    const differentValues = currentValue
      .map((val, i) => ({
        val,
        _currIndex: i,
        _atIndex: stringifiedPrevious.indexOf(stringifiedCurrent[i]),
      }))
      .filter(({ _atIndex }) => _atIndex < 0);

    const diff = differentValues
      .map(({ _currIndex, val }) => {
        const prefix = `\`${_currIndex + 1}\`\n`;
        const prev = previousValue && previousValue[_currIndex];

        if (val && typeof val === 'object') {
          return `${prefix}${this.formatObjectDiff(fieldName, prev, val)}`;
        }

        if (prev) {
          const previous = this.formatValue(prev, fieldName);
          const current = this.formatValue(val, fieldName, true);

          return `${prefix}${previous} -> ${current}`;
        }

        return `${prefix}${this.formatValue(val, fieldName)}`;
      })
      .join('\n');

    const removedValues =
      previousValue.length > currentValue.length
        ? previousValue
            .map((item, i) => {
              if (i >= currentValue.length) {
                const prefix = `\`${i + 1}\`\n`;

                return `${prefix}${this.formatValue(
                  item,
                  fieldName,
                )} -> _supprimé_`;
              }
              return null;
            })
            .filter(x => x)
            .join('\n')
        : '';

    return `*${Intl.formatMessage({
      id: `Forms.${fieldName}`,
    })}*:\n${diff}${removedValues}`;
  }

  formatObjectDiff(parentName, previousValue, currentValue) {
    const updated = Object.keys(currentValue)
      .map(key => {
        const value = currentValue[key];
        const previous = previousValue && previousValue[key];

        if (value === previous) {
          return null;
        }

        if (previous !== undefined) {
          return `*${Intl.formatMessage({
            id: `Forms.${parentName}.${key}`,
          })}*: ${previous} -> ${value}`;
        }

        return `*${Intl.formatMessage({
          id: `Forms.${parentName}.${key}`,
        })}*: ${value}`;
      })
      .filter(x => x)
      .join('\n');

    return updated;
  }

  formatValue(value, parentKey, skipPrefix) {
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }

    if (typeof value === 'number') {
      return value === 0
        ? '0'
        : value > 1
        ? toMoney(value)
        : `${percentFormatters.format(value)}%`;
    }

    if (!value) {
      return '-';
    }

    if (value instanceof Date) {
      return moment(value).format('D/M/YYYY');
    }

    if (Array.isArray(value)) {
      return value.map(item => this.formatValue(item, parentKey)).join('\n');
    }

    if (typeof value === 'object') {
      return Object.keys(value)
        .map(key => {
          const val = value[key];

          if (skipPrefix) {
            return this.formatValue(val, `${parentKey}.${key}`);
          }

          return `*${Intl.formatMessage({
            id: `Forms.${parentKey}.${key}`,
          })}*: ${this.formatValue(val, `${parentKey}.${key}`)}`;
        })
        .join(', ');
    }

    return value;
  }

  manageUpdateWatchers({ secondsFromNow }) {
    this.getOldUpdateWatchers({ secondsFromNow }).forEach(updateWatcher =>
      this.processUpdateWatcher(updateWatcher),
    );
  }
}

export default new UpdateWatcherService();
