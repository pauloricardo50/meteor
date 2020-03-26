import React from 'react';
import { withProps, compose, withState } from 'recompose';
import moment from 'moment';

import T, { Money } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import {
  ORGANISATIONS_COLLECTION,
  REVENUES_COLLECTION,
  LOANS_COLLECTION,
  REVENUE_STATUS,
  INSURANCES_COLLECTION,
  INSURANCE_REQUESTS_COLLECTION,
} from 'core/api/constants';
import { withSmartQuery } from 'core/api/containerToolkit';
import { adminRevenues } from 'core/api/revenues/queries';
import RevenueConsolidator from './RevenueConsolidator';

const now = moment();
const formatDateTime = (date, status) => {
  const momentDate = moment(date);
  const text = date ? momentDate.format("D MMM 'YY") : '-';

  if (momentDate.isBefore(now) && status !== REVENUE_STATUS.CLOSED) {
    return (
      <span className="error-box" style={{ whiteSpace: 'nowrap' }}>
        {text}
      </span>
    );
  }

  return text;
};

const columnOptions = [
  { id: 'loan', label: 'Dossier' },
  { id: 'revenueStatus' },
  { id: 'date' },
  { id: 'type' },
  { id: 'description' },
  { id: 'sourceOrganisationLink' },
  { id: 'amount', align: 'right', style: { whiteSpace: 'nowrap' } },
  { id: 'actions' },
].map(i => ({ ...i, label: i.label || <T id={`Forms.${i.id}`} /> }));

export const makeMapRevenue = ({
  setOpenModifier,
  setRevenueToModify,
}) => revenue => {
  const {
    _id: revenueId,
    expectedAt,
    paidAt,
    amount,
    type,
    secondaryType,
    description,
    status,
    organisations = [],
    sourceOrganisation,
    loan,
    insurance,
    insuranceRequest,
  } = revenue;
  const date = status === REVENUE_STATUS.CLOSED ? paidAt : expectedAt;

  let title;
  if (loan) {
    title = {
      raw: loan && loan.name,
      label: loan && (
        <CollectionIconLink
          relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
        />
      ),
    };
  } else if (insurance) {
    title = {
      raw: insurance && insurance.name,
      label: insurance && (
        <CollectionIconLink
          relatedDoc={{ ...insurance, collection: INSURANCES_COLLECTION }}
        />
      ),
    };
  } else if (insuranceRequest) {
    title = {
      raw: insuranceRequest && insuranceRequest.name,
      label: insuranceRequest && (
        <CollectionIconLink
          relatedDoc={{
            ...insuranceRequest,
            collection: INSURANCE_REQUESTS_COLLECTION,
          }}
        />
      ),
    };
  }

  return {
    id: revenueId,
    organisations,
    amount,
    columns: [
      title,
      {
        raw: status,
        label: <StatusLabel status={status} collection={REVENUES_COLLECTION} />,
      },
      {
        raw: date && date.getTime(),
        label: date && formatDateTime(date, status),
      },
      {
        raw: type,
        label: (
          <span>
            <T id={`Forms.type.${type}`} />
            {secondaryType && (
              <span>
                -
                <T id={`Forms.secondaryType.${secondaryType}`} />
              </span>
            )}
          </span>
        ),
      },
      description,
      {
        raw: sourceOrganisation && sourceOrganisation.name,
        label: (
          <CollectionIconLink
            relatedDoc={{
              ...sourceOrganisation,
              collection: ORGANISATIONS_COLLECTION,
            }}
          />
        ),
      },
      {
        raw: amount,
        label: (
          <b>
            <Money value={amount} rounded={false} />
          </b>
        ),
      },
      <RevenueConsolidator revenue={revenue} key="revenue-consolidator" />,
    ].filter(cell => cell !== null),
    handleClick: () => {
      setRevenueToModify(revenue);
      setOpenModifier(true);
    },
  };
};

export default compose(
  withState('openModifier', 'setOpenModifier', false),
  withState('revenueToModify', 'setRevenueToModify', null),
  withSmartQuery({
    query: adminRevenues,
    params: ({ filterRevenues, ...props }) => ({
      ...filterRevenues(props),
      $body: {
        amount: 1,
        assigneeLink: 1,
        description: 1,
        expectedAt: 1,
        loan: {
          name: 1,
          borrowers: { name: 1 },
          user: { name: 1 },
          userCache: 1,
          assigneeLinks: 1,
        },
        paidAt: 1,
        secondaryType: 1,
        sourceOrganisationLink: 1,
        sourceOrganisation: { name: 1 },
        status: 1,
        type: 1,
        organisationLinks: 1,
        organisations: { name: 1 },
        insurance: { name: 1, insuranceRequest: { _id: 1 } },
        insuranceRequest: { name: 1 },
      },
    }),
    dataName: 'revenues',
  }),
  withProps(({ revenues, postFilter }) => {
    if (postFilter) {
      return { revenues: postFilter(revenues) };
    }
  }),
  withProps(({ revenues = [], setOpenModifier, setRevenueToModify }) => ({
    rows: revenues.map(
      makeMapRevenue({
        setOpenModifier,
        setRevenueToModify,
      }),
    ),
    columnOptions,
  })),
);
