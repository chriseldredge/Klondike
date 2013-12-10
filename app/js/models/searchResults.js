export default Ember.Deferred.extend({
    loaded: false,
    loading: true,
    query: '',
    page: 0,
    pageSize: 0,
    offset: 0,
    includePrerelease: false,
    totalHits: 0,
    hits: []
});
