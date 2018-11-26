// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';

import UploaderCategoriesContainer from './UploaderCategoriesContainer';
import UploaderArray from '../UploaderArray/UploaderArray';
import HiddenDocuments from '../UploaderArray/HiddenDocuments';
import T from '../Translation';

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
  return Object.keys(categories)
    .filter(filterDocumentsForMicroservice(categories))
    .map(category => (
      <div className="uploader-category" key={category}>
        <h3>
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
