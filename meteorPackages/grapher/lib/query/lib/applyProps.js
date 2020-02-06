const restrictOptions = [
  'disableOplog',
  'pollingIntervalMs',
  'pollingThrottleMs',
];

export default function applyProps(node) {
  const filters = { ...node.props.$filters };
  let options = { ...node.props.$options };

  options = _.omit(options, ...restrictOptions);
  options.fields = options.fields || {};

  node.applyFields(filters, options);

  return { filters, options };
}
