(function () {

  angular
    .module('fmsc')
    .service('UserService', UserService);

  function UserService($log, FirebaseService) {
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
      FirebaseService.auth.$onAuth((user) => {
        $log.debug('user loged in', user);
        service.data = user;
      });
    }

    function getUser() {
      return FirebaseService.auth.$getAuth();
    }

    function login({ email, password, remember }) {
      return FirebaseService.auth.$authWithPassword({
        email,
        password
      }, {
        remember: remember ? 'default' : 'sessionOnly'
      });
    }

    function logout() {
      FirebaseService.auth.$unauth();
    }

    function createUser({ email, password }) {
      return FirebaseService.auth.$createUser({
        email,
        password
      }).then((user) => {
        $log.debug(`Logged in as: ${user.uid}`);

        return login({ email, password });
      });
    }

    function isLoggedIn() {
      return FirebaseService.auth.$getAuth() !== null;
    }

  }

})();
