import React from 'react';

import { T } from 'core/components/Translation';
import jobs from './jobs';
import CareersPageJob from './CareersPageJob';

const CareersPageList = () => (
  <div className="careers-page-list">
    {Object.keys(jobs).map(department => (
      <div className="careers-page-list-department" key={department}>
        <h2>
          <T id={`CareersPageList.${department}`} />
        </h2>
        {jobs[department].map((job, index) => (
          <CareersPageJob job={job} key={index} />
        ))}
        {!jobs[department] ||
          (jobs[department].length === 0 && (
            <p className="careers-page-list-empty">
              <T id="CareersPageList.emptyDepartment" />
            </p>
          ))}
      </div>
    ))}
  </div>
);

export default CareersPageList;
