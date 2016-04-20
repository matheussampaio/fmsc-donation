(function () {

  angular
    .module('fmsc')
    .service('AuthService', AuthService);

  function AuthService($q, $log, FirebaseRef) {
    const _auth = FirebaseRef.auth;

    const service = {
      user: getUser(),
      getUser,
      login,
      logout,
      createUser,
      isAuthenticated
    };

    activate();

    return service;

    ///////////////////

    function activate() {
      _auth.$onAuth(() => {
        getUser()
          .then(user => {
            service.user = user;
          })
          .catch(() => {
            service.user = null;
          });
      });
    }

    function getUser() {
      const auth = _auth.$getAuth();

      if (auth === null) {
        return $q.reject();
      }

      return $q((resolve, reject) => {
        FirebaseRef.root.child(`users/${auth.uid}`).once('value').then(snapshot => {
          if (!snapshot) {
            return reject();
          }

          const user = snapshot.val();
          user.uid = auth.uid;

          return resolve(user);
        });
      });
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

    function createUser({ email, password, name, state }) {
      return _auth.$createUser({
        email,
        password
      })
      .then((user) => {
        return FirebaseRef.root.child('users').child(user.uid).set({
          provider: 'password',
          name,
          state
        });
      })
      .then(() => {
        $log.debug('User created.');

        return login({ email, password });
      });
    }

    function isAuthenticated() {
      return _auth.$getAuth() !== null;
    }

  }

})();
