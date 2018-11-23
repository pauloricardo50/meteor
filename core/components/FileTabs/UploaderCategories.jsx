// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';
import UploaderCategoriesContainer from './UploaderCategoriesContainer';
import UploaderArray from '../UploaderArray/UploaderArray';
import HiddenDocuments from '../UploaderArray/HiddenDocuments';

type UploaderCategoriesProps = {
  categories: Object,
};

const filterDocumentsForMicroservice = categories => category =>
  (Meteor.microservice === 'admin'
    ? !(
      categories[category].documentsToDisplay.length === 0
        && categories[category].documentsToHide.length === 0
    )
    : categories[category].documentsToDisplay.length > 0);

const UploaderCategories = (props: UploaderCategoriesProps) => {
  const { categories } = props;
  return (
    <div>
      {Object.keys(categories)
        .filter(filterDocumentsForMicroservice(categories))
        .map(category => (
          <>
            <h3>{category}</h3>
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
          </>
        ))}
    </div>
  );
};

export default UploaderCategoriesContainer(UploaderCategories);
