import './Testimonials.scss';

import React, { useReducer } from 'react';
import Fab from '@material-ui/core/Fab';

import Icon from 'core/components/Icon';

import { RichText } from '../prismic';
import Testimonial from './Testimonial';

const makeReducer = ({ testimonials }) => (state, action) => {
  const { id } = state;
  const next = id === testimonials.length - 1 ? 0 : id + 1;
  const prev = id === 0 ? testimonials.length - 1 : id - 1;

  switch (action.type) {
    case 'next':
      return { id: next };
    case 'prev':
      return { id: prev };
    default:
      return state;
  }
};

const Testimonials = ({ primary, fields: testimonials = [] }) => {
  const reducer = makeReducer({ testimonials });

  const [{ id }, dispatch] = useReducer(reducer, { id: 0 });

  const {
    customer_name: customerName,
    customer_title: customerTitle,
    customer_quote: quote,
  } = testimonials[id];

  return (
    <div className="testimonials">
      <div className="testimonials-heading">
        <RichText render={primary.testimonials_heading} />
      </div>
      <div className="testimonials-content">
        <Fab
          onClick={() => dispatch({ type: 'prev' })}
          color="primary"
          size="small"
          className="mr-8"
          aria-label="Previous"
        >
          <Icon type="left" />
        </Fab>
        <Testimonial
          key={id}
          customerName={customerName}
          customerTitle={customerTitle}
          quote={quote}
        />
        <Fab
          onClick={() => dispatch({ type: 'next' })}
          color="primary"
          size="small"
          className="ml-8"
          aria-label="Next"
        >
          <Icon type="right" />
        </Fab>
      </div>
    </div>
  );
};

export default Testimonials;
