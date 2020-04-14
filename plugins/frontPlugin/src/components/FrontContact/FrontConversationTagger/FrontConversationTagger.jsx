import React, { useEffect, useState } from 'react';
import { faTag } from '@fortawesome/pro-light-svg-icons/faTag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import EpotekFrontApi from '../../../EpotekFrontApi';
import FrontModal from '../../FrontModal';
import FrontConversationTaggerContainer from './FrontConversationTaggerContainer';
import FrontConversationTaggerResults from './FrontConversationTaggerResults';

const formatTag = tag => {
  const {
    name,
    parentTag: { name: parentName },
  } = tag;
  const fullName = parentName ? `${parentName}/${name}` : name;

  return fullName.replace('/', ' > ').replace('_', '-');
};

const FrontConversationTagger = ({
  fetchLoans,
  conversation,
  tagIds,
  setTagIds,
  refetch,
}) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const getTags = async ids => {
      const fetchedTags = await Promise.all(
        ids.map(async tagId => {
          const tag = EpotekFrontApi.callMethod('frontGetTag', { tagId });
          return tag;
        }),
      );
      setTags(fetchedTags);
    };

    getTags(tagIds);
  }, []);

  const hasLoanTags =
    tags.filter(({ parentTag }) => parentTag?.name?.includes('loan')).length >
    0;

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
          .filter(({ parentTag }) => parentTag?.name?.includes('loan'))
          .map(tag => (
            <span key={tag.id} className="front-tag">
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
        tagIds={tagIds}
        setTagIds={setTagIds}
        refetch={refetch}
      />
    </FrontModal>
  );
};

export default FrontConversationTaggerContainer(FrontConversationTagger);
