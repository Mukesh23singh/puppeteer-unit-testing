import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

import { MonitorRequestHelper } from './monitorRequest.helper';

describe('MonitorRequestHelper', () => {
  it('monitorRequests should not called', (done) => {
    // Arrange
    const fakePage = {
      on(type, cb) {
        this[type] = cb;
      },

      setRequestInterception() {
        console.log('setRequestInterception Called');
      }
    };
    const fakeRequest = {
      abort: sinon.spy(),
      continue: sinon.spy(),
      resourceType() { return 'image'; }
    };
    MonitorRequestHelper.monitorRequests(fakePage);

    // Act
    // trigger fake request
    fakePage['on']('request', fakeRequest);

    // Assert
    expect(fakeRequest.abort.notCalled);
    expect(fakeRequest.continue.notCalled);
    done();
  });

  it('monitorRequests should abort the request', (done) => {
    // Arrange
    const fakePage = {
      on(type, cb) {
        this[type] = cb;
      },

      setRequestInterception() {
        console.log('setRequestInterception Called');
      }
    };
    const fakeRequest = {
      abort: sinon.spy(),
      continue: sinon.spy(),
      resourceType() { return 'image'; }
    };
    MonitorRequestHelper.monitorRequests(fakePage, true);

    // Act
    // trigger fake request
    fakePage['on']('request', fakeRequest);

    // Assert
    expect(fakeRequest.abort.called);
    expect(fakeRequest.continue.notCalled);
    done();
  });

  it('monitorRequests should continue the request', (done) => {
    // Arrange
    const fakePage = {
      on(type, cb) {
        this[type] = cb;
      },

      setRequestInterception() {
        console.log('setRequestInterception Called');
      }
    };
    const fakeRequest = {
      continue: sinon.spy(),
      abort: sinon.spy(),
      resourceType() { return 'image'; }
    };
    MonitorRequestHelper.monitorRequests(fakePage, true);

    // Act
    // trigger fake request
    fakePage['on']('request', fakeRequest);

    // Assert
    expect(fakeRequest.continue.calledOnce);
    expect(fakeRequest.abort.notCalled);
    done();
  });
});
