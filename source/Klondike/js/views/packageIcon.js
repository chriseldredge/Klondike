define(['ember'], function (em) {
    return em.View.extend({
        DefaultIconUrl: 'img/package-default-icon-50x50.png',
        tagName: 'img',
        classNames: ['package-icon'],
        attributeBindings: ['src', 'alt'],
        alt: 'package icon',
        
        src: function () {
            var url = this.get('content.iconUrl');

            if (!url) {
                url = this.DefaultIconUrl;
            }
            return url;

        }.property('content.iconUrl'),
        
        didInsertElement: function () {
            var self = this;
            var img = $(this.get('element'));
            img.error(function () {
                img.unbind("error").attr("src", self.DefaultIconUrl);
            });
        }
    });
});