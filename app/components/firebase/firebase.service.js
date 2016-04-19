(function () {

  angular
    .module('fmsc')
    .service('FirebaseRef', FirebaseRef);

  function FirebaseRef($window, $firebaseAuth, $firebaseObject, $firebaseArray, DEBUGFirebaseURL) {
    const Firebase = $window.Firebase;

    const URL = DEBUGFirebaseURL;

    const service = {
      url: URL,
      root: new Firebase(URL),
      auth: $firebaseAuth(new Firebase(URL)),
      pieces: new Firebase(`${URL}/pieces`),
      invoices: new Firebase(`${URL}/invoices`),
      current_image: $firebaseObject(new Firebase(`${URL}/current_image`))
    };

    return service;
  }

})();
