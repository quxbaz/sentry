require('node_modules/chai').should();
import Sentry from 'sentry';

describe("sentry", () => {

  let sentry;
  let spy;

  beforeEach(() => {
    sentry = new Sentry();
    spy = 0;
  });

  it("Binds an event and triggers it.", () => {
    sentry.on('click', () => spy++);
    sentry.trigger('click');
    spy.should.eql(1);
  });

  it("Takes an event map in the constructor.", () => {
    sentry = new Sentry({
      'add': () => spy++,
      'sub': () => spy--
    });
    sentry.trigger('add');
    spy.should.eql(1);
    sentry.trigger('sub');
    spy.should.eql(0);
  });

  it("Binds events through .eventMap()", () => {
    sentry._bindMap({
      'add': () => spy++,
      'sub': () => spy--
    });
    sentry.trigger('add');
    spy.should.eql(1);
    sentry.trigger('sub');
    spy.should.eql(0);
  });

  it("Binds events through .on() and .eventMap()", () => {
    sentry.on('foo', () => spy++);
    sentry._bindMap({'bar': () => spy--});
    sentry.trigger('foo');
    spy.should.eql(1);
    sentry.trigger('bar');
    spy.should.eql(0);
  });

  it("Binds two handlers to the same event.", () => {
    spy = 2;
    sentry.on('foo', () => spy++);
    sentry.on('foo', () => {spy *= 2});
    sentry.trigger('foo');
    spy.should.eql(6);
  });

  it("Passes an event map to .on()", () => {
    sentry.on({
      'add': () => spy++
    });
    sentry.trigger('add');
    spy.should.eql(1);
  });

  it("API functions should return @this", () => {
    sentry.on('add', () => {}).should.eql(sentry);
    sentry.trigger('add').should.eql(sentry);
    sentry.triggerWith({}, 'add').should.eql(sentry);
    sentry.off('add').should.eql(sentry);
  });

  it("Triggers an event with an argument.", () => {
    sentry.on('add', (n) => {
      spy += n;
    });
    sentry.trigger('add', 4);
    spy.should.eql(4);
  });

  it("Triggers an event with multiple arguments.", () => {
    sentry.on('add', (a, b) => {
      spy += a + b;
    });
    sentry.trigger('add', 1, 2);
    spy.should.eql(3);
  });

  it("Triggers an event with a specific context.", () => {
    let context = {spy: 10};
    sentry.on('add', function() {
      this.spy++;
    });
    sentry.triggerWith(context, 'add');
    context.spy.should.eql(11);
  });

  it("Triggers an event with a specific context and arguments.", () => {
    let context = {spy: 10};
    sentry.on('add', function(n) {
      this.spy += n;
    });
    sentry.triggerWith(context, 'add', 4);
    context.spy.should.eql(14);
  });

  it("Checks if it has an event.", () => {
    sentry.hasEvent('foo').should.be.false;
    sentry.on('foo', () => {});
    sentry.hasEvent('foo').should.be.true;
    sentry.off('foo');
    sentry.hasEvent('foo').should.be.false;
  });

  describe(".off()", () => {

    let fn1, fn2;

    beforeEach(() => {
      fn1 = () => {};
      fn2 = () => {};
      sentry.on('add', fn1);
      sentry.on('add', fn2);
    });

    it("Removes all event handlers of an event.", () => {
      sentry.off('add');
      sentry.events['add'].should.eql([]);
    });

    it("Removes a specific event handler.", () => {
      sentry.off('add', fn2);
      sentry.events['add'].should.eql([fn1]);
    });

    it("Does nothing if passed a handler it does not have.", () => {
      sentry.off('add', () => {});
      sentry.events['add'].should.eql([fn1, fn2]);
    });

  });

});
