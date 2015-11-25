import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route('index', { path: '/' });
    this.route('login');
    this.route('denied');
    this.route('profile');
    this.route('symbols');
    this.route('admin');
    this.resource('packages', function() {
        this.route('search', { path: '/search' });
        this.route('advanced-search', { path: '/advanced-search' });
        this.route('list', { path: '/list' });
        this.route('view', { path: '/:id/:version' });
    });
    this.resource('users', function() {
        this.route('list', { path: '/' });
        this.route('add', { path: '/add' });
        this.route('edit', { path: '/edit/*user_id' });
    });
    this.route('not_found', { path: '/*not_found' });
});

export default Router;
