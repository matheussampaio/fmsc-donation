(function () {

  angular
    .module('fmsc')
    .service('FirebaseRef', FirebaseRef);

  function FirebaseRef($window, $firebaseAuth, $firebaseObject, DEBUGFirebaseURL) {
    const Firebase = $window.Firebase;

    const URL = DEBUGFirebaseURL;

    const service = {
      root: new Firebase(URL),
      auth: $firebaseAuth(new Firebase(URL)),
      users: $firebaseObject(new Firebase(`${URL}/users`))
    };

    return service;
  }

})();
