import React from 'react';
import Badge from '@material-ui/core/Badge';

import Link from 'core/components/Link';
import Tooltip from 'core/components/Material/Tooltip';

import { useAdmins } from '../AdminsContext/AdminsContext';

const Advisor = ({ advisorId, className, tooltip: tooltipExtension }) => {
  const admins = useAdmins();

  if (!advisorId) {
    return null;
  }

  const advisor = admins.find(({ _id }) => _id === advisorId);

  if (!advisor) {
    return null;
  }

  const tooltip = advisor.isAvailable ? (
    <div>Dispo</div>
  ) : (
    <div>
      <div className="secondary">Pas dispo</div>
      {advisor.roundRobinTimeout}
    </div>
  );

  return (
    <Link className={className} to={`/users/${advisorId}`}>
      <Tooltip
        title={
          <div>
            {tooltip}
            {tooltipExtension && (
              <>
                <br />
                {tooltipExtension}
              </>
            )}
          </div>
        }
      >
        <Badge
          color={advisor.isAvailable ? 'secondary' : 'error'}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={' '}
          variant="dot"
          overlap="circle"
        >
          <img
            src={advisor?.src}
            alt={advisor?.name}
            style={{ borderRadius: '50%', width: 30, height: 30 }}
          />
        </Badge>
      </Tooltip>
    </Link>
  );
};

export default Advisor;
