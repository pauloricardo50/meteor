// @flow
import React from 'react';
import UploaderCategoriesContainer from './UploaderCategoriesContainer';
import UploaderArray from '../UploaderArray/UploaderArray';
import HiddenDocuments from '../UploaderArray/HiddenDocuments';

type UploaderCategoriesProps = {
  categories: Object,
};

const UploaderCategories = (props: UploaderCategoriesProps) => {
  const { categories } = props;
  return (
    <div>
      {Object.keys(categories)
        .filter(category =>
          !(
            categories[category].documentsToDisplay.length === 0
              && categories[category].documentsToHide.length === 0
          ))
        .map(category => (
          <>
            <h3>{category}</h3>
            <UploaderArray
              documentArray={categories[category].documentsToDisplay}
              {...props}
            />
            <HiddenDocuments
              documentArray={categories[category].documentsToHide}
              {...props}
            />
          </>
        ))}
    </div>
  );
};

export default UploaderCategoriesContainer(UploaderCategories);
