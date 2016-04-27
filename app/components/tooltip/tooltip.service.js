(function () {

  angular
    .module('fmsc')
    .service('TooltipService', TooltipService);

  function TooltipService($rootScope) {
    const vm = this;
    vm.buyers = [];

    let _tooltipElement = null;

    const service = {
      message: null,
      setMessage,
      setBuyers,
      setBuyer,
      setPosition,
      hideElement,
      showElement,
      register
    };

    return service;

    ///////////////////

    function setMessage(x, y) {
      const buyer = vm.buyers[`${x}-${y}`];
      if (angular.isDefined(buyer)) {
        service.message = `${buyer.name} - ${buyer.state}`;
        showElement();
      } else {
        service.message = null;
        hideElement();
      }

      $rootScope.$evalAsync();
    }

    function setBuyers(soldPieces) {
      soldPieces.forEach((soldPiece) => {
        setBuyer(soldPiece);
      });
    }

    function setBuyer(soldPiece) {
      vm.buyers[`${soldPiece.x}-${soldPiece.y}`] = {
        name: soldPiece.name,
        state: soldPiece.state
      };
    }

    function setPosition(pageX = 0, pageY = 0) {
      const pageWidth = angular.element(document).find('body').width();

      if (pageWidth < (pageX + 200)) {
        pageX -= 200;
      }

      if (_tooltipElement) {
        _tooltipElement.style.left = `${pageX}px`;
        _tooltipElement.style.top = `${pageY - 32}px`;
      }
    }

    function hideElement() {
      if (_tooltipElement) {
        _tooltipElement.style.display = 'none';
      }
    }

    function showElement() {
      if (_tooltipElement) {
        _tooltipElement.style.display = 'block';
      }
    }

    function register(element) {
      _tooltipElement = element;
    }
  }

})();
