(function () {

  angular
    .module('fmsc')
    .service('FirebaseService', FirebaseService);

  function FirebaseService($firebaseAuth, FirebaseUrl) {
    const service = {
      ref: new Firebase(FirebaseUrl),
      auth: null
    };

    active();

    return service;

    ///////////////////

    function active() {
      service.auth = $firebaseAuth(service.ref);
    }
  }

})();
