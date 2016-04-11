(function () {

  angular
    .module('fmsc')
    .factory('Firebase', FirebaseFactory);

  function FirebaseFactory($window) {
    return $window.Firebase;
  }

})();
