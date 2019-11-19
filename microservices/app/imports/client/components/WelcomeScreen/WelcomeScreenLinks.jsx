// @flow
import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/pro-light-svg-icons/faAddressCard';
import { faCogs } from '@fortawesome/pro-light-svg-icons/faCogs';
import { faHandsHelping } from '@fortawesome/pro-light-svg-icons/faHandsHelping';
import { faChartLineDown } from '@fortawesome/pro-light-svg-icons/faChartLineDown';
import { faLanguage } from '@fortawesome/pro-light-svg-icons/faLanguage';

import { ContactButtonContext } from 'core/components/ContactButton/ContactButtonContext';
import T from 'core/components/Translation';

type WelcomeScreenLinksProps = {};

const getLinks = ({ handleContact }) => [
  {
    icon: faAddressCard,
    label: 'WelcomeScreen.whoWeAre',
    items: [
      {
        href: `${Meteor.settings.public.subdomains.app}/files/e-Potek SA.pdf`,
        label: 'WelcomeScreen.companyDescription',
      },
      {
        href: `${Meteor.settings.public.subdomains.www}/blog`,
        label: 'WelcomeScreen.readBlog',
      },
      {
        href: `${Meteor.settings.public.subdomains.www}/about`,
        label: 'WelcomeScreen.readMore',
      },
    ],
  },
  {
    icon: faChartLineDown,
    label: 'WelcomeScreen.interests',
    items: [
      {
        href: `${Meteor.settings.public.subdomains.www}/interests`,
        label: 'WelcomeScreen.interestRates',
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
    icon: faLanguage,
    label: 'WelcomeScreen.english',
    items: [
      {
        onClick: handleContact,
        label: 'WelcomeScreen.contactUsEN',
      },
    ],
  },
  {
    icon: faCogs,
    label: 'WelcomeScreen.moreQuestions',
    items: [
      {
        href: `${Meteor.settings.public.subdomains.www}/faq`,
        label: 'WelcomeScreen.readFaq',
      },
    ],
  },
];

const WelcomeScreenLinks = ({ handleContact }: WelcomeScreenLinksProps) => {
  const { toggleOpenContact, openContact } = useContext(ContactButtonContext);

  return (
    <div className="welcome-screen-links">
      {getLinks({ handleContact: () => toggleOpenContact(!openContact) }).map(
        ({ icon, label, items }, index) => (
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
        ),
      )}
    </div>
  );
};

export default WelcomeScreenLinks;
