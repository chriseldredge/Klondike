define(['ember', 'models/searchResults'], function (em, searchResults) {
    return em.Object.extend({
        restClient: null,
        search: function (query, page, pageSize) {
            console.log('load search results for query', query, 'page', page);

            var results = searchResults.create({
                query: query,
                page: page,
                pageSize: pageSize
            });

            var self = this;
            
            this.get('restClient').ajax('packages.search', {
                data: {
                    query: query,
                    offset: page * pageSize,
                    count: pageSize
                },
                success: function (json) {
                    self.convert(json.hits);
                    results.setProperties(json);
                    results.setProperties({ loaded: true, loading: false });
                }
            });

            return results;
        },
        convert: function (hits) {
            for (var i = 0; i < hits.length; i++) {
                hits[i] = this.convertTags(hits[i]);
            }
        },
        convertTags: function(hit) {
            if (!hit || !hit.tags) return hit;

            var split = hit.tags.split(' ');
            var tags = [];
            
            for (var i = 0; i < split.length; i++) {
                if (split[i] !== '') {
                    tags.push(split[i]);
                }
            }

            hit.tags = tags;

            return hit;
        }
    });
});