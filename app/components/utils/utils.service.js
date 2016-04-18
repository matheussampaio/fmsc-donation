(function () {

  angular
    .module('fmsc')
    .service('UtilsService', UtilsService);

  function UtilsService($rootScope) {
    const service = {
      refresh
    };

    return service;

    ///////////////////

    function refresh() {
      if (!$rootScope.$$phase) {
        $rootScope.$digest();
      }
    }
  }

})();
