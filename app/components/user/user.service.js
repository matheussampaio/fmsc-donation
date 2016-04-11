(function () {

  angular
    .module('fmsc')
    .service('UserService', UserService);

  function UserService($log, $firebaseAuth, Firebase, FirebaseURL) {
    const _ref = new Firebase(`${FirebaseURL}`);
    const _auth = $firebaseAuth(_ref);

    const service = {
      data: getUser(),
      getUser,
      login,
      logout,
      createUser,
      isLoggedIn
    };

    activate();

    return service;

    ///////////////////

    function activate() {
      _auth.$onAuth((user) => {
        $log.debug('user loged in', user);
        service.data = user;
      });
    }

    function getUser() {
      return _auth.$getAuth();
    }

    function login({ email, password, remember }) {
      return _auth.$authWithPassword({
        email,
        password
      }, {
        remember: remember ? 'default' : 'sessionOnly'
      });
    }

    function logout() {
      _auth.$unauth();
    }

    function createUser({ email, password }) {
      return _auth.$createUser({
        email,
        password
      }).then((user) => {
        _ref.child('users').child(user.uid).set({
          provider: 'password'
        });

        $log.debug(`Logged in as: ${user.uid}`);

        return login({ email, password });
      });
    }

    function isLoggedIn() {
      return _auth.$getAuth() !== null;
    }

  }

})();
