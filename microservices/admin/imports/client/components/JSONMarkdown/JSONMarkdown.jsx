import 'highlight.js/styles/github.css';

import React from 'react';
import hljs from 'highlight.js';
import ReactMarkdown from 'react-markdown';

class JSONBlock extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setRef = this.setRef.bind(this);
  }

  setRef(el) {
    this.codeEl = el;
  }

  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    hljs.highlightBlock(this.codeEl);
  }

  render() {
    return (
      <pre>
        <code ref={this.setRef} className="language-json">
          {this.props.value}
        </code>
      </pre>
    );
  }
}

const formatObject = object => {
  const stringified = JSON.stringify(object, null, 2);
  return [`\`\`\`json`, stringified, `\`\`\``].join('\n');
};

const JSONMarkdown = ({ object }) => (
  <ReactMarkdown
    source={formatObject(object)}
    renderers={{ code: JSONBlock }}
  />
);

export default JSONMarkdown;
