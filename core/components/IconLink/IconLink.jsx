import React from 'react';
import { T } from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const IconLink = ({ link, icon, text, translationId }) => (
  <Link to={link}>
    <Icon type={icon} />
    {text || <T id={translationId} />}
  </Link>
);

IconLink.propTypes = {
  link: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string,
  translationId: PropTypes.string,
};

IconLink.defaultProps = {
  text: '',
  translationId: '',
};

export default IconLink;
