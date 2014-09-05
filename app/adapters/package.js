import Ember from 'ember';
import Package from '../models/package';
import SearchResults from '../models/search-results';
import describePromise from '/klondike/util/describe-promise';

export default Ember.Object.extend({
    defaultPageSize: 10,

    find: function (packageId, packageVersion) {
        var self = this;
        return this.get('restClient').ajax('packages.getPackageInfo', {
            data: {
                id: packageId,
                version: packageVersion
            }
        }).then(function(json) {
            return self._createPackageModel(json);
        }, null, describePromise(this, 'find', arguments));
    },

    search: function (query, page, pageSize, sort) {
        page = page || 0;
        pageSize = pageSize || this.get('defaultPageSize');

        var self = this;

        return this.get('restClient').ajax('packages.search', {
            data: {
                query: query,
                offset: page * pageSize,
                count: pageSize,
                sort: sort || 'score'
            }
        }).then(function(json) {
            if (json.query === null) {
                json.query = '';
            }

            var hits = json.hits || [];
            hits = hits.map(function(hit) { return self._createPackageModel(hit); });
            delete json.hits;

            return SearchResults.create(json, {
                hits: hits,
                page: page,
                pageSize: pageSize
            });
        }, null, describePromise(this, 'search', arguments));
    },

    _createPackageModel: function(json) {
        var versions = json.versionHistory || [];
        var thisVersion = json.version;

        versions = versions.map(function(v) {
            return Package.create(v, {
                active: v.version === thisVersion
            });
        });

        versions = versions.sortBy('semanticVersion').reverse();

        var tags = json.tags || [];
        if (typeof tags === 'string') {
            tags = tags.split(' ')
                .map(function(tag) { return tag.trim(); })
                .filter(function(tag) { return tag !== ''; });
        }

        return Package.create(json, {
            versionHistory: versions,
            tags: tags
        });
    }
});
