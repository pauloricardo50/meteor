import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity } from '@fortawesome/pro-light-svg-icons/faCity';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faChartLine } from '@fortawesome/pro-light-svg-icons/faChartLine';
import { faUserTie } from '@fortawesome/pro-light-svg-icons/faUserTie';
import { faMoneyBillWave } from '@fortawesome/pro-light-svg-icons/faMoneyBillWave';
import { faFileContract } from '@fortawesome/pro-light-svg-icons/faFileContract';

import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  TASKS_COLLECTION,
  USERS_COLLECTION,
  PROPERTIES_COLLECTION,
  OFFERS_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  CONTACTS_COLLECTION,
  INTEREST_RATES_COLLECTION,
  REVENUES_COLLECTION,
  INSURANCE_REQUESTS_COLLECTION,
} from '../api/constants';

export default {
  [BORROWERS_COLLECTION]: 'people',
  [LOANS_COLLECTION]: 'dollarSign',
  [TASKS_COLLECTION]: 'check',
  [USERS_COLLECTION]: 'contactMail',
  [PROPERTIES_COLLECTION]: 'building',
  [PROMOTIONS_COLLECTION]: (
    <FontAwesomeIcon icon={faCity} className="collection-icon" />
  ),
  [ORGANISATIONS_COLLECTION]: (
    <FontAwesomeIcon icon={faBriefcase} className="collection-icon" />
  ),
  [CONTACTS_COLLECTION]: (
    <FontAwesomeIcon icon={faUserTie} className="collection-icon" />
  ),
  [OFFERS_COLLECTION]: 'monetizationOn',
  [INTEREST_RATES_COLLECTION]: (
    <FontAwesomeIcon icon={faChartLine} className="collection-icon" />
  ),
  [REVENUES_COLLECTION]: (
    <FontAwesomeIcon icon={faMoneyBillWave} className="collection-icon" />
  ),
  [INSURANCE_REQUESTS_COLLECTION]: (
    <FontAwesomeIcon icon={faFileContract} className="collection-icon" />
  ),
};
