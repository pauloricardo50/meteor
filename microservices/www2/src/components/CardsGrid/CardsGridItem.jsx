import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { RichText } from 'prismic-reactjs';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const CardsGridItem = ({ icon, title, content }) => (
  <Card classes={useStyles()}>
    {icon && (
      <div className="card-icon">
        <img src={icon.url} alt={icon.alt} />
      </div>
    )}

    <div className="card-title">{RichText.render(title)}</div>

    <div className="card-content">{RichText.render(content)}</div>
  </Card>
);

export default CardsGridItem;
