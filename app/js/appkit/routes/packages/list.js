import PackagesSearchRoute from 'appkit/routes/packages/search';

export default PackagesSearchRoute.extend({
    loadModel: function (params) {
        return App.packages.search('', undefined, undefined, 'id');
    }
});
