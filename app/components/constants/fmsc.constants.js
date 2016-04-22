(function () {
  let DEBUG_MODE = true; // eslint-disable-line

  // gulp-inject-debug-mode

  let FIREBASE_URL = 'https://fmsc-donation1.firebaseio.com/';

  if (DEBUG_MODE) {
    FIREBASE_URL = 'https://fmsc-donation-debug.firebaseio.com/';
  }

  angular
    .module('fmsc')
    .constant('FMSCDebug', DEBUG_MODE)
    .constant('FirebaseURL', FIREBASE_URL);

})();
