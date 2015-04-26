import Ember from 'ember';

export default Ember.Mixin.create({
    hasPaginationSupport: true,
    total: 0,
    page: 0,
    pageSize: 10,
    didRequestPage: Ember.K,

    first: function () {
        return this.get('page') * this.get('pageSize') + 1;
    }.property('page', 'pageSize'),

    last: function () {
        return Math.min((this.get('page') + 1) * this.get('pageSize'), this.get('total'));
    }.property('page', 'pageSize', 'total'),

    hasPrevious: function () {
        return this.get('page') > 0;
    }.property('page'),

    hasNext: function () {
        return this.get('last') < this.get('total');
    }.property('last', 'total'),

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
    }.property('total', 'pageSize'),

    pageDidChange: function () {
        this.didRequestPage(this.get('page'));
    }.observes('page')
});
