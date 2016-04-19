(function () {

  angular
    .module('fmsc')
    .service('ImageService', ImageService);

  function ImageService($firebaseArray, $firebaseObject, FirebaseRef) {
    const service = {
      imageId: null,
      filename: null,
      available: null,
      reserved: null,
      sold: null,

      eventsCallback: {

      },

      getCurrentImageId,
      getFilename,
      getReserved,
      getAvaiable,
      getSold,

      destroyAvaiable,
      destroyReserved,
      destroySold,

      register,
      unregister
    };

    return service;

    ///////////////////

    function register({ id, resource, fn }) {
      service.eventsCallback[id] = {
        resource,
        fn
      };
    }

    function unregister({ id }) {
      delete service.eventsCallback[id];
    }

    function getCurrentImageId() {
      if (service.imageId) {
        return Promise.resolve(service.imageId);
      }

      return FirebaseRef.current_image.$loaded().then(obj => {
        service.imageId = obj.$value;
        return service.imageId;
      });
    }

    function getFilename() {
      if (service.filename) {
        return Promise.resolve(service.filename);
      }

      return getCurrentImageId()
        .then((imageId) => {
          const url = `${FirebaseRef.url}/images/${imageId}/url`;
          return $firebaseObject(new Firebase(url)).$loaded();
        })
        .then((obj) => {
          service.filename = obj.$value;

          return service.filename;
        });
    }

    function getAvaiable() {
      if (service.avaiable) {
        return Promise.resolve(service.avaiable);
      }

      return _initResource('pieces_available').then(avaiable => {
        service.avaiable = avaiable;

        service.avaiable.$watch(event => _eventHandler('avaiable', event));

        return service.avaiable;
      });
    }

    function getSold() {
      if (service.sold) {
        return Promise.resolve(service.sold);
      }

      return _initResource('pieces_sold').then(sold => {
        service.sold = sold;

        service.sold.$watch(event => _eventHandler('sold', event));

        return service.sold;
      });
    }

    function getReserved() {
      if (service.reserved) {
        return Promise.resolve(service.reserved);
      }

      return _initResource('pieces_reserved').then(reserved => {
        service.reserved = reserved;

        service.reserved.$watch(event => _eventHandler('reserved', event));

        return service.reserved;
      });
    }

    function _initResource(resource) {
      return getCurrentImageId().then((imageId) => {
        const url = `${FirebaseRef.url}/images/${imageId}/${resource}`;
        return $firebaseArray(new Firebase(url)).$loaded();
      });
    }

    function _eventHandler(resource, event) {
      for (const key of Object.keys(service.eventsCallback)) {
        const eventCallback = service.eventsCallback[key];

        if (eventCallback.resource === resource) {
          eventCallback.fn(event);
        }
      }
    }

    function destroyAvaiable() {
      _destroy('avaiable');
    }

    function destroySold() {
      _destroy('sold');
    }

    function destroyReserved() {
      _destroy('reserved');
    }

    function _destroy(resource) {
      if (service[resource]) {
        service[resource].$destroy();
        service[resource] = null;
      }
    }
  }

})();
