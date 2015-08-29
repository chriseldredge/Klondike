import Ember from 'ember';

export default Ember.Helper.helper(function([date], options) {
  var format = options.format || 'dddd, MMMM Do YYYY, HH:mm:ss A Z';
  return window.moment(date).format(format);
});
