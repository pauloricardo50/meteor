import React from 'react';
import htmlParse from 'html-parse-stringify';

import { autoTooltipParser } from 'core/components/tooltips/AutoTooltip';

const htmlDecode = input => {
  const e = document.createElement('div');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
};

const formatTags = array =>
  array.map(
    ({ type, name: Tag, children, attrs, content, voidElement }, index) => {
      if (type === 'text') {
        return autoTooltipParser(htmlDecode(content));
      }

      if (type !== 'tag') {
        return content;
      }

      if (voidElement) {
        return <Tag />;
      }

      if (Tag !== 'p') {
        return (
          <Tag
            {...attrs}
            key={index}
            dangerouslySetInnerHTML={{ __html: htmlParse.stringify(children) }}
          />
        );
      }

      return <p key={index}>{formatTags(children)}</p>;
    },
  );

const AutoTooltipInjector = ({ html }) => {
  const parsedHtml = htmlParse.parse(html);

  return formatTags(parsedHtml);
};

export default AutoTooltipInjector;
