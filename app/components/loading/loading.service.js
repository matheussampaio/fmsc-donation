(function () {

  angular
    .module('fmsc')
    .service('LoadingService', LoadingService);

  function LoadingService() {
    const service = {
      _status: false,
      isLoading,
      start,
      stop
    };

    return service;

    ///////////////////

    function start() {
      service._status = true;
    }

    function stop() {
      service._status = false;
    }

    function isLoading() {
      return service._status;
    }
  }

})();
