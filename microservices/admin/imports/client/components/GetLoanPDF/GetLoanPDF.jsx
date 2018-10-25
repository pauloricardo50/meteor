// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import fileSaver from 'file-saver';
import { compose, withState, withProps } from 'recompose';

import Button from 'core/components/Button/Button';
import { generatePDF } from 'core/api/PDFGenerator/methodDefinitions';
import message from 'core/utils/message';
import { ROLES, PDF_TYPES } from 'core/api/constants';
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
      onClick={handlePDF}
      loading={loading}
      style={{ marginTop: 16 }}
    >
      Générer PDF anonyme
    </Button>
    {Meteor.user().roles.includes(ROLES.DEV) && (
      <Button
        raised
        primary
        onClick={handleHTML}
        loading={loading}
        style={{ marginTop: 16, marginLeft: 16 }}
      >
        Générer PDF HTML
      </Button>
    )}
  </>
);

export default compose(
  withState('loading', 'setLoading', false),
  withProps(({ setLoading, loan: { name, _id: loanId } }) => ({
    handlePDF: () => {
      setLoading(true);
      generatePDF
        .run({ type: PDF_TYPES.ANONYMOUS_LOAN, params: { loanId } })
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
        .finally(() => setLoading(false));
    },
    handleHTML: () => {
      setLoading(true);
      generatePDF
        .run({ type: PDF_TYPES.ANONYMOUS_LOAN, params: { loanId, HTML: true } })
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
