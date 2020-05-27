import React from 'react';

export const SingleUserPageInformationItem = ({
  Component = 'div',
  ...props
}) => <Component {...props} />;

const SingleUserPageInformation = ({ children }) => (
  <div className="single-user-page-information">
    {React.Children.map(
      children,
      child =>
        child && (
          <div>
            <div className="font-size-5 secondary mt-16">
              {child.props.label}
            </div>
            <hr />
            <div className="single-user-page-information-content">{child}</div>
          </div>
        ),
    )}
  </div>
);

export default SingleUserPageInformation;
