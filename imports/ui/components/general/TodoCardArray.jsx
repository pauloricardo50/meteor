import React, { PropTypes } from 'react';

import TodoCard from './TodoCard.jsx';

const styles = {
  ul: {
    padding: 0,
  },
  hr: {
    marginTop: 0,
  },
};

const TodoCardArray = props => (
  <section className="animated fadeIn">
    <p className="text-center secondary">
      Appuyez sur une carte incomplète pour avancer
    </p>

    <hr style={styles.hr} />

    <ul style={styles.ul}>
      {props.cards.map((card, index) => (
        <TodoCard
          {...card}
          completionPercentage={props.progress[index]}
          key={index}
          // If the array length is odd (% 2), return true when this is the last card
          center={
            props.cards.length % 2 ? index === props.cards.length - 1 : false
          }
        />
      ))}
    </ul>

  </section>
);

TodoCardArray.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  progress: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default TodoCardArray;
