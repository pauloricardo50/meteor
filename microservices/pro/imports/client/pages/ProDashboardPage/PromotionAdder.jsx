import React from 'react';

import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import { employeesByEmail } from 'core/arrays/epotekEmployees';
import DialogSimple from 'core/components/DialogSimple/DialogSimple';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import colors from 'core/config/colors';
import useCurrentUser from 'core/hooks/useCurrentUser';

const PromotionAdder = () => {
  const { assignedEmployee = {} } = useCurrentUser();
  const { email: assigneeEmail, name: assigneeName } = assignedEmployee;

  const imageSrc =
    employeesByEmail[assigneeEmail]?.src || '/img/epotek-logo.png';

  return (
    <DialogSimple
      title={<T id="ProDashboardPage.addPromotion" />}
      buttonProps={{
        label: <T id="ProDashboardPage.addPromotion" />,
        raised: true,
        primary: true,
        icon: <Icon type="add" />,
      }}
      maxWidth="xs"
      closeOnly
    >
      <div className="flex-col center">
        <Icon
          className="mt-16 mb-32"
          type={collectionIcons[PROMOTIONS_COLLECTION]}
          style={{ width: '100px', height: '100px', color: colors.primary }}
        />
        <T
          id="ProDashboardPage.addPromotion.description"
          values={{ hasAssignee: !!assigneeEmail }}
        />
        <a
          href={`mailto:${assigneeEmail || 'team@e-potek.ch'}`}
          className="flex center a mt-16"
          style={{ marginLeft: '-8px' }}
        >
          <img
            src={imageSrc}
            className="mr-8"
            widht={50}
            height={50}
            style={{ borderRadius: '50%' }}
            alt={assigneeName || 'team@e-potek.ch'}
          />
          {assigneeName || 'team@e-potek.ch'}
        </a>
      </div>
    </DialogSimple>
  );
};

export default PromotionAdder;
