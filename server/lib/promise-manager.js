class PromiseHandler {
  constructor({ resource, quantity, fn, max = 50 }) {
    this.resource = resource;
    this.max = max;
    this.fn = fn;
    this.result = [];

    if (this.resource) {
      this.quantity = this.resource.length;
    } else {
      this.quantity = quantity;
    }
  }

  start() {
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

    return Promise.all(promises)
      .then((results) => {
        this.quantity -= turn;
        this.result = this.result.concat(results);

        if (this.quantity > 0) {
          return this._recursive();
        }

        return this.result;
      });
  }
}

module.exports = PromiseHandler;
