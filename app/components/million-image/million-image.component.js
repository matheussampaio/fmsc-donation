(function () {

  angular
    .module('fmsc')
    .component('millionImage', {
      controller: millionImageController,
      templateUrl: 'million-image/million-image.html'
    });

  function millionImageController($log) {
    const vm = this;

    vm.rows = [];
    vm.cols = [];
    vm.meals = [];
    vm.isBought = isBought;
    vm.showBuyer = showBuyer;
    vm.hideBuyer = hideBuyer;

    activate();

    ////////////////

    function activate() {
      const MAX_ROWS = 160;
      const MAX_COLUMNS = 250;

      for (let y = 0; y < MAX_ROWS; y++) {
        vm.rows.push(y);
      }

      for (let x = 0; x < MAX_COLUMNS; x++) {
        vm.cols.push(x);
      }

      for (let y = 0; y < MAX_ROWS; y++) {
        vm.meals.push([]);
        for (let x = 0; x < MAX_COLUMNS; x++) {
          const rand = Math.random();

          vm.meals[y].push({
            bought: rand < 0.25,
            buyer: 'John Doe'
          });
        }
      }
    }

    function isBought(row, col) {
      return vm.meals[row][col].bought;
    }

    function showBuyer(row, col) {
      $log.log(vm.meals[row][col].buyer);
    }

    function hideBuyer(row, col) {
      // console.log(vm.meals[row][col].buyer);
    }
  }

})();
