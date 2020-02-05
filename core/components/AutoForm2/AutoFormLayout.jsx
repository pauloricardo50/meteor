//
import React from 'react';

const renderLayout = ({ layout, renderLayoutItem, renderField, AutoField }) => {
  if (!layout) {
    return null;
  }

  if (typeof layout === 'string') {
    return renderField(layout, AutoField);
  }

  if (Array.isArray(layout)) {
    return layout.map(renderLayoutItem);
  }

  return renderLayoutItem(layout);
};

const AutoFormLayout = ({ AutoField, layout, schemaKeys, automaticFocus }) => {
  let fieldCount = 0;
  const renderedMap = {};

  const renderField = field => {
    if (field[field.length - 1] === '*') {
      return schemaKeys
        .filter(key => key.startsWith(field.slice(0, -1)))
        .map(renderField);
    }

    if (field === '__REST') {
      const remainingFields = schemaKeys.filter(
        key => !renderedMap[key] && !key.includes('.'),
      );
      return remainingFields.map(renderField);
    }

    if (!schemaKeys.includes(field) || renderedMap[field]) {
      return null;
    }

    renderedMap[field] = true;
    return (
      <AutoField
        name={field}
        key={field}
        autoFocus={automaticFocus && fieldCount++ === 0}
      />
    );
  };

  const renderLayoutItem = item => {
    if (typeof item === 'string') {
      return renderField(item);
    }

    const {
      fields = [],
      layout: subLayout,
      Component = 'div',
      ...props
    } = item;

    return (
      <Component {...props}>
        {typeof fields === 'string'
          ? renderField(fields)
          : fields.map(renderField)}
        {subLayout
          ? renderLayout({
              layout: subLayout,
              renderLayoutItem,
              renderField,
              AutoField,
            })
          : null}
      </Component>
    );
  };

  return renderLayout({ layout, renderLayoutItem, renderField, AutoField });
};

export default AutoFormLayout;
