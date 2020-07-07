import React, { useContext, useState } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import LanguageContext from '../../contexts/LanguageContext';
import useAllNewsletter from '../../hooks/useAllNewsletter';
import { getLanguageData } from '../../utils/languages';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-flex',
    border: 'none',
  },
  content: {
    margin: '23px 0',
    [theme.breakpoints.up('md')]: {
      margin: '31px 0',
    },
  },
}));

const RecentNewsletters = () => {
  const [language] = useContext(LanguageContext);
  const allNewsletters = useAllNewsletter();
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!allNewsletters) return null;

  return (
    <div className="recent-newsletters">
      <ExpansionPanel
        expanded={expanded === `panel`}
        onChange={handleChange(`panel`)}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
          classes={classes}
        >
          {getLanguageData(language).recentNewslettersToggle}
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <ul className="recent-newsletters">
            {allNewsletters.map(({ id, sendDate, title, url }) => {
              // TODO: temporary until data provided by API is cleaned up
              const newsletterTitle = title
                .replace(/e-Potek - /i, '')
                .replace(/e-Potek: /i, '');
              const newsletterDate = sendDate.split('T')[0];

              return (
                <li key={id} className="newsletter">
                  <a href={url} title={title} target="_new">
                    <div className="mb-4">{newsletterTitle}</div>
                    <div className="secondary">{newsletterDate}</div>
                  </a>
                </li>
              );
            })}
          </ul>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default RecentNewsletters;
