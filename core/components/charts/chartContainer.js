import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { createContainer } from 'core/api/containerToolkit';

export default compose(
  injectIntl,
  createContainer(({ intlPrefix, data, intl: { formatMessage: f } }) => ({
    data: data.map((dataPoint) => {
      const name = f({
        id: intlPrefix ? `${intlPrefix}.${dataPoint.id}` : dataPoint.id,
      });
      // Use || 0 to make sure the chart does not crash
      return { ...dataPoint, value: dataPoint.value || 0, name };
    }),
  })),
);
