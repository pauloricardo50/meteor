import React, { useMemo } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import fileSaver from 'file-saver';
import SimpleSchema from 'simpl-schema';

import { borrowerUpdate } from '../../api/borrowers/methodDefinitions';
import { loanUpdate } from '../../api/loans/methodDefinitions';
import { getSimpleFinancingCertificate } from '../../api/pdf/methodDefinitions';
import { RESIDENCE_TYPE } from '../../api/properties/propertyConstants';
import createTheme from '../../config/muiCustom';
import useCurrentUser from '../../hooks/useCurrentUser';
import { base64ToBlob } from '../../utils/base64-to-blob';
import { AutoFormDialog } from '../AutoForm2';
import Box from '../Box';
import Icon from '../Icon';
import T from '../Translation';

const getSchema = has2Borrowers =>
  new SimpleSchema({
    firstName1: {
      type: String,
      uniforms: { label: <T id="Forms.firstName" />, placeholder: null },
    },
    lastName1: {
      type: String,
      uniforms: { label: <T id="Forms.lastName" />, placeholder: null },
    },
    firstName2: {
      type: String,
      uniforms: { label: <T id="Forms.firstName" />, placeholder: null },
      condition: has2Borrowers,
      required: has2Borrowers,
    },
    lastName2: {
      type: String,
      uniforms: { label: <T id="Forms.lastName" />, placeholder: null },
      condition: has2Borrowers,
      required: has2Borrowers,
    },
    residenceType: {
      type: String,
      allowedValues: [
        RESIDENCE_TYPE.MAIN_RESIDENCE,
        RESIDENCE_TYPE.SECOND_RESIDENCE,
      ],
      uniforms: { checkboxes: true },
    },
  });

const makeHandleSubmit = ({ _id: loanId, name, borrowers }) => async ({
  firstName1,
  lastName1,
  firstName2,
  lastName2,
  residenceType,
}) => {
  const result = await Promise.all([
    loanUpdate.run({ loanId, object: { residenceType } }),
    borrowerUpdate.run({
      borrowerId: borrowers[0]._id,
      object: { firstName: firstName1, lastName: lastName1 },
    }),
    borrowers.length > 1 &&
      borrowerUpdate.run({
        borrowerId: borrowers[1]._id,
        object: { firstName: firstName2, lastName: lastName2 },
      }),
  ]);

  const string = await getSimpleFinancingCertificate.run({ loanId });
  fileSaver.saveAs(
    base64ToBlob(string),
    `e-Potek, Accord de principe – ${name}.pdf`,
  );

  return result;
};

const MaxPropertyValueCertificate = ({ loan }) => {
  const currentUser = useCurrentUser();
  const { residenceType, borrowers } = loan;
  const has2Borrowers = borrowers?.length > 1;
  const schema = useMemo(() => getSchema(has2Borrowers), [has2Borrowers]);
  const disabled = !currentUser?._id;

  return (
    <MuiThemeProvider theme={createTheme()}>
      <AutoFormDialog
        model={{
          residenceType,
          firstName1: borrowers?.[0]?.firstName,
          lastName1: borrowers?.[0]?.lastName,
          firstName2: borrowers?.[1]?.firstName,
          lastName2: borrowers?.[1]?.lastName,
        }}
        schema={schema}
        buttonProps={{
          icon: <Icon type="download" />,
          label: <T id="MaxPropertyValueCertificate.download" />,
          raised: true,
          disabled,
          tooltip: disabled ? (
            <T id="MaxPropertyValueCertificate.disabledTooltip" />
          ) : null,
          fullWidth: true,
        }}
        onSubmit={makeHandleSubmit(loan)}
        title={<T id="MaxPropertyValueCertificate.download" />}
        description={<T id="MaxPropertyValueCertificate.description" />}
        layout={[
          {
            fields: ['firstName1', 'lastName1'],
            className: 'grid-2 mb-16',
            Component: Box,
            title: <T id="general.borrowerWithIndex" values={{ index: '1' }} />,
          },
          has2Borrowers && {
            fields: ['firstName2', 'lastName2'],
            className: 'grid-2',
            Component: Box,
            title: <T id="general.borrowerWithIndex" values={{ index: '2' }} />,
          },
          'residenceType',
        ].filter(x => x)}
      />
    </MuiThemeProvider>
  );
};

export default MaxPropertyValueCertificate;
