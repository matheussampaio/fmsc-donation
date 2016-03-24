(function () {

  angular
    .module('fmsc')
    .component('app', {
      controller: AppController,
      templateUrl: 'app/app.html'
    });

  function AppController($rootScope, FirebaseService) {
    activate();

    ////////////////

    function activate() {
      $rootScope.user = FirebaseService.auth.$getAuth();

      FirebaseService.auth.$onAuth((user) => {
        $rootScope.user = user;
      });
    }
  }

})();
