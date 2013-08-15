define(['ember'], function (em) {
    return em.Controller.extend({
        needs: 'search',
        searchBoxBinding: em.Binding.oneWay('controllers.search.query'),
        search: function () {
            this.get('controllers.search').goTo(this.get('searchBox'));
        }
    });
});