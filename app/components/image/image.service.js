(function () {

  angular
    .module('fmsc')
    .service('ImageService', ImageService);

  function ImageService($q, $firebaseObject, FirebaseRef) {
    const service = {
      imageId: null,
      filename: null,
      sold: null,

      eventsCallback: {

      },

      getCurrentImageId,
      getFilename,

      getSold,
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
          const url = `${FirebaseRef.url}/images/${imageId}/filename`;
          return $firebaseObject(new Firebase(url)).$loaded();
        })
        .then((obj) => {
          service.filename = obj.$value;

          return service.filename;
        });
    }

    function getSold() {
      if (service.sold) {
        return Promise.resolve(service.sold);
      } else if (service.loadingSold) {
        return service.loadingSold;
      }

      service.loadingSold = _initResource('pieces_sold').then((ref) => {
        return ref.$loaded().then(() => {
          service.sold = ref;
          service.sold.$watch(event => _eventHandler('sold', event));
          service.loadingSold = null;
          return service.sold;
        });
      });

      return service.loadingSold;
    }

    function _initResource(resource) {
      return $q.when(getCurrentImageId().then((imageId) => {
        const url = `${FirebaseRef.url}/images/${imageId}/${resource}`;
        const ref = $firebaseObject(new Firebase(url));

        return ref;
      }));
    }

    function _eventHandler(resource, event) {
      for (const key of Object.keys(service.eventsCallback)) {
        const eventCallback = service.eventsCallback[key];

        if (eventCallback.resource === resource) {
          eventCallback.fn(event);
        }
      }
    }

    function destroySold() {
      service.sodl.$destroy();
      service.sodl = null;
    }

  }

})();
