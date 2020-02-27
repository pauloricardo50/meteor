import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/pro-light-svg-icons/faTag';

import FrontConversationTaggerContainer from './FrontConversationTaggerContainer';
import FrontConversationTaggerResults from './FrontConversationTaggerResults';
import FrontModal from '../../FrontModal';

const formatTag = tag => tag.replace('/', ' > ').replace('_', '-');

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
        label: 'Tags',
        style: { marginRight: '8px' },
        icon: <FontAwesomeIcon icon={faTag} className="icon" />,
        secondary: !hasLoanTags,
        primary: hasLoanTags,
      }}
      title="Tags"
    >
      <div className="flex center-align">
        {tags
          .filter(tag => tag.includes('loan'))
          .map(tag => (
            <span key={tag} className="front-tag">
              {formatTag(tag)}
            </span>
          ))}
      </div>
      <h3 className="mt-16 mb-8">Ajouter un tag</h3>
      <p className="description mb-8 mt-0">
        Recherchez un dossier par numéro, nom ou utilisateur
      </p>
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
