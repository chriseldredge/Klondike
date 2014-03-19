import zeroClipboard from 'zeroClipboard';

export default Ember.View.extend({
    template: Ember.Handlebars.compile('<div class="code-snippet"><button class="copy-to-clipboard"><i class="fa fa-copy"></i></button>' +
                                       '<div class="message"></div>' +
                                       '<input type="text" class="code-snippet" readonly="readonly" {{bind-attr value=view.content}}/></div>'),
    tagName: 'div',

    activateZeroClipboard: function() {
        var self = this;
        var button = this.$('button');
        var copyCompleted = this.$('div.message');
        var client = new zeroClipboard(button);

        this.$('input').click(function(e) {
            e.preventDefault();
            var target = e.target;

            var data = self.get('data');
            var content = self.get('content');
            var start = 0;
            var end = content.length;

            if (data && content.indexOf(data) > 0) {
                start = content.indexOf(data);
                end = data.length + start;
            }

            if (!target) {
                return;
            } else if (target.setSelectionRange) /* WebKit */ {
                target.focus();
                target.setSelectionRange(start, end);
            } else if (e.createTextRange) /* IE */ {
                var range = target.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            } else if (target.selectionStart) {
                target.selectionStart = start;
                target.selectionEnd = end;
            }

            return false;
        });

        client.on('load', function(client) {
            client.on('dataRequested', function (client, args) {
                client.setText(self.get('data') || self.get('content'));
            });

            client.on('mouseover', function(client, args) {
                copyCompleted.text('Copy to clipboard');
                copyCompleted.show();
            });

            client.on('mouseout', function(client, args) {
                copyCompleted.fadeOut();
            });

            client.on('complete', function(client, args) {
                copyCompleted.text('Copied!');
            });
        });
    }.on('didInsertElement')
});
