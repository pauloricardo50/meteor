import React from 'react';
import { NavLink } from 'react-router-dom';

const Tabs = ({ loan, borrowers }) => {
  const links = [
    {
      to: `/loans/${loan._id}/borrowers/${borrowers[0]._id}/personal`,
      text: 'Informations',
    },
    {
      to: `/loans/${loan._id}/borrowers/${borrowers[0]._id}/finance`,
      text: 'Finances',
    },
    {
      to: `/loans/${loan._id}/borrowers/${borrowers[0]._id}/files`,
      text: 'Documents',
    },
  ];

  return (
    <div className="process-tabs">
      <ul className="process-tabs__wrapper">
        {links.map((link, index) => (
          <li key={index} className="process-tabs__item">
            <NavLink to={link.to} activeClassName="active">
              {link.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
