import React from 'react';

import CalendlyContainer from './CalendlyContainer';

const defaultStyles = {
  minWidth: '320px',
  height: '630px',
};

class CalendlyInline extends React.Component {
  constructor(props) {
    super(props);
    this.parentContainerRef = React.createRef();
  }

  componentDidMount() {
    const { url, scriptSource, loadScript } = this.props;
    if (!document.querySelector(`script[src="${scriptSource}"]`)) {
      loadScript();
    } else {
      window.Calendly.initInlineWidget({
        url,
        parentElement: this.parentContainerRef.current,
      });
    }
  }

  render() {
    const { styles, url } = this.props;
    return (
      <div
        className="calendly-inline-widget"
        style={styles || defaultStyles}
        data-url={url}
        ref={this.parentContainerRef}
      />
    );
  }
}

export default CalendlyContainer(CalendlyInline);
