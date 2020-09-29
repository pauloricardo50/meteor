import React from 'react';

import { BORROWERS_COLLECTION } from '../../../../../api/borrowers/borrowerConstants';
import Properties from '../../../../../api/properties';
import { PROPERTIES_COLLECTION } from '../../../../../api/properties/propertyConstants';
import collectionIcons from '../../../../../arrays/collectionIcons';
import Calculator from '../../../../../utils/Calculator';
import { createRoute } from '../../../../../utils/routerUtils';
import Button from '../../../../Button';
import Icon from '../../../../Icon';
import T from '../../../../Translation';
import UpdateField from '../../../../UpdateField';
import MortgageNotesPickerList from './MortgageNotesPickerList';

const MortgageNotesPickerDialog = props => {
  const {
    borrowerMortgageNotes,
    currentMortgageNotes,
    availableMortgageNotes,
    loan: { _id: loanId },
    removeMortgageNote,
  } = props;
  const property = Calculator.selectProperty(props);

  if (!property?._id) {
    return (
      <p className="description">
        <T defaultMessage="Choisissez un bien immobilier sur ce plan financier avant d'ajouter des cédules." />
      </p>
    );
  }

  const { canton, _id: propertyId } = property;

  if (!canton) {
    return (
      <div className="flex-col">
        <p className="description">
          <T defaultMessage="Entrez le code postal du bien immobilier pour déterminer le canton duquel vos cédules vont provenir." />
        </p>
        <UpdateField
          doc={property}
          fields={['zipCode']}
          collection={Properties}
        />
      </div>
    );
  }

  return (
    <div className="mortgage-notes-picker-dialog">
      <h4>
        <T defaultMessage="Cédules existantes" />
      </h4>

      {currentMortgageNotes.length === 0 && (
        <div className="flex-col center-align">
          <span className="mb-8">
            <T defaultMessage="Ajoutez des cédules sur ce bien immobilier pour les faire apparaître ici." />
          </span>
          <Button
            primary
            raised
            link
            to={createRoute(`/loans/${loanId}/properties/${propertyId}`)}
            icon={<Icon type={collectionIcons[PROPERTIES_COLLECTION]} />}
          >
            <T defaultMessage="Ajouter cédules" />
          </Button>
        </div>
      )}
      <MortgageNotesPickerList mortgageNotes={currentMortgageNotes} />

      <h4>
        <T defaultMessage="Autres cédules disponibles" />
      </h4>
      <MortgageNotesPickerList
        mortgageNotes={borrowerMortgageNotes}
        removeMortgageNote={removeMortgageNote}
        canton={canton}
      />
      {!borrowerMortgageNotes.filter(({ available }) => available).length && (
        <div className="flex-col center-align">
          <span className="mb-8">
            <T
              defaultMessage="Ajoutez des cédules du canton de {canton} sur un emprunteur pour pouvoir les choisir ici."
              values={{
                canton: (
                  <b>
                    <T id={`Forms.canton.${canton}`} />
                  </b>
                ),
              }}
            />
          </span>
          <Button
            primary
            raised
            link
            to={createRoute(`/loans/${loanId}/borrowers`)}
            icon={<Icon type={collectionIcons[BORROWERS_COLLECTION]} />}
          >
            <T defaultMessage="Ajouter cédules" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MortgageNotesPickerDialog;
