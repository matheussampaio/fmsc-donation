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

    function activate() {
      const MAX_ROWS = 160;
      const MAX_COLUMNS = 250;

      for (let i = 0; i < MAX_ROWS; i++) {
        vm.rows.push(i);
      }

      for (let i = 0; i < MAX_COLUMNS; i++) {
        vm.cols.push(i);
      }

      for (let i = 0; i < MAX_ROWS; i++) {
        vm.meals.push([]);
        for (let j = 0; j < MAX_COLUMNS; j++) {
          const rand = Math.random();

          vm.meals[i].push({
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
