(function () {

  angular
    .module('fmsc')
    .component('donateButton', {
      controller: donateButtonController,
      templateUrl: 'donate-button/donate-button.html'
    });

  function donateButtonController($log) {
    // const vm = this;

    $log.debug('donate-button');
  }

})();
