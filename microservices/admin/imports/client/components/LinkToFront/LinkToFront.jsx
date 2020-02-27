import React from 'react';

import Button from 'core/components/Button';

// FIXME: This does not work yet
const getFrontLink = ({ tagId, email }) => {
  if (email) {
    return 'https://app.frontapp.com/inboxes/teams/views/15931074/open/7762260226';
  }

  if (tagId) {
    const tagName = 'tag:loan/19-0354';
    return `https://app.frontapp.com/search/${encodeURI(tagName)}`;
  }
};

const LinkToFront = ({ tagId, email, ...props }) => {
  const link = getFrontLink({ tagId, email });
  if (!link) {
    return null;
  }

  return (
    <a href={link} rel="noopener noreferrer" target="_blank" {...props}>
      <Button raised>
        <img
          src="/img/front-logo.svg"
          alt="Front"
          className="mr-8"
          style={{ width: 24, height: 24 }}
        />
        <span>Front</span>
      </Button>
    </a>
  );
};

export default LinkToFront;
