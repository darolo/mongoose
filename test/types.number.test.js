'use strict';

/**
 * Module dependencies.
 */

const assert = require('assert');
const mongoose = require('./common').mongoose;

const SchemaNumber = mongoose.Schema.Types.Number;

/**
 * Test.
 */

describe('types.number', function() {
  it('an empty string casts to null', function(done) {
    const n = new SchemaNumber();
    assert.strictEqual(n.cast(''), null);
    done();
  });

  it('a null number should castForQuery to null', function(done) {
    const n = new SchemaNumber();
    assert.strictEqual(n.castForQuery(null), null);
    done();
  });

  it('undefined throws number cast error', function(done) {
    const n = new SchemaNumber();
    let err;
    try {
      n.cast(undefined);
    } catch (e) {
      err = e;
    }
    assert.strictEqual(true, !!err);
    done();
  });

  it('array throws cast number error', function(done) {
    const n = new SchemaNumber();
    let err;
    try {
      n.cast([]);
    } catch (e) {
      err = e;
    }
    assert.strictEqual(true, !!err);
    done();
  });

  it('three throws cast number error', function(done) {
    const n = new SchemaNumber();
    let err;
    try {
      n.cast('three');
    } catch (e) {
      err = e;
    }
    assert.strictEqual(true, !!err);
    done();
  });

  it('{} throws cast number error', function(done) {
    const n = new SchemaNumber();
    let err;
    try {
      n.cast({});
    } catch (e) {
      err = e;
    }
    assert.strictEqual(true, !!err);
    done();
  });

  it('does not throw number cast error', function(done) {
    const n = new SchemaNumber();
    const items = [1, '2', '0', null, '', new String('47'), new Number(5), Number(47), Number('09'), 0x12];
    let err;
    try {
      for (let i = 0, len = items.length; i < len; ++i) {
        n.cast(items[i]);
      }
    } catch (e) {
      err = e;
    }
    assert.strictEqual(false, !!err, err);
    done();
  });

  it('boolean casts to 0/1 (gh-3475)', function(done) {
    const n = new SchemaNumber();
    assert.strictEqual(n.cast(true), 1);
    assert.strictEqual(n.cast(false), 0);
    done();
  });

  it('prefers valueOf function if one exists (gh-6299)', function(done) {
    const n = new SchemaNumber();
    const obj = {
      str: '10',
      valueOf: function() {
        return this.str;
      },
      toString: function() {
        return '11';
      }
    };
    assert.strictEqual(n.cast(obj), 10);
    done();
  });

  it('throws a CastError with a bad conditional (gh-6927)', function() {
    const n = new SchemaNumber();
    let err;
    try {
      n.castForQuery({ somePath: { $x: 43 } });
    } catch (e) {
      err = e;
    }
    assert.ok(/CastError/.test(err));
  });
});
