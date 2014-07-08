import UsersAddRoute from 'appkit/routes/users/add';
import ProgressIndicatorRoute from 'mixins/progressIndicatorRoute';

export default UsersAddRoute.extend(ProgressIndicatorRoute, {
    model: function (params) {
        return App.users.find(params.username);
    }
});
