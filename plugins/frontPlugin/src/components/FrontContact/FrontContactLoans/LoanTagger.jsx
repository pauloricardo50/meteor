import React, { useState } from 'react';
import { withProps } from 'recompose';

import Checkbox from '../../../core/components/Checkbox';
import EpotekFrontApi from '../../../EpotekFrontApi';

export const getLoanTag = loan => {
  const { name } = loan;

  return `loan/${name.replace('-', '_')}`;
};

const { Front } = window;

class LoanTagger extends React.Component {
  handleChange = () => {
    const {
      setLoading,
      isTagged,
      loanId,
      conversationId,
      setTagIds,
      refetch,
    } = this.props;
    const { user: { alias } = {} } = Front;

    setLoading(true);
    if (isTagged) {
      return EpotekFrontApi.callMethod('frontUntagLoan', {
        loanId,
        conversationId,
      }).then(response => {
        const { tagIds: newTagIds = [] } = response;
        setTagIds(newTagIds);
        setLoading(false);
        refetch();
      });
    }

    return EpotekFrontApi.callMethod('frontTagLoan', {
      loanId,
      conversationId,
    }).then(response => {
      const { tagIds: newTagIds = [] } = response;
      setLoading(false);
      setTagIds(newTagIds);
      Front.moveToInbox('team');
      Front.assign(alias);
      refetch();
    });
  };

  render() {
    const { withLabel = true, label, isTagged, loading } = this.props;

    return (
      <>
        <Checkbox
          onChange={this.handleChange}
          value={isTagged}
          label={
            withLabel
              ? label || (
                  <small>
                    Cette conversation concerne ce dossier
                    <br />
                    <span className="secondary">Apparaîtra dans Admin</span>
                  </small>
                )
              : ''
          }
          disabled={loading}
        />
      </>
    );
  }
}

export default withProps(({ loan, conversation, setRef, tagIds }) => {
  const { _id: loanId, frontTagId: loanTagId } = loan;
  const { id: conversationId } = conversation;
  const isTagged = tagIds.some(tag => tag === loanTagId);
  const [loading, setLoading] = useState(false);

  return {
    setLoading,
    isTagged,
    loanId,
    conversationId,
    loading,
    ref: setRef,
  };
})(LoanTagger);
