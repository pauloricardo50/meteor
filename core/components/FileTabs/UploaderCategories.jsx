import { Meteor } from 'meteor/meteor';

import React from 'react';

import T from '../Translation';
import HiddenDocuments from '../UploaderArray/HiddenDocuments';
import UploaderArray from '../UploaderArray/UploaderArray';
import UploaderCategoriesContainer from './UploaderCategoriesContainer';

const filterDocumentsForMicroservice = categories => category =>
  Meteor.microservice === 'admin'
    ? !(
        categories[category].documentsToDisplay.length === 0 &&
        categories[category].documentsToHide.length === 0
      )
    : categories[category].documentsToDisplay.length > 0;

const UploaderCategories = props => {
  const { categories } = props;
  return Object.keys(categories)
    .filter(filterDocumentsForMicroservice(categories))
    .map(category => (
      <div className="uploader-category" key={category}>
        <h3 className={`v-align-${category}`}>
          <T id={`files.category.${category}`} />
        </h3>
        <UploaderArray
          documentArray={categories[category].documentsToDisplay}
          {...props}
        />
        {Meteor.microservice === 'admin' && (
          <HiddenDocuments
            documentArray={categories[category].documentsToHide}
            {...props}
          />
        )}
      </div>
    ));
};

export default UploaderCategoriesContainer(UploaderCategories);
