// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/pro-light-svg-icons/faAddressCard';
import { faCogs } from '@fortawesome/pro-light-svg-icons/faCogs';
import { faFileChartLine } from '@fortawesome/pro-light-svg-icons/faFileChartLine';
import { faHandsHelping } from '@fortawesome/pro-light-svg-icons/faHandsHelping';

import T from 'core/components/Translation';

type WelcomeScreenLinksProps = {};

const getLinks = ({ handleContact }) => [
  {
    icon: faAddressCard,
    label: 'WelcomeScreen.whoWeAre',
    items: [
      {
        href: `${Meteor.settings.public.subdomains.www}/about`,
        label: 'WelcomeScreen.readAboutUs',
      },
    ],
  },
  {
    icon: faCogs,
    label: 'WelcomeScreen.faq',
    items: [
      {
        href: `${Meteor.settings.public.subdomains.www}/faq`,
        label: 'WelcomeScreen.readFaq',
      },
    ],
  },
  {
    icon: faHandsHelping,
    label: 'WelcomeScreen.help',
    items: [
      {
        onClick: handleContact,
        label: 'WelcomeScreen.contactUs',
      },
    ],
  },
  {
    icon: faFileChartLine,
    label: 'WelcomeScreen.other',
    items: [
      {
        href: `${Meteor.settings.public.subdomains.www}/interests`,
        label: 'WelcomeScreen.interestRates',
      },
      {
        href: `${Meteor.settings.public.subdomains.app}/files/e-Potek SA.pdf`,
        label: 'WelcomeScreen.companyDescription',
      },
    ],
  },
];

const WelcomeScreenLinks = ({ handleContact }: WelcomeScreenLinksProps) => (
  <div className="welcome-screen-links">
    {getLinks({ handleContact }).map(({ icon, label, items }, index) => (
      <div key={index} className="welcome-screen-links-link">
        <FontAwesomeIcon icon={icon} className="icon" />
        <h4>
          <T id={label} />
        </h4>
        <div className="welcome-screen-links-link-items">
          {items.map(({ href, label: itemLabel, onClick }, i) => (
            <a
              primary
              href={href}
              key={i}
              target={href ? '_blank' : undefined}
              component={href ? 'a' : undefined}
              onClick={onClick}
            >
              <T id={itemLabel} />
            </a>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default WelcomeScreenLinks;
