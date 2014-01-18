import PackagesSearchRoute from 'appkit/routes/packages/search';

export default PackagesSearchRoute.extend({
    model: function (params) {
        return App.packages.search('', undefined, undefined, 'id');
    }
});
