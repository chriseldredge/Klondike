export default function(version) {
    return Ember.Object.extend(Ember.Comparable, {
        version: '',

        compare: function(a, b) {
            /* -1 if a < b
                0 if a == b
                1 if a > b
            */

            var av = a.get('version').split('-');
            var bv = b.get('version').split('-');

            var vcmp = this.compareSemanticVersion(av[0], bv[0]);

            if (vcmp != 0) return vcmp;

            av.shift();
            bv.shift();

            var ax = av.join('-');
            var bx = bv.join('-');

            if (!Ember.isEmpty(ax) && Ember.isEmpty(bx)) return -1;
            if (Ember.isEmpty(ax) && !Ember.isEmpty(bx)) return 1;

            console.log('compare', ax, 'to', bx);

            return Ember.compare(ax, bx);
        },

        compareSemanticVersion: function(a, b) {
            a = a.split('.').map(function(s) { return parseInt(s); });
            b = b.split('.').map(function(s) { return parseInt(s); });

            var i = 0;
            var len = Math.max(a.length, b.length);
            var x = a.length < len ? a : (b.length < len ? b : null);

            while (x && x.length < len) {
                x.push(0);
            }

            for (var i=0; i<len; i++) {
                if (a[i] < b[i]) return -1;
                if (a[i] > b[i]) return 1;
            }

            return 0;
        }
    }).create({version: version});
};
