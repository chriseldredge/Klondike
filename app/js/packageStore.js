import SearchResults from 'models/searchResults';
import Package from 'models/package';

export default Ember.Object.extend({
    restApi: null,
    defaultPageSize: 10,

    find: function (packageId, packageVersion) {
        return this.get('restApi').ajax('packages.getPackageInfo', {
            data: {
                id: packageId,
                version: packageVersion
            }
        }).then(function(json) {
            var results = Package.create(json.package, {
                versionHistory: json.versionHistory
            });
            results.resolve(results);
            return results;
        });
    },
    search: function (query, page, pageSize, sort) {
        page = page || 0;
        pageSize = pageSize || this.get('defaultPageSize');

        var self = this;

        return this.get('restApi').ajax('packages.search', {
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
            model.resolve(model);
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
