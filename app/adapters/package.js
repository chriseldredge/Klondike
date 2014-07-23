import Ember from 'ember';
import SearchResults from '../models/search-results';
import Package from '../models/package';

export default Ember.Object.extend({
    defaultPageSize: 10,

    find: function (packageId, packageVersion) {
        console.log('get package info for ', packageId, packageVersion);
        return this.get('restClient').ajax('packages.getPackageInfo', {
            data: {
                id: packageId,
                version: packageVersion
            }
        }).then(function(json) {
            // TODO: move this into Package.init() or lazy-load it
            if (json && json.versionHistory) {
                for (var i=0; i<json.versionHistory.length; i++) {
                    var model = Package.create(json.versionHistory[i]);
                    model.set('active', model.get('version') === json.version);
                    json.versionHistory[i] = model;
                }
                json.versionHistory = json.versionHistory.sortBy('semanticVersion').reverse();
            }
            return Package.create(json);
        });
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

            self.convert(json.hits);

            var results = SearchResults.create(json, {
                loaded: true,
                loading: false,
                page: page,
                pageSize: pageSize
            });

            results.resolve(results);
            return results;
        });
    },
    convert: function (hits) {
        for (var i = 0; i < hits.length; i++) {
            var model = Package.create(hits[i]);
            hits[i] = this.convertTags(model);
        }
    },
    convertTags: function(hit) {
        var tags = hit.get('tags');
        if (Ember.isEmpty(tags)) {
            return hit;
        }

        var split = tags.split(' ');
        tags = [];

        for (var i = 0; i < split.length; i++) {
            if (split[i] !== '') {
                tags.push(split[i]);
            }
        }

        hit.set('tags', tags);

        return hit;
    }
});
