import Ember from 'ember';
import ApplicationException from 'klondike/application-exception';
import describePromise from 'klondike/util/describe-promise';

var cache = {};

function createHandler(funcName) {
    return function() {
        var name = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);

        var adapter = this.container.lookup('adapter:' + name);
        if (!adapter) {
            throw new ApplicationException('The adapter "' + name + '" is not registered in container.');
        }

        var func = adapter[funcName];
        if (func === undefined) {
            throw new ApplicationException('The adapter "' + name + '" does not have a method named "' + funcName + '"');
        }

        return func.apply(adapter, args);
    };
}

export default Ember.Object.extend({
    find: function() {
        var name = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        var id = args.join('::');

        if (cache[name] && cache[name][id]) {
            return cache[name][id];
        }

        var adapter = this.container.lookup('adapter:' + name);
        return adapter.find.apply(adapter, args).then(function(record) {
            cache[name] = cache[name] || {};
            cache[name][id] = record;
            return record;
        }, null, describePromise(this, 'find', arguments) + ': Cache Result');
    },

    list: createHandler('list'),

    createModel: createHandler('createModel'),
});
