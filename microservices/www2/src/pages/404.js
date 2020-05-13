/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import NotFound from '../components/NotFound';

export default ({ path }) => {
  const [empty, lang, type, rest] = path.split('/');

  return (
    <NotFound pageLang={lang} pageType={type === 'blog' ? 'post' : null} />
  );
};
