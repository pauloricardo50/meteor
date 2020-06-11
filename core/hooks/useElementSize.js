import { useState } from 'react';
import useInterval from 'react-use/lib/useInterval';

const POLLING_INTERVAL = 100;
const STABILIZATION_TIME = 300;

const areEqual = (a = {}, b = {}) =>
  Math.round(a.x) === Math.round(b.x) && Math.round(a.y) === Math.round(b.y);

// Gets the dimension of an element until it stablizes
// Due to loading data, etc. an element's size can change in the first
// few seconds of it being rendered, including with other elements pushing
// it down
// This hook polls the UI until it has stabilized for STABILIZATION_TIME milliseconds
const useElementSize = getElement => {
  const [dimensions, setDimensions] = useState();
  const [isPolling, setIsPolling] = useState(true);
  const [counter, setCounter] = useState(0);

  useInterval(
    () => {
      if (!isPolling) {
        return;
      }

      const element = getElement();

      if (element) {
        const newDimensions = element.getBoundingClientRect();

        if (areEqual(dimensions, newDimensions)) {
          if (counter > STABILIZATION_TIME / POLLING_INTERVAL) {
            setIsPolling(false);
          } else {
            setCounter(counter + 1);
          }
        } else {
          setCounter(0);
          setDimensions(newDimensions);
        }
      }
    },
    isPolling ? POLLING_INTERVAL : null,
  );

  return isPolling ? {} : dimensions;
};

export default useElementSize;
