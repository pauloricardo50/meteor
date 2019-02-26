// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/pro-light-svg-icons/faFilePdf';

import { ROLES } from 'core/api/constants';
import Icon from 'core/components/Icon/Icon';
import GetLoanPDFContainer from './GetLoanPDFContainer';
import PdfDownloadDialog from './PdfDownloadDialog';

type GetLoanPDFProps = {
  loan: Object,
  handlePDF: Function,
  handleHTML: Function,
};

const GetLoanPDF = ({ handlePDF, handleHTML, loan }: GetLoanPDFProps) => (
  <>
    <PdfDownloadDialog
      onSubmit={values => handlePDF(values)}
      buttonLabel="PDF"
      icon={<Icon size={16} type={<FontAwesomeIcon icon={faFilePdf} />} />}
      loan={loan}
    />
    <PdfDownloadDialog
      onSubmit={values => handlePDF({ ...values, anonymous: true })}
      buttonLabel="PDF anonyme"
      icon={<Icon size={16} type={<FontAwesomeIcon icon={faFilePdf} />} />}
      loan={loan}
    />
    {Meteor.user().roles.includes(ROLES.DEV) && (
      <PdfDownloadDialog
        onSubmit={values => handleHTML(values)}
        buttonLabel={'<HTML />'}
        icon={<Icon size={16} type={<FontAwesomeIcon icon={faFilePdf} />} />}
        loan={loan}
      />
    )}
  </>
);

export default GetLoanPDFContainer(GetLoanPDF);
