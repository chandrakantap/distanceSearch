export const STATUS = {
  INITIAL: "initial",
  LOADING_PLACE_DETAIL: "loading_place_detail",
  PLACE_DETAIL_LOADED: "places_details_loaded",
  CALCULATING_DISTANCE: "place_distance_loaded",
  DISTANCE_CALCULATION_DONE: "distance_cal_done"
};

const autoCompleteService = new window.google.maps.places.AutocompleteService();
export const getKey = (startPlaceId, endPlaceId) =>
  `${startPlaceId}_${endPlaceId}`;

export const getPredictions = searchQuery =>
  new Promise(resolve => {
    autoCompleteService.getQueryPredictions(
      { input: searchQuery },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(
            predictions
              .map(p => ({
                placeId: p.place_id,
                description: p.description
              }))
              .filter(p => !!p.placeId)
          );
        } else {
          resolve([]);
        }
      }
    );
  });

const placeDetailsService = new window.google.maps.places.PlacesService(
  document.createElement("div")
);
export const getPlaceDetail = placeId =>
  new Promise(resolve => {
    placeDetailsService.getDetails(
      {
        placeId,
        fields: ["name", "vicinity", "geometry"]
      },
      placeDetail => resolve(placeDetail)
    );
  });

const distanceService = new window.google.maps.DistanceMatrixService();

export const getDistance = (startPlace, endPlace) =>
  new Promise(resolve => {
    const req = {
      origins: [{ ...startPlace.location }],
      destinations: [{ ...endPlace.location }],
      travelMode: "DRIVING"
    };
    distanceService.getDistanceMatrix(req, result => {
      resolve(result.rows[0].elements[0]);
    });
  });
