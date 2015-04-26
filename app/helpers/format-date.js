import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(date, options) {
    var format = options.hash.format || 'dddd, MMMM Do YYYY, HH:mm:ss A Z';
    return window.moment(date).format(format);
});
