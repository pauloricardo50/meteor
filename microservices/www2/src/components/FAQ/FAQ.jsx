import './FAQ.scss';

import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/Add';
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
    margin: '16px 0',
    [theme.breakpoints.up('md')]: {
      fontSize: '24px',
      fontWeight: 300,
      fontStyle: 'normal',
      lineHeight: 1.42,
      letterSpacing: 'normal',
    },
  },
}));

const useDetailStyles = makeStyles(() => ({
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
          <Accordion
            key={idx}
            expanded={expanded === `panel-${idx}`}
            onChange={handleChange(`panel-${idx}`)}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <AccordionSummary
              expandIcon={<AddCircleOutlineIcon />}
              IconButtonProps={{ size: 'small', className: 'primary' }}
              aria-controls={`panel-${idx}-content`}
              id={`panel-${idx}-header`}
              itemProp="name"
              classes={useSummaryStyles()}
            >
              {field.question}
            </AccordionSummary>
            <AccordionDetails
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
              classes={useDetailStyles()}
            >
              <span itemProp="text">
                <RichText render={field.answer} linkResolver={linkResolver} />
              </span>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default FAQ;
