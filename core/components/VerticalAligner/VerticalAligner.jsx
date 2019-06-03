// @flow
import React, { Component } from 'react';

type VerticalAlignerProps = {};

const getOffset = (el) => {
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return _y;
};

const resetMargins = (nodes) => {
  nodes.forEach((node) => {
    //   Reset all margins before processing
    // node.style.marginTop = `0px !important`;
    node.style.setProperty('margin-top', '0px', 'important');
  });
};

const setMargin = (node, margin) => {
  node.style.setProperty('margin-top', `${margin}px`);
};

const makeUpdateMargins = (target, defaultMargin = 0) => () => {
  console.log('updateing!!');

  const nodes = document.querySelectorAll(`${target} [class*='v-align']`);

  const processedClasses = [];

  resetMargins(nodes);

  nodes.forEach((node) => {
    const { classList } = node;
    const verticalAlignerClass = [...classList].find(className =>
      className.includes('v-align'));

    if (processedClasses.includes(verticalAlignerClass)) {
      // Don't process the same nodes twice
      return;
    }

    processedClasses.push(verticalAlignerClass);

    const nodePairs = Array.from(document.getElementsByClassName(verticalAlignerClass));

    if (nodePairs.length <= 1) {
      setMargin(nodePairs[0], defaultMargin);
      return;
    }

    const offsets = nodePairs.map(getOffset);
    nodePairs.forEach((item, index) => {
      const maxOffset = Math.max(...offsets);
      const offsetDifference = maxOffset - offsets[index];
      setMargin(item, offsetDifference + defaultMargin);
    });
  });
};

const pollForChild = (className) => {
  let interval;
  return new Promise((resolve) => {
    interval = setInterval(() => {
      const elements = document.getElementsByClassName(className);

      if (elements) {
        clearInterval(interval);
        resolve(Array.from(elements));
      }
    }, 50);
  });
};

class VerticalAligner extends Component {
  async componentDidMount() {
    const { defaultMargin, id } = this.props;
    const className = this.getClassName();
    const elements = await pollForChild(className);
    const target = `[class*='${id}']`;

    const MutObserver = window.MutationObserver || window.WebKitMutationObserver;

    if (!MutObserver) {
      return;
    }

    const updateFunc = makeUpdateMargins(target, defaultMargin);
    updateFunc();

    this.observer = new MutObserver(updateFunc);
    elements.forEach((element) => {
      this.observer.observe(element, { childList: true, subtree: true });
    });
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  getClassName() {
    const { id, nb } = this.props;
    return `${id}-${nb}`;
  }

  render() {
    const { children } = this.props;
    const mappedChildren = React.Children.map(children, child =>
      React.cloneElement(child, { className: this.getClassName() }));
    return mappedChildren;
  }
}

export default VerticalAligner;
