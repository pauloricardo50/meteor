import { useEffect, useState } from 'react';

const useSticky = ({ enterDelay = 0, exitDelay = 200 } = {}) => {
  const [show, setShow] = useState(false);
  const [enterTimeout, setEnterTimeout] = useState(null);
  const [exitTimeout, setExitTimeout] = useState(null);

  useEffect(
    () => () => {
      clearTimeout(enterTimeout);
      clearTimeout(exitTimeout);
    },
    [enterTimeout, exitTimeout],
  );

  const onTargetEnter = () => {
    clearTimeout(enterTimeout);
    setEnterTimeout(setTimeout(() => setShow(true), enterDelay));
  };

  const onStickyEnter = () => {
    clearTimeout(exitTimeout);
    setShow(true);
  };

  const onMouseLeave = () => {
    clearTimeout(enterTimeout);
    setExitTimeout(setTimeout(() => setShow(false), exitDelay));
  };

  return {
    targetProps: {
      onMouseEnter: onTargetEnter,
      onMouseLeave,
    },
    stickyProps: {
      onMouseEnter: onStickyEnter,
      onMouseLeave,
    },
    show,
  };
};

export default useSticky;
