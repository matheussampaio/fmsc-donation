(function() {

  angular
    .module('fmsc')
    .component('millionImage', {
      controller: millionImageController,
      templateUrl: 'million-image/million-image.html'
    });

  function millionImageController($log) {
    const vm = this;

    vm.width = [];
    vm.height = [];
    vm.bought = {};

    vm.isBought = isBought;

    activate();

    /////////////////

    function activate() {
      for (let i = 1; i <= 250; i++) {
        vm.width.push(i);
      }

      for (let i = 1; i <= 200; i++) {
        vm.height.push(i);
      }

      vm.height.forEach(row => {
        vm.width.forEach(col => {
          vm.bought[`${row}x${col}`] = Math.random();
        });
      });

      // vm.bought = {
      //   '10x10': true,
      //   '20x20': true
      // };
    }

    function isBought(row, col) {
      return vm.bought[`${row}x${col}`] < 0.75;
      // return (Math.random() < 0.25);
    }

  }

})();
