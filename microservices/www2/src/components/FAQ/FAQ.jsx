import './FAQ.scss';

import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Helmet } from 'react-helmet';

import { linkResolver } from '../../utils/linkResolver';
import { RichText } from '../prismic';

const useSummaryStyles = makeStyles(theme => ({
  root: {
    padding: 0,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '23px 0 20px',
    [theme.breakpoints.up('md')]: {
      margin: '40px 0',
      fontSize: '24px',
      fontWeight: 300,
      fontStyle: 'normal',
      lineHeight: 1.42,
      letterSpacing: 'normal',
    },
  },
}));

const useDetailStyles = makeStyles(theme => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: '16px',
    fontWeight: 300,
    fontStyle: 'normal',
    lineHeight: 1.44,
    letterSpacing: 'normal',
    color: 'black',
  },
}));

const FAQ = ({ primary, fields }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Helmet>
        {/* NOTE: lang set in Layout component */}
        {/* eslint-disable-next-line jsx-a11y/html-has-lang */}
        <html itemScope itemType="https://schema.org/FAQPage" />
      </Helmet>

      <h1 className="faq-heading container" itemProp="name">
        {RichText.asText(primary.section_heading)}
      </h1>

      <div className="container">
        {fields.map((field, idx) => (
          <ExpansionPanel
            key={idx}
            expanded={expanded === `panel-${idx}`}
            onChange={handleChange(`panel-${idx}`)}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <ExpansionPanelSummary
              expandIcon={<AddCircleOutlineIcon />}
              aria-controls={`panel-${idx}-content`}
              id={`panel-${idx}-header`}
              itemProp="name"
              classes={useSummaryStyles()}
            >
              {field.question}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
              classes={useDetailStyles()}
            >
              <span itemProp="text">
                <RichText render={field.answer} linkResolver={linkResolver} />
              </span>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </div>
    </>
  );
};

export default FAQ;
