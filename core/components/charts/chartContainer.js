import { injectIntl } from 'react-intl';
import { compose, withProps } from 'recompose';

export default compose(
  injectIntl,
  withProps(({ intlPrefix, data, intl: { formatMessage: f } }) => ({
    data: data.map(dataPoint => {
      const name = f({
        id: intlPrefix ? `${intlPrefix}.${dataPoint.id}` : dataPoint.id,
      });
      // Use || 0 to make sure the chart does not crash
      return { ...dataPoint, value: dataPoint.value || 0, name };
    }),
  })),
);
