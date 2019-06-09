// @flow
import React from 'react';

import { RESIDENCE_TYPE } from 'core/api/constants';
import Button from 'core/components/Button';
import SolvencyItem from './SolvencyItem';

type SolvencyResultsProps = {};

const SolvencyResults = ({
  loan,
  maxBorrowRatio,
  organisations,
  showAll,
  setShowAll,
}: SolvencyResultsProps) => (
  <>
    <Button primary onClick={() => setShowAll(!showAll)}>
      {showAll ? 'Afficher top 3' : 'Afficher tous'}
    </Button>
    <table style={{ tableLayout: 'fixed' }}>
      <tablebody>
        <tr>
          <td />
          <td>Genève</td>
          <td>Vaud</td>
        </tr>
        <tr>
          <td>Résidence principale</td>
          <td>
            <SolvencyItem
              loan={loan}
              maxBorrowRatio={maxBorrowRatio}
              residenceType={RESIDENCE_TYPE.MAIN_RESIDENCE}
              canton="GE"
              organisations={organisations}
              showAll={showAll}
            />
          </td>
          <td>
            <SolvencyItem
              loan={loan}
              maxBorrowRatio={maxBorrowRatio}
              residenceType={RESIDENCE_TYPE.MAIN_RESIDENCE}
              canton="VD"
              organisations={organisations}
              showAll={showAll}
            />
          </td>
        </tr>
        <tr>
          <td>Résidence secondaire</td>
          <td>
            <SolvencyItem
              loan={loan}
              maxBorrowRatio={maxBorrowRatio}
              residenceType={RESIDENCE_TYPE.SECOND_RESIDENCE}
              canton="GE"
              organisations={organisations}
              showAll={showAll}
            />
          </td>
          <td>
            <SolvencyItem
              loan={loan}
              maxBorrowRatio={maxBorrowRatio}
              residenceType={RESIDENCE_TYPE.SECOND_RESIDENCE}
              canton="VD"
              organisations={organisations}
              showAll={showAll}
            />
          </td>
        </tr>
      </tablebody>
    </table>
  </>
);

export default SolvencyResults;
