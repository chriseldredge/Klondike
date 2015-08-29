import Ember from 'ember';
import BaseControllerMixin from 'klondike/mixins/base-controller';

export default Ember.Controller.extend(BaseControllerMixin, {
  origin: function() {
    var dataUrl = this.get('model.originUrl') || '';
    var index = dataUrl.indexOf('/api/');
    return index < 0 ? dataUrl : dataUrl.substring(0, index + 1);
  }.property('model.originUrl'),

  hasAdditionalDescription: function() {
    return this.get('model.summary') !== this.get('model.description');
  }.property('model.summary', 'model.description'),

  installCommand: function() {
    return 'Install-Package ' + this.get('model.id') +
      ' -Version ' + this.get('model.version') +
      ' -Source ' + this.get('packageSourceUri');
  }.property('model.id', 'model.version', 'packageSourceUri'),

  sortColumn: 'semanticVersion',

  actions: {
    sortVersions: function(column) {
      var arr = this.get('model.versionHistory');
      var prevSortColumn = this.get('sortColumn');

      if (prevSortColumn === column) {
        arr = arr.copy().reverse();
      } else {
        arr = arr.sortBy(column).reverse();
        this.set('sortColumn', column);
      }

      this.set('model.versionHistory', arr);
    },

    goToDependency: function(dep) {
      var includePrerelease = this.get('model.isPrerelease');
      var query = 'PackageId:' + dep.id;

      this.transitionToRoute('packages.search', {queryParams: {query: query, latestOnly:true, page: 0, includePrerelease: includePrerelease, originFilter: 'any' }});
    }
  }
});
