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
      tags,
      setTags,
      loanTag,
    } = this.props;
    const { user: { alias } = {} } = Front;

    setLoading(true);
    if (isTagged) {
      return EpotekFrontApi.callMethod('frontUntagLoan', {
        loanId,
        conversationId,
      }).then(() => {
        setTags(
          tags.filter(tag => tag !== loanTag && !tag.includes(`${loanTag} `)),
        );
        setLoading(false);
      });
    }

    return EpotekFrontApi.callMethod('frontTagLoan', {
      loanId,
      conversationId,
    }).then(() => {
      setLoading(false);
      setTags([...tags, loanTag]);
      Front.moveToInbox('team');
      Front.assign(alias);
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

export default withProps(({ loan, conversation, setRef, tags }) => {
  const { _id: loanId } = loan;
  const { id: conversationId } = conversation;
  const loanTag = getLoanTag(loan);
  const isTagged = tags.some(
    tag => tag === loanTag || tag.includes(`${loanTag} `),
  );
  const [loading, setLoading] = useState(false);

  return {
    setLoading,
    isTagged,
    loanId,
    conversationId,
    loading,
    ref: setRef,
    loanTag,
  };
})(LoanTagger);
