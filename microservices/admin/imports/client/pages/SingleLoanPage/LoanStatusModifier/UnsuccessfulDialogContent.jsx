// @flow
import React from 'react';

type UnsuccessfulDialogContentProps = {
  loan: Object,
  setOpenDialog: Function,
  promise: Object,
};

const UnsuccessfulDialogContent = ({
  loan,
  setOpenDialog,
  promise,
}: UnsuccessfulDialogContentProps) => (
  <div>
    Hello world
    {promise.resolve()}
    <div onClick={() => setOpenDialog(false)}>Test</div>
  </div>
);

export default UnsuccessfulDialogContent;
