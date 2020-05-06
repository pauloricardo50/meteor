import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { faFilePdf } from '@fortawesome/pro-light-svg-icons/faFilePdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ROLES } from 'core/api/users/userConstants';
import Icon from 'core/components/Icon/Icon';

import GetLoanPDFContainer from './GetLoanPDFContainer';
import PdfDownloadDialog from './PdfDownloadDialog';

const GetLoanPDF = ({ handlePDF, handleHTML, loan }) => (
  <>
    <PdfDownloadDialog
      onSubmit={values => handlePDF(values)}
      buttonLabel="PDF"
      icon={<Icon size={16} type={<FontAwesomeIcon icon={faFilePdf} />} />}
      loan={loan}
      dialogTitle="Télécharger PDF"
    />
    <PdfDownloadDialog
      onSubmit={values => handlePDF({ ...values, anonymous: true })}
      buttonLabel="PDF anonyme"
      icon={<Icon size={16} type={<FontAwesomeIcon icon={faFilePdf} />} />}
      loan={loan}
      dialogTitle="Télécharger PDF anonyme"
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
