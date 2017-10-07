import React from 'react';

import Button from '/imports/ui/components/general/Button';
import { T } from '/imports/ui/components/general/Translation';

import HomeDev from '/imports/ui/components/general/HomeDev';
import track from '/imports/js/helpers/analytics';

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

const Buttons = props => (
  <div className={props.footer ? 'ctas text-right' : 'ctas'}>
    <Button
      raised
      label={<T id="HomePage.compare" />}
      link
      to="/app/compare"
      style={styles.style}
      id="compareButton"
      onClick={() =>
        track('Funnel - clicked home page CTA', { title: 'compare' })}
    />
    <Button
      raised
      label={<T id="HomePage.CTA1" />}
      link
      to="/start1/acquisition"
      style={styles.style}
      id="acquisitionButton"
      onClick={() =>
        track('Funnel - clicked home page CTA', { title: 'acquisition' })}
    />
    <HomeDev
      style={styles.style}
      id="refinancing"
      handleClick={() =>
        track('Funnel - clicked home page CTA', { title: 'refinancing' })}
    />
  </div>
);

Buttons.propTypes = {};

export default Buttons;
