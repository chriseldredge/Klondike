export default Ember.Route.extend({
    model: function (params) {
        console.log('load model for packages/search');
        return App.packages.search(params.query, 0, 10);
    },
    serialize: function (model) {
        console.log('serialize for packages/search', model);
        return { query: model.query };
    }
});
