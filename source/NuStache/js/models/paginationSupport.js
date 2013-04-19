define(['ember'], function (em) {
    return em.Mixin.create({
        hasPaginationSupport: true,
        total: 0,
        page: 0,
        pageSize: 10,
        didRequestPage: em.K,

        first: function () {
            return this.get('page') * this.get('pageSize') + 1;
        }.property('page', 'pageSize').cacheable(),

        last: function () {
            return Math.min((this.get('page') + 1) * this.get('pageSize'), this.get('total'));
        }.property('page', 'pageSize', 'total').cacheable(),

        hasPrevious: function () {
            return this.get('page') > 0;
        }.property('page').cacheable(),

        hasNext: function () {
            return this.get('last') < this.get('total');
        }.property('last', 'total').cacheable(),

        nextPage: function () {
            if (this.get('hasNext')) {
                this.incrementProperty('page');
            }
        },

        previousPage: function () {
            if (this.get('hasPrevious')) {
                this.decrementProperty('page');
            }
        },

        totalPages: function () {
            return Math.ceil(this.get('total') / this.get('pageSize'));
        }.property('total', 'pageSize').cacheable(),

        pageDidChange: function () {
            this.didRequestPage(this.get('page'));
        }.observes('page')
    });
});