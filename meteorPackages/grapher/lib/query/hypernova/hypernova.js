import applyProps from '../lib/applyProps.js';
import prepareForDelivery from '../lib/prepareForDelivery.js';
import storeHypernovaResults from './storeHypernovaResults.js';

function hypernova(collectionNode, userId) {
  _.each(collectionNode.collectionNodes, childCollectionNode => {
    const { filters, options } = applyProps(childCollectionNode);

    storeHypernovaResults(childCollectionNode, userId);
    hypernova(childCollectionNode, userId);
  });
}

export default function hypernovaInit(collectionNode, userId, config = {}) {
  const bypassFirewalls = config.bypassFirewalls || false;
  const params = config.params || {};

  const { filters, options } = applyProps(collectionNode);

  const { collection } = collectionNode;

  collectionNode.results = collection.find(filters, options, userId).fetch();

  const userIdToPass = config.bypassFirewalls ? undefined : userId;
  hypernova(collectionNode, userIdToPass);

  prepareForDelivery(collectionNode, params);

  return collectionNode.results;
}
