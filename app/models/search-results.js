import Ember from 'ember';
import Package from './package';

export default Ember.Object.extend({
    query: '',
    page: 0,
    pageSize: 0,
    offset: 0,
    includePrerelease: false,
    totalHits: 0,
    hits: [],
});
