// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon';

type WelcomeScreenLinksProps = {};

const getLinks = ({ handleContact }) => [
  {
    icon: 'openInNew',
    label: 'WelcomeScreen.whoWeAre',
    items: [
      {
        href: `${Meteor.settings.public.subdomains.www}/about`,
        label: 'WelcomeScreen.readAboutUs',
      },
    ],
  },
  {
    icon: 'openInNew',
    label: 'WelcomeScreen.faq',
    items: [
      {
        href: `${Meteor.settings.public.subdomains.www}/faq`,
        label: 'WelcomeScreen.readFaq',
      },
    ],
  },
  {
    icon: 'openInNew',
    label: 'WelcomeScreen.help',
    items: [
      {
        onClick: handleContact,
        label: 'WelcomeScreen.contactUs',
      },
    ],
  },
  {
    icon: 'openInNew',
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
        <Icon type={icon} className="icon" />
        <h4>
          <T id={label} />
        </h4>
        <div className="welcome-screen-links-link-items">
          {items.map(({ href, label: itemLabel }, i) => (
            <a
              primary
              href={href}
              key={i}
              target={href ? '_blank' : undefined}
              component={href ? 'a' : undefined}
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
