// @flow
import React from 'react';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import Loading from 'core/components/Loading';
import MaxPropertyValueResults from 'core/components/MaxPropertyValue/MaxPropertyValueResults';
import MaxPropertyValueContainer, {
  STATE,
} from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import { CANTONS } from 'core/api/constants';

type SimpleMaxPropertyValueProps = {};

const SimpleMaxPropertyValue = (props: MaxPropertyValueProps) => {
  const { state, changeCanton, canton: cantonValue, loading } = props;

  if (loading) {
    return (
      <div className="simple-max-property-value loading">
        <Loading />
        <h5>Calcul en cours</h5>
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
                onChange={changeCanton}
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
