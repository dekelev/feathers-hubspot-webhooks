import Debug from 'debug';

const debug = Debug('feathers-hubspot-webhooks:service');
const handlersMap = {
  propertyChange: 'updated',
  creation: 'created',
  deletion: 'deleted'
};

function getHandler(handlers, event) {
  const parts = event.subscriptionType.split('.');

  if (event.propertyName)
    parts.push(event.propertyName);

  let node = handlers;

  for (const p of parts) {
    node = node[handlersMap[p]] || node[p];

    if (!node)
      return null;
  }

  return node;
}

export default function createService(handlers) {
  return {
    setup(app) {
      this.app = app;
    },

    create(event, params) {
      const handler = getHandler(handlers, event);

      if (!handler) {
        debug(`Event type ${event.subscriptionType} is unhandled. Nothing to do.`);
        return Promise.resolve({});
      }

      return handler({ object: event, event, params, app: this.app });
    },
  };
}
