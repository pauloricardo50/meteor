// @flow
import React from 'react';

import GenerateApiToken from './GenerateApiToken';
import DevelopperSectionContainer from './DevelopperSectionContainer';

type DevelopperSectionProps = {
  user: Object,
};

const DevelopperSection = ({ user }: DevelopperSectionProps) => (
  <div className="developper-section">
    <GenerateApiToken user={user} />
  </div>
);

export default DevelopperSectionContainer(DevelopperSection);
