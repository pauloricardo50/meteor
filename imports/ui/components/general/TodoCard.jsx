import React from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';


const normalColor = '#4A90E2';
const successColor = '#50E3C2';

export default class TodoCard extends React.Component {

  constructor(props) {
    super(props);

    this.routeDo = this.routeDo.bind(this);
  }

  routeDo() {
    Session.set('view', this.props.cardId.toString());
    const requestId = FlowRouter.getParam('id');
    FlowRouter.go(`/${requestId}/todo/${this.props.cardId}`);
  }

  render() {
    let cardClasses = 'todo-card col-sm-7 col-xs-11 ';
    let durationClasses = 'duration ';
    if (this.props.right) {
      cardClasses += 'col-sm-offset-2';
      durationClasses += 'left';
    } else {
      cardClasses += 'col-sm-offset-3 col-xs-offset-1';
      durationClasses += 'right';
    }

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
      <a onClick={this.routeDo} className={cardClasses}>
        <div className={durationClasses}>
          {/* put clock after duration if card is on the right, opposite if card is on the left */}
          {this.props.right ? (<span>{ this.props.duration }</span>) : ''}
          <span className="fa fa-clock-o fa-lg" />
          {this.props.right ? '' : (<span>{ this.props.duration }</span>)}
        </div>
        <h6>{ this.props.title }</h6>
        <span className="fa fa-info-circle fa-lg" />
        <hr />
        <div className="bottom text-center" style={gradientStyle}>{ this.props.completionPercentage.toString() }%</div>
      </a>
    );
  }
}
