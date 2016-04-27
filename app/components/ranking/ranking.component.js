(function () {

  angular
    .module('fmsc')
    .component('ranking', {
      controller: rankingController,
      templateUrl: 'ranking/ranking.html'
    });

  function rankingController($firebaseArray, _, UtilsService, FirebaseRef, LoadingService) {
    const vm = this;

    vm.total = 0;
    vm.invoices = null;
    vm.$onInit = $onInit;

    vm.mapObject = {
      scope: 'usa',
      options: {
        width: 1000,
        legendHeight: 10,
        labelSize: 10,
        responsive: true,
        staticGeoData: true,
        labels: {
          IL: 100
        }
      },
      geographyConfig: {
        highlightFillColor: '#FF4081',
        highlighBorderColor: '#3F51B5',
        highlightBorderOpacity: 1,
        highlighBorderWidth: 2,
        popupTemplate: (geography, data) => {
          return `<div class="hoverinfo"><span class="statename">${geography.properties.name}</span>
                    </br>Donations: ${data.numberOfThings}
                  </div>`;
        }
      },
      fills: {
        5: '#08519c',
        4: '#3182bd',
        3: '#6baed6',
        2: '#9ecae1',
        1: '#c6dbef',
        0: '#dddddd',
        defaultFill: '#dddddd'
      },
      data: {}
    };

    function $onInit() {
      LoadingService.start();

      const ref = FirebaseRef.invoices.orderByChild('status').equalTo('paid');

      vm.invoices = $firebaseArray(ref);

      vm.invoices.$loaded()
        .then(_init)
        .then(() => {
          LoadingService.stop();
          vm.invoices.$watch(invoice => _invoiceAdd(invoice));
        });
    }

    function _init(invoices) {
      // Initiate data with states
      UtilsService.statesShort.forEach(state => {
        vm.mapObject.data[state] = {
          numberOfThings: 0,
          fillKey: '0'
        };
      });

      // Calculate amount of meals donated per state and total
      invoices.forEach(_invoice);

      // Calculate the color for each state with donations
      _updateColors();
    }

    function _updateColors() {
      UtilsService.statesShort.forEach(stateAbbr => {
        const state = vm.mapObject.data[stateAbbr];
        if (state.numberOfThings > 0) {
          state.fillKey = _getColor(state.numberOfThings / vm.total);
        }
      });
    }

    function _invoiceAdd({ key }) {
      const invoice = vm.invoices.$getRecord(key);

      _invoice(invoice);
      _updateColors();
    }

    function _invoice(invoice) {
      const state = UtilsService.getStateAbbrFromName(invoice.state);

      vm.total += invoice.quantity;
      vm.mapObject.data[state].numberOfThings += invoice.quantity;
    }

    function _getColor(num) {
      if (num <= 0) {
        return '0';
      } else if (num < 0.2) {
        return '1';
      } else if (num < 0.4) {
        return '2';
      } else if (num < 0.6) {
        return '3';
      } else if (num < 0.8) {
        return '4';
      } else if (num < 1) {
        return '5';
      }

      return '0';
    }
  }

})();
