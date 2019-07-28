# feathers-hubspot-webhooks

[![Build Status](https://travis-ci.org/dekelev/feathers-hubspot-webhooks.svg?branch=master)](https://travis-ci.org/dekelev/feathers-hubspot-webhooks)

## Installation

`npm install --save feathers-hubspot-webhooks`


## Usage

```javascript
// default.json
{
  "hubspot": {
    "apiKey": "94d64f06-0c5d-42ed-b0c8-b9926cce7697",
    "webhooks": {
      "signature": {
        "verify": true,
        "secret": "7521a231-a773-45ed-a430-ec67d8d43dc4"
      }
    }
  }
}
```

```javascript
// app.js
const { hubspotSignatureValidationMiddleware } = require('feathers-hubspot-webhooks');

if (config.hubspot.webhooks.signature.verify)
  app.configure(hubspotSignatureValidationMiddleware('/hubspot/webhooks', config.hubspot.webhooks.signature.secret));

// run other body-parser rules here, i.e. app.use(bodyParser.json())
```

```javascript
// hubspot-webhooks.service.js
const { hubspotWebhooksService } = require('feathers-hubspot-webhooks');
const handlers = require('./hubspot-webhooks.handlers');
const hooks = require('./hubspot-webhooks.hooks');

module.exports = function (app) {
  app.use('/hubspot/webhooks', hubspotWebhooksService(handlers));

  const service = app.service('hubspot/webhooks');

  service.hooks(hooks);
};
```

```javascript
// hubspot-webhooks.handlers.js
module.exports = {
  contact: {
    async created({ event, params, app }) {
      // Handle webhook
      // NOTE: Whatever you return will be returned as a response to hubspot.
      // If you return undefined feathers will 404 and the hook will fail
      
      params.doSomething = true;

      return {};
    },
    updated: {
      async firstname({ event, params, app }) {
        // Get HubSpot object ID from `event.objectId`
        // Get updated value from `event.propertyValue`

        return {};
      },
      //....
    },
    async deleted({ event, params, app }) {
      return {};
    },
  },
  company: {
    async created({ event, params, app }) {
      return {};
    },
    updated: {
      async city({ event, params, app }) {
        return {};
      },
      //....
    },
    async deleted({ event, params, app }) {
      return {};
    },
  },
  deal: {
    async created({ event, params, app }) {
      return {};
    },
    updated: {
      async amount({ event, params, app }) {
        return {};
      },
      //....
    },
    async deleted({ event, params, app }) {
      return {};
    },
  },
};
```

```javascript
// hubspot-webhooks.hooks.js
module.exports = {
  after: {
    create: [
      iff(hook => hook.params.doSomething,
        doSomething()
      ),
    ],
  },
};
```
