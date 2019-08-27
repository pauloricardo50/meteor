import { compose, withStateHandlers, withProps } from 'recompose';
import { setLenderRulesOrder } from 'core/api/methods/index';

// initialize them to their index in case they are not defined
const initializeOrders = ({ lenderRules = [] }) => ({
  orders: lenderRules.reduce(
    (obj, { order, _id }, index) => ({ ...obj, [_id]: order || index }),
    {},
  ),
});

export default compose(
  withStateHandlers(initializeOrders, {
    increaseOrder: ({ orders }) => (id) => {
      const currentOrder = orders[id];
      const nextOrder = Math.min(
        currentOrder + 1,
        Object.keys(orders).length - 1,
      );

      const idToChange = Object.keys(orders).find(_id => orders[_id] === nextOrder);

      return {
        orders: { ...orders, [id]: nextOrder, [idToChange]: currentOrder },
      };
    },
    decreaseOrder: ({ orders }) => (id) => {
      const currentOrder = orders[id];
      const nextOrder = Math.max(currentOrder - 1, 0);

      const idToChange = Object.keys(orders).find(_id => orders[_id] === nextOrder);

      return {
        orders: { ...orders, [id]: nextOrder, [idToChange]: currentOrder },
      };
    },
  }),
  withProps(({ orders }) => ({
    saveOrder: () => setLenderRulesOrder.run({ orders }),
  })),
);
