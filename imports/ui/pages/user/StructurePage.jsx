import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import cleanMethod from '/imports/api/cleanMethods';
import RaisedButton from 'material-ui/RaisedButton';
import CheckIcon from 'material-ui/svg-icons/navigation/check';

const handleClick = props => {
  // Save data to DB
  const object = {};
  object['logic.hasValidatedStructure'] = true;

  cleanMethod('updateRequest', object, props.loanRequest._id, () =>
    Meteor.setTimeout(() => props.history.push('/app'), 300));
};

const StructurePage = props => {
  return (
    <section className="mask1">
      <h1>Structure du Projet <small>En Développement</small></h1>
      <div className="description">
        <p>Ici, vous pourrez ajuster la structure globale du projet.</p>
      </div>

      <div className="text-center" style={{ margin: '40px 0' }}>
        <RaisedButton
          label="Valider la structure"
          onTouchTap={() => handleClick(props)}
          primary={!props.loanRequest.logic.hasValidatedStructure}
          icon={
            !!props.loanRequest.logic.hasValidatedStructure && <CheckIcon />
          }
        />
      </div>
    </section>
  );
};

StructurePage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default StructurePage;
