(function () {

  angular
    .module('fmsc')
    .service('InvoicesService', InvoicesService);

  function InvoicesService($q, AuthService, FirebaseRef, $firebaseObject, $firebaseArray) {
    const service = {
      create,
      get,
      getAllFromUser
    };

    return service;

    function create({ state, name, quantity }) {
      const _invoice = {
        state,
        name,
        quantity,
        status: 'waiting',
        user: AuthService.user.uid,
        created: Date.now()
      };

      return $q(resolve => {
        FirebaseRef.invoices.push(_invoice).then(resolve);
      });
    }

    function get(invoiceId) {
      return $firebaseObject(FirebaseRef.invoices.child(invoiceId));
    }

    function getAllFromUser(userId) {
      if (!userId) {
        userId = AuthService.user.uid;
      }

      console.log(AuthService.user);

      return $firebaseArray(FirebaseRef.invoices.orderByChild('user').equalTo(userId));
    }

  }
})();
