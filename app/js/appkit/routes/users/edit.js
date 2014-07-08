import UsersAddRoute from 'appkit/routes/users/add';
import LazyRoute from 'mixins/lazyRoute';

export default UsersAddRoute.extend(LazyRoute, {
    loadModel: function (params) {
        return App.users.find(params.username);
    }
});
