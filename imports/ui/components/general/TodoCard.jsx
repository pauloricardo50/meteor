import React, { Component, PropTypes} from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';


const normalColor = '#4A90E2';
const successColor = '#50E3C2';


const styles = {
  clock: {
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
    FlowRouter.go(`/step1/${this.props.cardId + 1}`);
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

    return (
      <li onClick={this.routeDo} className="col-sm-6" style={{ listStyle: 'none' }}>
        <div className="mask2 col-sm-12 todo-card">
          <h4>{ this.props.title }</h4>
          <span className="fa fa-info-circle fa-lg" />
          {/* <hr /> */}
          <p className="secondary">
            <span className="fa fa-clock-o fa-lg" style={styles.clock} />
            {this.props.duration}
            {/* <small>
              <a onClick={this.progressMax}>100%</a>
            </small> */}
          </p>
          <div className="bottom text-center" style={gradientStyle}>{ this.props.completionPercentage.toString() }%</div>
        </div>
      </li>
    );
  }
}

TodoCard.propTypes = {
  cardId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  duration: PropTypes.any.isRequired,
  completionPercentage: PropTypes.number.isRequired,
  right: PropTypes.bool.isRequired,
  setProgress: PropTypes.func,
};
