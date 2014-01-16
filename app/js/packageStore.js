import SearchResults from 'models/searchResults';
import Package from 'models/package';

export default Ember.Object.extend({
    restApi: null,
    find: function (packageId, packageVersion) {
        var results = Package.create({
            id: packageId,
            version: packageVersion,
        });

        var client = this.get('restApi');
        client.then(function() {
            client.ajax('packages.getPackageInfo', {
                data: {
                    id: packageId,
                    version: packageVersion
                },
                success: function(json) {
                    results.set('versionHistory', json.versionHistory);
                    results.setProperties(json.package);
                    results.resolve(results);
                }
            });
        });

        return results;
    },
    search: function (query, page, pageSize) {
        console.log('load search results for query', query, 'page', page);

        var results = SearchResults.create({
            query: query,
            page: page,
            pageSize: pageSize
        });

        var self = this;
        var client = this.get('restApi');

        client.then(function() {
            client.ajax('packages.search', {
                data: {
                    query: query,
                    offset: page * pageSize,
                    count: pageSize
                },
                success: function(json) {
                    self.convert(json.hits);
                    results.setProperties(json);
                    results.setProperties({ loaded: true, loading: false });
                    results.resolve(results);
                }
            });
        });

        return results;
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
