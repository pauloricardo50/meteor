import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';

import { T } from '/imports/ui/components/general/Translation.jsx';

import DashboardItem from './DashboardItem.jsx';

const handleClick = key => {
  console.log(key);
  Meteor.call('downloadFile', key, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('yay', data);
      data.Body.createReadStream().pipe();
    }
  });
};

const DashboardDownload = props => {
  const { files } = props.loanRequest;
  const contractKey = files.contract && files.contract.length && files.contract[0].key;

  return (
    <DashboardItem title={<T id="DashboardDownload.title" />}>
      <h4><T id="DashboardDownload.contract" /></h4>
      <div className="text-center">
        <RaisedButton
          label={<T id="general.download" />}
          onTouchTap={() => handleClick(contractKey)}
        />
      </div>
    </DashboardItem>
  );
};

DashboardDownload.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardDownload;
