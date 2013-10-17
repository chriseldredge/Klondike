define(['ember'], function (em) {
    return em.Controller.extend({
        needs: 'packagesSearch',
        searchBoxBinding: em.Binding.oneWay('controllers.packagesSearch.query'),
        actions: {
            search: function () {
                this.get('controllers.packagesSearch').goTo(this.get('searchBox'));
            }
        }
    });
});