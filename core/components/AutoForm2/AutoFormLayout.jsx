// @flow
import React from 'react';

type AutoFormLayoutProps = {};

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

const AutoFormLayout = ({
  AutoField,
  layout,
  schemaKeys,
}: AutoFormLayoutProps) => {
  const renderField = (field) => {
    if (field[field.length - 1] === '*') {
      return schemaKeys
        .filter(key => key.startsWith(field.slice(0, -1)))
        .map(matchedField => renderField(matchedField, AutoField));
    }

    return <AutoField name={field} key={field} />;
  };

  const renderLayoutItem = (item) => {
    if (typeof item === 'string') {
      return renderField(item, AutoField);
    }

    const { fields = [], subLayout, Component = 'div', ...props } = item;

    return (
      <Component {...props}>
        {fields.map(field => renderField(field, AutoField))}
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

export default React.memo(AutoFormLayout);
