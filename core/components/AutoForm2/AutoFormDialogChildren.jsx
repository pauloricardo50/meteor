import PropTypes from 'prop-types';

const AutoFormDialogChildren = (
  { renderFunc, ...props },
  {
    uniforms: {
      state: { submitting },
    },
  },
) => renderFunc({ submitting, ...props });

AutoFormDialogChildren.contextTypes = {
  uniforms: PropTypes.shape({
    state: PropTypes.shape({
      submitting: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

export default AutoFormDialogChildren;
