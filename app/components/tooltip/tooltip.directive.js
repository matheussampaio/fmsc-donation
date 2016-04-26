(function () {

  angular
    .module('fmsc')
    .directive('tooltip', tooltipDirective);

  function tooltipDirective($log, TooltipService) {
    return {
      controller: tooltipController,
      controllerAs: '$ctrl',
      templateUrl: 'tooltip/tooltip.html',
      link: ($scope, $element) => {
        const tooltipElement = $element[0].children[0];

        TooltipService.register(tooltipElement);
      }
    };
  }

  function tooltipController(TooltipService) {
    const vm = this;

    vm.TooltipService = TooltipService;
  }

})();
