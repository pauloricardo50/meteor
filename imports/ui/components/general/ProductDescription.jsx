import React from 'react';

import Col from 'react-bootstrap/lib/Col';

export default class ProductDescription extends React.Component {
  render() {
    return (
      <section className="container-fluid home-section-2">
        <article className="col-sm-6 text-center animated fadeIn">
          <div className="col-sm-10 col-sm-offset-1">
            <span className="fa fa-thumbs-up fa-5x" />
            <h4>Best Deals</h4>
            <p>Best Deals Text</p>
          </div>
        </article>
        <article className="col-sm-6 text-center animated fadeIn">
          <div className="col-sm-10 col-sm-offset-1">
            <span className="fa fa-check-square fa-5x" />
            <h4>Keep Track Title</h4>
            <p>Keep Track text</p>
          </div>
        </article>
      </section>
    );
  }
}
