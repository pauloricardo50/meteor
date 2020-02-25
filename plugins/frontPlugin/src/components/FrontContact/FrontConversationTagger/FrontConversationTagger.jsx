import React from 'react';
import FrontConversationTaggerContainer from './FrontConversationTaggerContainer';
import FrontConversationTaggerResults from './FrontConversationTaggerResults';
import FrontModal from '../../FrontModal';
import Icon from '../../../core/components/Icon';

const FrontConversationTagger = ({
  fetchLoans,
  conversation,
  tags,
  setTags,
}) => {
  const hasLoanTags = tags.filter(tag => tag.includes('loan')).length > 0;
  return (
    <FrontModal
      buttonProps={{
        label: 'Tag',
        style: { marginRight: '8px' },
        icon: <Icon type="add" />,
        secondary: !hasLoanTags,
        primary: hasLoanTags,
      }}
      title="Taguer la conversation"
    >
      <FrontConversationTaggerResults
        fetchLoans={fetchLoans}
        conversation={conversation}
        tags={tags}
        setTags={setTags}
      />
    </FrontModal>
  );
};

export default FrontConversationTaggerContainer(FrontConversationTagger);
