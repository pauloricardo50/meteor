import React, { Component, PropTypes } from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';

import colors from '/imports/js/colors';

const normalColor = colors.primary;
const successColor = colors.secondary;

const styles = {
  clock: {
    paddingRight: 10,
  },
  title: {
    display: 'inline-block',
    paddingRight: 10,
    marginTop: 0,
  },
};

export default class TodoCard extends Component {
  constructor(props) {
    super(props);

    this.routeDo = this.routeDo.bind(this);
  }

  routeDo() {
    const route = FlowRouter.getRouteName();
    FlowRouter.go(`/${route}/${this.props.href}`);
  }

  render() {
    const percent = this.props.completionPercentage;
    const percent2 = percent + 20;

    // Support for old browsers, show a full color
    let oldColor;
    if (percent < 100) {
      oldColor = normalColor;
    } else {
      oldColor = successColor;
    }

    const gradientStyle = {
      background: oldColor, // Super old browsers
      background: `-moz-linear-gradient(left, ${successColor} ${percent}%, ${normalColor} ${percent2}%)`, // FF3.6-15
      background: `-webkit-linear-gradient(left, ${successColor} ${percent}%, ${normalColor} ${percent2}%)`, // Chrome10-25,Safari5.1-6
      background: `linear-gradient(to right, ${successColor} ${percent}%, ${normalColor} ${percent2}%)`, // Modern browsers
      filter: `progid:DXImageTransform.Microsoft.gradient( startColorstr="${successColor}", endColorstr="${oldColor}",GradientType=1 )`, // IE6-9
    };

    // If the amount of cards is odd, center a card with the center prop
    let bootstrapClasses;
    if (this.props.center) {
      bootstrapClasses = 'col-md-6 col-md-offset-3';
    } else {
      bootstrapClasses = 'col-md-6';
    }

    return (
      <li
        onTouchTap={this.routeDo}
        className={bootstrapClasses}
        style={{ listStyle: 'none' }}
      >
        <div className="mask2 col-sm-12 todo-card hover-rise">
          <h3 style={styles.title}>{this.props.title}</h3>
          {this.props.completionPercentage === 100 &&
            <span
              style={{ color: successColor }}
              className="fa fa-check secondary"
            />}
          <span className="fa fa-info-circle fa-lg" />
          <p className="secondary">
            <span className="fa fa-clock-o fa-lg" style={styles.clock} />
            {this.props.duration}
          </p>
          <div className="bottom text-center" style={gradientStyle}>
            {this.props.completionPercentage === 100
              ? 'Terminé'
              : this.props.completionPercentage.toString() + '% Terminé'}
          </div>
        </div>
      </li>
    );
  }
}

TodoCard.propTypes = {
  title: PropTypes.string.isRequired,
  duration: PropTypes.any.isRequired,
  completionPercentage: PropTypes.number.isRequired,
  setProgress: PropTypes.func,
  center: PropTypes.bool,
};
