import Ember from 'ember';

export default Ember.Component.extend({
    DefaultIconUrl: 'assets/package-default-icon-50x50.png',
    tagName: 'img',
    classNames: ['package-icon kl-icon--50 mr2'],
    attributeBindings: ['src', 'alt'],
    alt: 'package icon',

    url: null,

    src: function () {
        return this.get('url') || this.DefaultIconUrl;
    }.property('url'),

    didInsertElement: function () {
        var self = this;
        var img = this.$();
        img.error(function () {
            img.unbind('error').attr('src', self.DefaultIconUrl);
        });
    }
});
