import React, { PropTypes } from 'react';

const styles = {
  section: {
    padding: 20,
  },
};

const questions = [
  {
    q: 'Que sont les frais de notaire?',
    a: 'XXX.',
    show: true,
  },
  {
    q: 'Pourquoi les coûts mensuels sont ils estimés?',
    a: "Vous n'avez pas encore choisi votre prêteur et choisi vos taux réels, lorsque ce sera fait nous aurons un montant quasi exact. Vos taux peuvent encore changer et seront définitifs 2 semaines avant le décaissement.",
    show: true,
  },
  {
    q: "Comment calculez vous mes frais d'entretien?",
    a: "Les frais d'entretien sont fixés par la confédération, et valent 1% de la valeur de votre bien immobilier.",
    show: true,
  },
];

const FinanceFAQ = () => (
  <section style={styles.section}>
    <div className="text-center">
      <h3>Questions Fréquentes</h3>
    </div>
    {questions.map(
      (question, index) => question.show &&
      <article key={index}>
        <h4>{question.q}</h4>
        <p>{question.a}</p>
        <br />
      </article>,
    )}
  </section>
);

export default FinanceFAQ;
