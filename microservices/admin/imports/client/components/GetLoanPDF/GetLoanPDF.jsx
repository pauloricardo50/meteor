// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import fileSaver from 'file-saver';
import { compose, withState, withProps } from 'recompose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/pro-light-svg-icons/faFilePdf';

import Button from 'core/components/Button/Button';
import { generatePDF } from 'core/api/PDFGenerator/methodDefinitions';
import message from 'core/utils/message';
import { ROLES, PDF_TYPES } from 'core/api/constants';
import Icon from 'imports/core/components/Icon/Icon';
import { base64ToBlob } from './base64-to-blob';

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

export default compose(
  withState('loading', 'setLoading', false),
  withProps(({ setLoading, loan: { name, _id: loanId } }) => ({
    handlePDF: ({ anonymous }) => {
      setLoading(true);
      generatePDF
        .run({
          type: PDF_TYPES.LOAN,
          params: { loanId, options: { anonymous } },
        })
        .then((base64) => {
          if (!base64) {
            return false;
          }

          try {
            return fileSaver.saveAs(base64ToBlob(base64), `${name}.pdf`);
          } catch (error) {
            message.error(error.message, 5);
          }
        })
        .catch(error => message.error(error.message, 5))
        .finally(() => setLoading(false));
    },
    handleHTML: ({ anonymous }) => {
      setLoading(true);
      generatePDF
        .run({
          type: PDF_TYPES.LOAN,
          params: { loanId, options: { HTML: true, anonymous } },
        })
        .then((html) => {
          try {
            return fileSaver.saveAs(new Blob([html]), `${name}.html`);
          } catch (error) {
            message.error(error.message, 5);
          }
        })
        .finally(() => setLoading(false));
    },
  })),
)(GetLoanPDF);
