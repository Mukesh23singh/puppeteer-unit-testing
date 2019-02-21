import * as sinon from 'sinon';
import { expect } from 'chai';
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
          console.log('abort Called');
        },
        continue: function () {
          console.log('abort Called');
        }
      };
    };
    page.on('request', request);
    let spyAbort = sinon.spy(request(), 'abort');
    MonitorRequestHelper.monitorRequests(page);
    sinon.assert.notCalled(spyAbort);
  });

  it('monitorRequests should abort the request', (done) => {
    let request = function () {
      return {
        resourceType: function () {
          return 'image';
        },
        abort: function () {
          console.log('abort Called');
        },
        continue: function () {
          console.log('continue Called');
        }
      };
    };
    let spyAbort = sinon.spy(request(), 'abort');
    let spyContinue = sinon.spy(request(), 'continue');
    process.nextTick(function () {
      page.emit('request', request());
    });
    MonitorRequestHelper.monitorRequests(page, true);
    sinon.assert.calledOnce(spyAbort);
    sinon.assert.notCalled(spyContinue);
    spyAbort.restore();
    spyContinue.restore();
    done();
  });

  it('monitorRequests should continue the request', (done) => {
    let request = function () {
      return {
        resourceType: function () {
          return 'javascript';
        },
        abort: function () {
          console.log('abort Called');
        },
        continue: function () {
          console.log('continue Called');
        }
      };
    };
    let spyContinue = sinon.spy(request(), 'continue');
    let spyAbort = sinon.spy(request(), 'abort');
    process.nextTick(function () {
      page.emit('request', request());
    });
    MonitorRequestHelper.monitorRequests(page, true);
    sinon.assert.calledOnce(spyContinue);
    sinon.assert.calledOnce(spyAbort);
    done();
  });
});
