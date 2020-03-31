import React from 'react';
import { getInsuranceDocuments } from 'core/api/files/documents';
import SingleFileTab from 'core/components/FileTabs/SingleFileTab';
import InsuranceModifier from './InsuranceModifier';
import InsuranceEstimatedRevenue from './InsuranceEstimatedRevenue';
import RevenuesTable from '../../../../components/RevenuesTable';

const InsuranceTab = props => {
  const { insurance, insuranceRequest, currentUser } = props;
  const { revenues = [] } = insurance;
  return (
    <div className="flex-col">
      <div className="flex-col card1 p-16 mb-32">
        <h3 className="mt-0">Revenus</h3>
        {revenues.length ? (
          <RevenuesTable
            insurance={insurance}
            filterRevenues={({ insurance: { _id: insuranceId } }) => ({
              'insuranceCache.0._id': insuranceId,
            })}
          />
        ) : (
          <InsuranceEstimatedRevenue
            insurance={insurance}
            insuranceRequest={insuranceRequest}
          />
        )}
      </div>

      <div className="flex-col card1 p-16">
        <h3 className="mt-0 mb-32">{insurance.name}</h3>
        <div className="flex-row sa">
          <InsuranceModifier
            insuranceRequest={insuranceRequest}
            insurance={insurance}
          />
          <div className="flex-col center-align">
            <h3 className="mt-0">Documents</h3>
            <SingleFileTab
              doc={insurance}
              currentUser={currentUser}
              documentArray={getInsuranceDocuments(
                { id: insurance._id },
                { doc: insurance },
              )}
              collection="insurances"
              withAdditionalDocAdder={false}
            />
          </div>
        </div>
        {/* <div className="flex-col mt-32 center-align">
          <h3 className="mt-0">Documents</h3>
        </div> */}
      </div>
    </div>
  );
};

export default InsuranceTab;
