import { useEffect, useRef, useState } from 'react';

const useSticky = ({ enterDelay = 0, exitDelay = 200, onMouseEnter } = {}) => {
  const [show, setShow] = useState(false);
  const enterTimeout = useRef();
  const exitTimeout = useRef();

  useEffect(() => () => {
    clearTimeout(enterTimeout.current);
    clearTimeout(exitTimeout.current);
  });

  const onTargetEnter = () => {
    clearTimeout(enterTimeout.current);
    enterTimeout.current = setTimeout(() => {
      setShow(true);

      if (onMouseEnter) {
        onMouseEnter();
      }
    }, enterDelay);
  };

  const onStickyEnter = () => {
    clearTimeout(exitTimeout.current);
    setShow(true);
  };

  const onMouseLeave = () => {
    clearTimeout(enterTimeout.current);
    exitTimeout.current = setTimeout(() => setShow(false), exitDelay);
  };

  return {
    targetProps: { onMouseEnter: onTargetEnter, onMouseLeave },
    stickyProps: { onMouseEnter: onStickyEnter, onMouseLeave },
    show,
  };
};

export default useSticky;
