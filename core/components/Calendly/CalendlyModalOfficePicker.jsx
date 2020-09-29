import React from 'react';

import Button from '../Button';
import T from '../Translation';

const CalendlyModalOfficePicker = ({ setLink }) => (
  <div className="flex center">
    <Button
      primary
      raised
      className="m-8"
      onClick={() => setLink('https://www.calendly.com/epotek-geneve')}
      size="large"
    >
      e-Potek&nbsp;–&nbsp;
      <T defaultMessage="Genève" />
    </Button>
    <Button
      primary
      raised
      className="m-8"
      onClick={() => setLink('https://www.calendly.com/epotek-lausanne')}
      size="large"
    >
      e-Potek&nbsp;–&nbsp;
      <T defaultMessage="Lausanne" />
    </Button>
  </div>
);

export default CalendlyModalOfficePicker;
