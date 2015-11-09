import PackagesSearchController from './search';

export default PackagesSearchController.extend({
  sortBy: 'id',

  init: function()
  {
    // remove "relevance" from sort options
    var sortByColumns = this.get('sortByColumns');
    this.set('sortByColumns', sortByColumns.slice(1));

    this._super();
  }
});
