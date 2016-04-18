(function () {

  angular
    .module('fmsc')
    .service('AuthService', AuthService);

  function AuthService($log, FirebaseRef) {
    const _auth = FirebaseRef.auth;

    const service = {
      user: getUser(),
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
        service.user = user;
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
        Firebase.users[user.uid] = {
          provider: 'password'
        };

        return Firebase.users.$save();
      })
      .then(() => {
        $log.debug('User created.');

        return login({ email, password });
      });
    }

    function isLoggedIn() {
      return _auth.$getAuth() !== null;
    }

  }

})();
