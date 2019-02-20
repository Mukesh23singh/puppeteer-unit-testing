import * as sinon from 'sinon';
// import { expect } from 'chai';
// require('chai').use(require('sinon-chai'));
import 'mocha';
const proc = require('child_process');

import { MonitorRequestHelper } from './monitorRequest.helper';
const EventEmitter = require('events').EventEmitter;
class Page extends EventEmitter {
}

describe('MonitorRequestHelper', () => {
  let page: Page;
  let exec;
  beforeEach(() => {
    page = new Page;
    exec = sinon.stub(proc, 'exec');
  });

  afterEach(function () {
    exec.restore();
  });

  it('monitorRequests should not called', () => {
    let request = function () {
      return {
        resourceType: function () {
          return 'image';
        },
        abort: function () {
          return sinon.spy();
        },
        continue: function () {
          return sinon.spy();
        }
      };
    };
    page.on('request', request);
    MonitorRequestHelper.monitorRequests(page);
    sinon.assert.notCalled(request().abort());
  });

  it('monitorRequests should abort the request', (  ) => {
    let request = function () {
      return {
        resourceType: function () {
          return 'image';
        },
        abort: sinon.spy,
        continue: sinon.spy
      };
    };
    page.on('request', request);
    process.nextTick(function() {
      page.emit('request', request());
    });
    MonitorRequestHelper.monitorRequests(page, true);
    sinon.assert.calledOnce(request().abort());
  });

  it('monitorRequests should continue the request', () => {
    let request = function () {
      return {
        resourceType: function () {
          return 'javascript';
        },
        abort: sinon.spy,
        continue: sinon.spy
      };
    };
    page.on('request', request);
    page.emit('request', request);
    MonitorRequestHelper.monitorRequests(page, true);
    sinon.assert.calledOnce(request().continue());
  });
});
