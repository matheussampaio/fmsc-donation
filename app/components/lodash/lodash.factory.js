(function() {

  /**
   * Lodash wrapper module.
   *
   * @ngdoc module
   * @name Lodash
   */
  angular
    .module('Lodash', [])
    .factory('_', Lodash);

  /**
    * Expose Lo-Dash through injectable factory, so we don't pollute / rely on global namespace
    * just inject lodash as Lodash.
    *
    * @ngdoc factory
    * @name _
    * @memberof Lodash
    */
  function Lodash($window) {
      return $window._;
  }

})();
