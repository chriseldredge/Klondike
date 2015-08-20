import Ember from 'ember';

var KEYS = {
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  UP: 38,
  DOWN: 40
};

/* TODO:
  o blur dismisses suggestions (buggy)
  o handle * in numeric range query
  o handle conversion of "false" -> bool -> numeric value
  o safari & IE testing
    * safari: box only shows first time
*/

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['auto-complete'],
  value: '',
  terms: [],
  suggestions: [],

  _selectedSuggestionIndex: -1,

  dropdownVisible: Ember.computed('suggestions', function() {
    return !Ember.isEmpty(this.get('suggestions'));
  }),

  init: function() {
    this._super();

    // encourage property observers to start:
    this.get('currentTerm');
  },

  _cursorIndex: function() {
    var input = this.get('_text');
    if (input) {
      return input.caret().start;
    }
    return 0;
  }.property('value'),

  currentTerm: function() {
    var value = this.get('value');
    var range = this._getTermRange();

    if (range.start < 0) {
      return '';
    }

    return value.substring(range.start, range.end);
  }.property('_cursorIndex', 'value'),

  _getTermRange: function() {
    var value = this.get('value');
    var end = this.get('_cursorIndex');
    var start = end - 1;
    while (start > 0 && this._isValidTermChar(value[start])) {
      if (value[start] === ':') {
        return { start: -1, end: -1 };
      }
      start--;
    }

    if (!this._isValidTermChar(value[start])) {
      start++;
    }

    return { start: start, end: end };
  },

  _isValidTermChar: function(c) {
    return c !== ' ' && c !== '+' && c !== '-' && c !== '(';
  },

  _findSuggestions: function() {
    var term = this.get('currentTerm').toLowerCase();

    var matches = term === '' ? [] : this.get('terms').filter(function(i) {
      return i.toLowerCase().indexOf(term) >= 0;
    }).sort(function(a, b) {
      var aStartsWith = a.toLowerCase().indexOf(term) === 0;
      var bStartsWith = b.toLowerCase().indexOf(term) === 0;
      if (aStartsWith && !bStartsWith) {
        return -1;
      } else if (bStartsWith && !aStartsWith) {
        return 1;
      }

      return a.length - b.length;
    });

    this.set('suggestions', matches);
  }.observes('currentTerm'),

  _showAutocompleteSuggestions: function() {
    var self = this;

    var list = this.$("ol");

    list.empty();

    this.set('_selectedSuggestionIndex', -1);

    this.get('suggestions').forEach(function(i) {
      list.append('<li>' + i + '</li>');
    });

    list.children('li').on('click', function() {
      var value = Ember.$(this).text();
      self.send('selectTerm', value);
    });
  }.observes('suggestions'),

  _attachEvents: function() {
    var self = this;
    var text = this.$('input[type=text]');
    var list = this.$('ol');

    text.on('keydown.auto-complete', function(e) {
      if (e.which === KEYS.DOWN) {
        self.send('nextSuggestion');
      } else if (e.which === KEYS.UP) {
        self.send('previousSuggestion');
      } else if (e.which === KEYS.ENTER || e.which === KEYS.TAB) {
        var selection = self.$('li.is-selected').first().text();
        if (selection !== '') {
          self.send('selectTerm', selection);
        } else if (e.which === KEYS.ENTER) {
          self.sendAction();
        } else {
          return true;
        }
      } else if (e.which === KEYS.SPACE && e.ctrlKey) {
        self.send('suggestAll');
      } else if (e.which === KEYS.ESC) {
        self.send('hideSuggestions');
      } else {
        return true;
      }

      e.preventDefault();
      return false;
    });

    text.on('blur.auto-complete', function() {
      if (self.get('_blurIntoOptions') === true) {
        self.set('_blurIntoOptions', false);
        return;
      }

      Ember.run.schedule('afterRender', function() {
        self.send('hideSuggestions');
      });
    });

    list.on('mousedown.auto-complete', function() {
      self.set('_blurIntoOptions', true);
    });

    this.set('_text', text);
  }.on('didInsertElement'),

  _unattachEvents: function() {
    var text = this.$('input[type=text]');
    text.off('keydown.auto-complete');
    text.off('blur.auto-complete');
  }.on('willDestroyElement'),

  _advanceSuggestion: function(delta, absolute) {
    var i = this.get('_selectedSuggestionIndex');
    var next = absolute !== undefined ? absolute : i + delta;

    var opts = this.$('li');
    if (opts.length === 0) {
      return;
    }

    if (next < 0) {
      next = 0;
    } else if (next >= opts.length) {
      next = opts.length - 1;
    }

    if (i >= 0 && i < opts.length) {
      Ember.$(opts[i]).removeClass('is-selected');
    }
    Ember.$(opts[next]).addClass('is-selected');

    this.set('_selectedSuggestionIndex', next);
  },

  _scrollToSelectedIndex: function() {
    var list = this.$('ol.auto-complete');
    var selected = this.$('li.is-selected');
    if (selected.length !== 1) {
      list.scrollTop(0);
      return;
    }

    var offset = selected.offset().top - list.offset().top;

    if (offset < 0) {
      list.scrollTop(list.scrollTop() + offset);
    } else if (offset + selected.outerHeight() > list.height()) {
      var pos = offset + selected.outerHeight() - list.height();
      list.scrollTop(list.scrollTop() + pos);
    }
  }.observes('_selectedSuggestionIndex'),

  actions: {
    selectTerm: function(term) {
      var value = this.get('value');
      var range = this._getTermRange();
      var up = value.substring(0, range.start) + term + ':';

      var caretPosition = up.length;

      if (range.end < value.length) {
        var end = value.substring(range.end, value.length);
        if (end.length > 0 && end[0] !== ' ') {
          end = ' ' + end;
        }
        up += end;
      }

      this.set('value', up);

      this.set('suggestions', []);

      var text = this.get('_text');

      Ember.run.schedule('afterRender', function() {
        text.caret(caretPosition, caretPosition);
      });
    },

    nextSuggestion: function() {
      this._advanceSuggestion(1);
    },

    previousSuggestion: function() {
      this._advanceSuggestion(-1);
    },

    suggestAll: function() {
      this.set('suggestions', this.get('terms').sort());
      this._advanceSuggestion(0, 0);
    },

    hideSuggestions: function() {
      this.set('suggestions', []);
    }
  }
});
