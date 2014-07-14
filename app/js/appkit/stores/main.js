import ApplicationException from 'applicationException';

var cache = {};

function createHandler(funcName) {
    return function() {
        var name = arguments[0];
        console.log('adapter:' + name + '.' + funcName, arguments);
        var adapter = this.container.lookup('adapter:' + name);
        if (!adapter) {
            throw new ApplicationException('The adapter "' + name + '" is not registered in container.');
        }

        var func = adapter[funcName];
        if (func === undefined) {
            throw new ApplicationException('The adapter "' + name + '" does not have a method named "' + funcName + '"');
        }

        return func.apply(adapter, arguments);
    }
}

export default Ember.Object.extend({
    find: function(name, id) {
        console.log('store:main find', arguments);
        if (cache[name] && cache[name][id]) {
            return cache[name][id];
        }

        var adapter = this.container.lookup('adapter:' + name);
        return adapter.find(name, id).then(function(record) {
            cache[name] = cache[name] || {};
            cache[name][id] = record;
            return record;
        });
    },

    list: createHandler('list'),

    createModel: createHandler('createModel'),
});
