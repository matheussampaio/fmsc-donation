(function () {

  angular
    .module('fmsc')
    .service('FirebaseService', FirebaseService);

  function FirebaseService($firebaseAuth) {
    const URL = 'https://fmsc-donation1.firebaseio.com/';

    const service = {
      ref: new Firebase(URL),
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
