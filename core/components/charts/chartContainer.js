import { useIntl } from 'react-intl';
import { withProps } from 'recompose';

export default withProps(({ intlPrefix, data }) => {
  const { formatMessage: f } = useIntl();
  return {
    data: data.map(dataPoint => {
      const name = f({
        id: intlPrefix ? `${intlPrefix}.${dataPoint.id}` : dataPoint.id,
      });
      // Use || 0 to make sure the chart does not crash
      return { ...dataPoint, value: dataPoint.value || 0, name };
    }),
  };
});
