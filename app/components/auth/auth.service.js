(function () {

  angular
    .module('fmsc')
    .service('AuthService', AuthService);

  function AuthService($q, $log, $firebaseObject, FirebaseRef) {
    const _auth = FirebaseRef.auth;

    const service = {
      user: null,
      getUser,
      login,
      logout,
      createUser,
      isAuthenticated,
      update
    };

    activate();

    return service;

    ///////////////////

    function activate() {
      loadUser();

      _auth.$onAuth(loadUser);
    }

    function loadUser() {
      const auth = _auth.$getAuth();

      if (auth === null) {
        service.user = null;
        return $q.reject();
      }

      service.user = $firebaseObject(FirebaseRef.root.child(`users/${auth.uid}`));

      return service.user.$loaded();
    }

    function getUser() {
      if (!service.user) {
        return loadUser().then(() => service.user);
      }

      return service.user.$loaded().then(() => service.user);
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
      service.user = null;
    }

    function createUser({ email, password, name, state }) {
      return _auth.$createUser({
        email,
        password
      })
      .then((user) => {
        return FirebaseRef.root.child('users').child(user.uid).set({
          provider: 'password',
          name,
          state,
          uid: user.uid,
          email
        });
      })
      .then(() => {
        $log.debug('User created.');

        return login({ email, password });
      });
    }

    function update({ name, state }) {
      service.user.name = name;
      service.user.state = state;

      return service.user.$save();
    }

    function isAuthenticated() {
      return _auth.$getAuth() !== null;
    }

  }

})();
