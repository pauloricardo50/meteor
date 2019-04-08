// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import Loading from 'core/components/Loading';
import MaxPropertyValueResults from 'core/components/MaxPropertyValue/MaxPropertyValueResults';
import MaxPropertyValueContainer, {
  STATE,
} from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import { CANTONS } from 'core/api/constants';

type SimpleMaxPropertyValueProps = {};

export const SimpleMaxPropertyValue = (props: MaxPropertyValueProps) => {
  const { state, onChangeCanton, canton: cantonValue, loading } = props;

  if (loading) {
    return (
      <div className="simple-max-property-value loading">
        <div className="animated fadeIn">
          <Loading />
          <h4>Algorithmes au travail...</h4>
          <p>Détendez-vous un instant</p>
        </div>
      </div>
    );
  }

  if (state !== STATE.DONE) {
    return (
      <div className="simple-max-property-value">
        <h3>
          <T id="MaxPropertyValue.title" />
        </h3>
        <div className="empty">
          {state === STATE.MISSING_INFOS ? (
            <>
              <FontAwesomeIcon className="icon" icon={faUsers} />

              <h4>
                Complétez vos informations pour calculer votre capacité d'achat
                maximale.
              </h4>
            </>
          ) : (
            <>
              <h4>Choisissez le canton dans lequel vous souhaitez acheter</h4>
              <Select
                value={cantonValue}
                onChange={onChangeCanton}
                options={Object.keys(CANTONS).map((shortCanton) => {
                  const canton = CANTONS[shortCanton];
                  return { id: shortCanton, label: canton };
                })}
                disabled={loading}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="simple-max-property-value">
      <MaxPropertyValueResults {...props} />
    </div>
  );
};
export default MaxPropertyValueContainer(SimpleMaxPropertyValue);
