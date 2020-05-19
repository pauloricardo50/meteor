import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'gatsby';
import { RichText } from 'prismic-reactjs';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { linkResolver } from '../../utils/linkResolver';
import './FAQ.scss';

// TODO: update styles
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const FAQ = ({ primary, fields }) => {
  const classes = useStyles();
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

      <h1 className="faq-heading" itemProp="name">
        {RichText.asText(primary.section_heading)}
      </h1>

      <div className={classes.root}>
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
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${idx}-content`}
              id={`panel-${idx}-header`}
              itemProp="name"
            >
              {field.question}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <span itemProp="text">{RichText.render(field.answer)}</span>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </div>
    </>
  );
};

export default FAQ;

/*
<ExpansionPanel
  className={cx('financing-structures-section', className, { expanded })}
  CollapseProps={{ classes: { container, entered } }}
  expanded={expanded}
  onChange={() => changeExpanded(!expanded)}
>
  <FinancingSectionSummary
    summaryConfig={summaryConfig}
    sectionProps={sectionProps}
    content={content}
    expandedClass={expandedClass}
    summaryRoot={summaryRoot}
  />
  <FinancingSectionDetails
    detailConfig={detailConfig}
    sectionProps={sectionProps}
    sectionItemProps={sectionItemProps}
  />
</ExpansionPanel>
*/
