import React from 'react';

import Button from 'core/components/Button';
import { T } from 'core/components/Translation';

import HomeDev from 'core/components/HomeDev';
import track from 'core/utils/analytics';

const styles = {
  style: {
    height: 48,
    marginRight: 8,
    marginTop: 8,
  },
  button: {
    height: 50,
  },
  label: {
    fontSize: '1.2em',
    height: 50,
    display: 'inline-block',
  },
};

const Buttons = ({ footer }) => (
  <div className={footer ? 'ctas text-right' : 'ctas'}>
    <Button
      raised
      label={<T id="HomePage.CTA1" />}
      link
      to="/start1/acquisition"
      style={styles.style}
      id="acquisitionButton"
      onClick={() =>
        track('Funnel - clicked home page CTA', { title: 'acquisition' })
      }
    />
    <HomeDev
      style={styles.style}
      id="refinancing"
      handleClick={() =>
        track('Funnel - clicked home page CTA', { title: 'refinancing' })
      }
    />
  </div>
);

Buttons.propTypes = {};

export default Buttons;
