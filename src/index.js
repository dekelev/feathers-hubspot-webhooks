import bodyParser from 'body-parser';
import crypto from 'crypto';
import Debug from 'debug';
import service from './service';

const debug = Debug('feathers-hubspot-webhooks:main');

export function hubspotWebhooksService(handlers) {
  debug('Creating feathers-hubspot-webhooks service');

  return service(handlers);
}

export function hubspotSignatureValidationMiddleware(route, endpointSecret) {
  return function () {
    const app = this;
    const bodyParserRaw = bodyParser.raw({ type: '*/*' });

    app.post(route, bodyParserRaw, (req, res, next) => {
      const signature = req.headers['x-hubspot-signature'];
      const body = req.body.toString('utf8');

      if (!signature) {
        res.status(400).end();

        return;
      }

      const source = endpointSecret + body;
      const sourceSignature = crypto.createHash('sha256').update(source).digest('hex');

      if (sourceSignature !== signature) {
        res.status(400).end();

        return;
      }

      try {
        req.body = JSON.parse(body);
      } catch (err) {
        res.status(400).end();
        return;
      }

      next();
    });
  }
}
