import React, { Component, PropTypes} from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';


const normalColor = '#4A90E2';
const successColor = '#50E3C2';


const styles = {
  clock: {
    paddingRight: 10,
  },
  title: {
    display: 'inline-block',
    paddingRight: 10,
  },
};


export default class TodoCard extends Component {

  constructor(props) {
    super(props);

    this.routeDo = this.routeDo.bind(this);
    // this.progressMax = this.progressMax.bind(this);
  }

  // progressMax(event) {
  //   this.props.setProgress(this.props.cardId, 100);
  //   event.stopPropagation();
  // }

  routeDo() {
    const route = FlowRouter.getRouteName();
    FlowRouter.go(`/${route}/${this.props.cardId}`);
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
      background: '-moz-linear-gradient(left, ' + successColor + ' ' + percent + '%, ' + normalColor + ' ' + percent2 + '%)', // FF3.6-15
      background: '-webkit-linear-gradient(left, ' + successColor + ' ' + percent + '%,' + normalColor + ' ' + percent2 + '%)', // Chrome10-25,Safari5.1-6
      background: 'linear-gradient(to right, ' + successColor + ' ' + percent + '%,' + normalColor + ' ' + percent2 + '%)', // Modern browsers
      filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr="' + successColor + '", endColorstr="' + oldColor + '",GradientType=1 )' // IE6-9
    };

    // If the amount of cards is odd, center a card with the center prop
    let bootstrapClasses;
    if (this.props.center) {
      bootstrapClasses = 'col-md-6 col-md-offset-3';
    } else {
      bootstrapClasses = 'col-md-6';
    }

    return (
      <li onClick={this.routeDo} className={bootstrapClasses} style={{ listStyle: 'none' }}>
        <div className="mask2 col-sm-12 todo-card">
          <h4 style={styles.title}>{this.props.title}</h4>
          {this.props.completionPercentage === 100 ? <span className="fa fa-check secondary" /> : null}
          <span className="fa fa-info-circle fa-lg" />
          {/* <hr /> */}
          <p className="secondary">
            <span className="fa fa-clock-o fa-lg" style={styles.clock} />
            {this.props.duration}
            {/* <small>
              <a onClick={this.progressMax}>100%</a>
            </small> */}
          </p>
          <div
            className="bottom text-center"
            style={gradientStyle}
          >
            {
              this.props.completionPercentage === 100 ?
                'Terminé' :
                this.props.completionPercentage.toString() + '%'
            }
          </div>
        </div>
      </li>
    );
  }
}

TodoCard.propTypes = {
  cardId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  duration: PropTypes.any.isRequired,
  completionPercentage: PropTypes.number.isRequired,
  setProgress: PropTypes.func,
  center: PropTypes.bool,
};
