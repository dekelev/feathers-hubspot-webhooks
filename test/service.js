import createService from '../src/service';
import sinon from 'sinon';

module.exports = function(test) {
  const handlers = {
    contact: {
      created() { return Promise.resolve('the result'); },
      updated: {
        firstname() { return Promise.resolve('the result'); }
      },
    },
  };

  sinon.spy(handlers.contact, 'created');
  sinon.spy(handlers.contact.updated, 'firstname');

  test('Service', function*(t) {
    let service = createService(handlers);
    t.ok(service.create, 'returns service object with create');

    let result = yield service.create({ eventId: 'evt_123', subscriptionType: 'contact.creation' });
    t.ok(handlers.contact.created.called, 'contact.created called');

    t.equals(result, 'the result', 'Returns the result of the handler');

    result = yield service.create({ eventId: 'evt_123', subscriptionType: 'contact.propertyChange', propertyName: 'firstname' });
    t.ok(handlers.contact.updated.firstname.called, 'contact.updated.firstname called');

    t.equals(result, 'the result', 'Returns the result of the handler');

    handlers.contact.created.resetHistory();
    result = yield service.create({ eventId: 'evt_123', subscriptionType: 'contact.deletion' });
    t.deepEquals(result, {}, 'Returns success on unhandled event types');

    service = createService(handlers);
    result = yield service.create({ subscriptionType: 'contact.creation' });

    t.ok(handlers.contact.created.called, 'contact.created called');

    result = yield service
      .create({ eventId: 'evt_123', subscriptionType: 'fake.creation' })
      .catch(e => e);
    t.deepEquals(result , {}, 'Empty object (feathers returns 201) when called with unhandled event type');
  });
};
