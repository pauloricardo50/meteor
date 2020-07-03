import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { faFilePdf } from '@fortawesome/pro-light-svg-icons/faFilePdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PDF_TYPES } from 'core/api/pdf/pdfConstants';
import { ROLES } from 'core/api/users/userConstants';
import Icon from 'core/components/Icon/Icon';

import PdfDisplayer from '../PdfDisplayer/PdfDisplayer';
import GetLoanPDFContainer from './GetLoanPDFContainer';
import PdfDownloadDialog from './PdfDownloadDialog';

const GetLoanPDF = ({ handlePDF, handleHTML, loan }) => (
  <>
    {!!loan.maxPropertyValue?.date && (
      <PdfDisplayer
        pdfType={PDF_TYPES.SIMPLE_FINANCING_CERTIFICATE}
        pdfProps={{ loan }}
        buttonProps={{ label: 'Accord de principe', className: 'mr-4' }}
      />
    )}
    <PdfDownloadDialog
      onSubmit={values => handlePDF(values)}
      buttonLabel="PDF du dossier"
      icon={<Icon size={16} type={<FontAwesomeIcon icon={faFilePdf} />} />}
      loan={loan}
      dialogTitle="Télécharger PDF"
    />
    {Roles.userIsInRole(Meteor.user(), ROLES.DEV) && (
      <PdfDownloadDialog
        onSubmit={values => handleHTML(values)}
        buttonLabel={'<HTML />'}
        icon={<Icon size={16} type={<FontAwesomeIcon icon={faFilePdf} />} />}
        loan={loan}
        dialogTitle="Télécharger HTML"
      />
    )}
  </>
);

export default GetLoanPDFContainer(GetLoanPDF);
