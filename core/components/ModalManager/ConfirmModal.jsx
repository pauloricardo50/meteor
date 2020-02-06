//
import React, { useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '../Button';
import T from '../Translation';
import TextInput from '../TextInput';

const ConfirmModal = ({
  closeModal,
  closeAll,
  title,
  description,
  keyword,
  func,
}) => {
  const [keywordState, setKeyword] = useState('');
  const [loading, setLoading] = useState('');

  const handleSubmit = event => {
    event.preventDefault();

    if (!keyword || keyword === keywordState) {
      setLoading(true);
      return func()
        .then(closeModal)
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <DialogTitle>Confirmer?</DialogTitle>
      <DialogContent>
        {description && <DialogContentText>{description}</DialogContentText>}
        {keyword && (
          <>
            <T
              id="ConfirmMethod.dialogMessage"
              values={{ keyword: <b>{keyword}</b> }}
            />
            <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
              <TextInput
                value={keywordState}
                onChange={v => setKeyword(v)}
                style={{ marginTop: 16 }}
                autoFocus
              />
            </form>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button primary label={<T id="general.no" />} onClick={closeModal} />
        <Button
          primary
          label={<T id="general.yes" />}
          onClick={handleSubmit}
          disabled={keyword ? keywordState !== keyword : false}
          loading={loading}
        />
      </DialogActions>
    </>
  );
};

export default ConfirmModal;
