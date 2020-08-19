import React from 'react';

import PageHead from 'core/components/PageHead';
import T from 'core/components/Translation';

const PageApp = ({ id, rightComponent, children, title }) => (
  <section id={id} className="page-app">
    <PageHead titleId={id} title={title} />

    <div className="page-app-title">
      <h1>{title || <T id={`${id}.title`} />}</h1>
      {rightComponent}
    </div>

    <div className="page-app-content animated fadeIn">{children}</div>
  </section>
);

export default PageApp;
