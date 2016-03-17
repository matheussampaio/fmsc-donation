(function() {

  angular
    .module('fmsc')
    .component('millionImage', {
      controller: millionImageController,
      templateUrl: 'million-image/million-image.html',
    });

    function millionImageController($log) {
      const vm = this;

      vm.width = [];
      vm.height = [];
      vm.meals = [];
      vm.isBought = isBought;

      activate();

      function activate() {
        for (let i = 0; i < 250; i++) {
          vm.width.push(i);
          vm.height.push(i);
          vm.meals.push([]);
          for (let j = 0; j < 250; j++) {
            var rand = Math.random();
            vm.meals[i].push({ bought: rand < 0.25 });
          }
        }
      }

      function isBought(row, col) {
        return vm.meals[row][col].bought;
      }
    }

})();
