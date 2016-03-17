(function() {

  angular
    .module('fmsc')
    .component('millionImage', {
      controller: millionImageController,
      templateUrl: 'million-image/million-image.html',
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
        for (let i = 0; i < 250; i++) {
          vm.rows.push(i);
          vm.cols.push(i);
          vm.meals.push([]);
          for (let j = 0; j < 250; j++) {
            var rand = Math.random();
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
        console.log(vm.meals[row][col].buyer);
      }

      function hideBuyer(row, col) {
        // console.log(vm.meals[row][col].buyer);
      }
    }

})();
