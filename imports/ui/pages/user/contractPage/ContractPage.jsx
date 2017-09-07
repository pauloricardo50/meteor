import React from 'react';
import PropTypes from 'prop-types';

import FileTabs from './contractPage/FileTabs.jsx';
import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import ConfirmButton from '/imports/ui/components/general/ConfirmButton.jsx';
import { LoadingComponent } from '/imports/ui/components/general/Loading.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';

import { filesPercent } from '/imports/js/arrays/steps';
import { borrowerFiles, requestFiles } from '/imports/js/arrays/files';
import cleanMethod from '/imports/api/cleanMethods';

// const handleClick = (id) => {
//   cleanMethod('updateRequest', { 'logic.lender.contractRequested': true }, id);
// };
//
// const getAction = (request, percent) => {
//   if (!request.logic.lender.contractRequested) {
//     return (
//       <div className="text-center" style={{ marginBottom: 40 }}>
//         <h4>
//           <T id="ContractPage.progress" values={{ value: percent }} />
//         </h4>
//         <ConfirmButton
//           raised
//           disabled={percent < 1}
//           label={<T id="ContractPage.CTA" />}
//           secondary
//           handleClick={() => handleClick(request._id)}
//         />
//       </div>
//     );
//   }
//   return (
//     <div className="text-center">
//       <h4>
//         <T id="ContractPage.loading" />
//       </h4>
//       <div style={{ height: 150 }}>
//         <LoadingComponent />
//       </div>
//     </div>
//   );
// };

const ContractPage = props =>
  // const percent =
  //   (filesPercent(props.loanRequest, requestFiles, 'contract') +
  //     filesPercent(props.borrowers, borrowerFiles, 'contract')) /
  //   (1 + props.borrowers.length);

  (
    <ProcessPage {...props} stepNb={3} id="contract" showBottom={false}>
      <div className="mask1">
        <div className="description">
          <p>
            <T id="ContractPage.description" />
          </p>
        </div>

        <FileTabs {...props} />
      </div>
    </ProcessPage>
  )
;

ContractPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ContractPage;
