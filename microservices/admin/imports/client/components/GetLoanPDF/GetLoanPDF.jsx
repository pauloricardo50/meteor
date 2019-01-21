// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/pro-light-svg-icons/faFilePdf';

import Button from 'core/components/Button/Button';

import { ROLES } from 'core/api/constants';
import Icon from 'core/components/Icon/Icon';
import GetLoanPDFContainer from './GetLoanPDFContainer';

type GetLoanPDFProps = {
  loan: Object,
  loading: boolean,
  handleClick: Function,
};

const GetLoanPDF = ({ loading, handlePDF, handleHTML }: GetLoanPDFProps) => (
  <>
    <Button
      raised
      primary
      onClick={() => handlePDF({})}
      loading={loading}
      icon={<Icon size={16} type={<FontAwesomeIcon icon={faFilePdf} />} />}
    >
      PDF
    </Button>

    <Button
      raised
      primary
      onClick={() => handlePDF({ anonymous: true })}
      loading={loading}
      style={{ marginLeft: 8 }}
      icon={<Icon size={16} type={<FontAwesomeIcon icon={faFilePdf} />} />}
    >
      PDF anonyme
    </Button>
    {Meteor.user().roles.includes(ROLES.DEV) && (
      <Button
        raised
        primary
        onClick={() => handleHTML({ anonymous: false })}
        loading={loading}
        style={{ marginLeft: 8 }}
      >
        {'<HTML />'}
      </Button>
    )}
  </>
);

export default GetLoanPDFContainer(GetLoanPDF);
