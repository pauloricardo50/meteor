import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import cleanMethod from '/imports/api/cleanMethods';
import LoadingButton from '/imports/ui/components/general/LoadingButton.jsx';

const handleClick = props => {
  // Save data to DB
  const object = {};
  object['logic.hasValidatedStructure'] = true;

  cleanMethod('updateRequest', object, props.loanRequest._id, () =>
    Meteor.setTimeout(() => props.history.push('/app'), 300),
  );
};

const StructurePage = props => {
  return (
    <section className="mask1">
      <h1>Structure du Projet <small>En Développement</small></h1>
      <div className="description">
        <p>Ici, vous pourrez ajuster la structure globale du projet.</p>
      </div>

      <div className="text-center" style={{ margin: '40px 0' }}>

        <LoadingButton
          label="Valider la structure"
          handleClick={() => handleClick(props)}
          value={props.loanRequest.logic.hasValidatedStructure}
          history={props.history}
        />
      </div>
    </section>
  );
};

StructurePage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default StructurePage;
