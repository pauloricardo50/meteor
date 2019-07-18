// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';
import cx from 'classnames';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import { STATE } from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import T from 'core/components/Translation';
import Select from 'core/components/Select';
import Button from 'core/components/Button';
import createTheme from 'core/config/muiCustom';

type SimpleMaxPropertyValueEmptyStateProps = {};
const getReadyToCalculateTitle = (props) => {
  const { loan, lockCanton, canton } = props;
  const {
    hasPromotion,
    hasProProperty,
    properties = [],
    promotions = [],
  } = loan;

  if (!lockCanton) {
    return <T id="MaxPropertyValue.empty" />;
  }

  if (hasPromotion) {
    const promotionName = promotions[0].name;
    return (
      <span>
        <T id="MaxPropertyValue.empty.promotion" values={{ promotionName }} />
        <T id={`Forms.canton.${canton}`} />
      </span>
    );
  }

  if (hasProProperty) {
    const propertyName = properties[0].address1;
    return (
      <span>
        <T id="MaxPropertyValue.empty.proProperty" values={{ propertyName }} />
        <T id={`Forms.canton.${canton}`} />
      </span>
    );
  }
};

const SimpleMaxPropertyValueEmptyState = (props: SimpleMaxPropertyValueEmptyStateProps) => {
  const {
    state,
    lockCanton,
    canton: cantonValue,
    onChangeCanton,
    cantonOptions,
    loading,
    recalculate,
    fixed,
    error,
  } = props;

  const defaultTheme = createTheme();
  return (
    <div className={cx('simple-max-property-value', { fixed })}>
      <h2>
        <T id="MaxPropertyValue.title" />
      </h2>
      <div className="empty">
        {state === STATE.MISSING_INFOS ? (
          <>
            <FontAwesomeIcon className="icon" icon={faUsers} />

            <h4 className="secondary">
              <T id="MaxPropertyValue.missingInfos" />
            </h4>
            <p className="secondary">
              <i>
                <T id="MaxPropertyValue.informations" />
              </i>
            </p>
          </>
        ) : (
          <>
            <h4>{getReadyToCalculateTitle(props)}</h4>
            <div
              className={cx('flex-row center space-children', {
                animated: !cantonValue,
                bounceIn: !cantonValue,
              })}
            >
              {!lockCanton && (
                <MuiThemeProvider
                  theme={{
                    ...defaultTheme,
                    overrides: {
                      ...defaultTheme.overrides,
                      MuiListItemText: {
                        root: {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'left',
                        },
                      },
                      MuiInputBase: {
                        root: {
                          color: 'white',
                        },
                      },
                      MuiInput: {
                        underline: {
                          '&:before': {
                            borderBottom: '1px solid rgba(255,255,255,0.6)',
                          },
                          '&&&&:hover:before': {
                            borderBottom: '1px solid white',
                          },
                          '&$focused:after': {
                            borderBottom: '1px solid white',
                          },
                        },
                      },
                      MuiSelect: {
                        icon: {
                          color: 'white',
                        },
                      },
                    },
                  }}
                >
                  <Select
                    value={cantonValue}
                    onChange={onChangeCanton}
                    options={cantonOptions}
                    disabled={loading}
                    placeholder={(
                      <i>
                        <T id="general.pick" />
                      </i>
                    )}
                    error={error && <span className="error-box">{error}</span>}
                  />
                </MuiThemeProvider>
              )}
              <Button
                raised
                onClick={recalculate}
                secondary
                style={{ marginLeft: 16, marginTop: 0 }}
                // disabled={!cantonValue}
              >
                {lockCanton ? "Calculer ma capacité d'achat" : 'Valider'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleMaxPropertyValueEmptyState;
