import UsersAddRoute from 'appkit/routes/users/add';
import LazyRoute from 'mixins/lazyRoute';

export default UsersAddRoute.extend(LazyRoute, {
    model: function (params) {
        return App.users.find(params.username);
    }
});
