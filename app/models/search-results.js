import Ember from 'ember';

export default Ember.Object.extend({
    query: '',
    page: 0,
    pageSize: 0,
    offset: 0,
    includePrerelease: false,
    totalHits: 0,
    hits: [],
});
