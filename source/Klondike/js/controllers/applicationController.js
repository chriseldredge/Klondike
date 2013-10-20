(function (em, app) {
    app.ApplicationController = em.Controller.extend(app.BaseControllerMixin, {
        needs: 'packagesSearch',
        searchBoxBinding: em.Binding.oneWay('controllers.packagesSearch.query'),
        actions: {
            search: function () {
                this.get('controllers.packagesSearch').goTo(this.get('searchBox'));
            }
        }
    });
}(Ember, App));