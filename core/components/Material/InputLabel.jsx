//      
import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';

export default React.forwardRef((props, ref) => (
  <InputLabel variant="outlined" ref={ref} {...props} />
));

export const useInputLabelWidth = () => {
  const inputLabelRef = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    if (inputLabelRef && inputLabelRef.current) {
      setLabelWidth(inputLabelRef.current.offsetWidth);
    }
  }, []);

  return { inputLabelRef, labelWidth };
};
