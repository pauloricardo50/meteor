import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity } from '@fortawesome/pro-light-svg-icons/faCity';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faChartLine } from '@fortawesome/pro-light-svg-icons/faChartLine';
import { faUserTie } from '@fortawesome/pro-light-svg-icons/faUserTie';
import { faMoneyBillWave } from '@fortawesome/pro-light-svg-icons/faMoneyBillWave';
import { faUserShield } from '@fortawesome/pro-light-svg-icons/faUserShield';
import { faShieldCheck } from '@fortawesome/pro-light-svg-icons/faShieldCheck';

import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { TASKS_COLLECTION } from 'core/api/tasks/taskConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { CONTACTS_COLLECTION } from 'core/api/contacts/contactsConstants';
import { OFFERS_COLLECTION } from 'core/api/offers/offerConstants';
import { INTEREST_RATES_COLLECTION } from 'core/api/interestRates/interestRatesConstants';
import { REVENUES_COLLECTION } from 'core/api/revenues/revenueConstants';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { INSURANCES_COLLECTION } from 'core/api/insurances/insuranceConstants';

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
    <FontAwesomeIcon icon={faShieldCheck} className="collection-icon" />
  ),
  [INSURANCES_COLLECTION]: (
    <FontAwesomeIcon icon={faUserShield} className="collection-icon" />
  ),
};
