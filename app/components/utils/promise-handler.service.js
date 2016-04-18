(function () {

  class PromiseHandler {
    constructor($q) {
      this.$q = $q;
    }

    start({ resource, quantity, notify, fn, max = 25 }) {
      this.resource = resource;
      this.notify = notify;
      this.max = max;
      this.fn = fn;
      this.result = [];

      if (this.resource) {
        this.quantity = this.resource.length;
      } else {
        this.quantity = quantity;
      }

      return this._recursive();
    }

    _recursive() {
      const promises = [];
      const turn = Math.min(this.quantity, this.max);

      for (let i = 0; i < turn; i++) {
        let params = null;

        if (this.resource) {
          params = this.resource.shift();
        }

        promises.push(this.fn(params));
      }

      return this.$q.all(promises)
        .then((results) => {
          this.quantity -= turn;
          this.result = this.result.concat(results);

          if (this.notify) {
            this.notify(this.quantity);
          }

          if (this.quantity > 0) {
            return this._recursive();
          }

          return this.result;
        });
    }
  }

  angular
    .module('fmsc')
    .factory('PromiseHandler', PromiseHandlerFactory);

  function PromiseHandlerFactory($q) {
    return {
      create: () => {
        return new PromiseHandler($q);
      }
    }
  }

})();
