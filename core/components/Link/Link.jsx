import { Link as DefaultLink } from 'react-router-dom';
import { withProps } from 'recompose';

export default withProps(({ disabled, onClick }) => ({
  onClick: disabled ? e => e.preventDefault() : onClick,
}))(DefaultLink);
