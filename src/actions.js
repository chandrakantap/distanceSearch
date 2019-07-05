import {
  getDistance as getDistanceService,
  getPlaceDetail as getPlaceDetailService,
  STATUS,
  getKey
} from "./commonUtil";
import { ACTION_TYPES } from "./reducers.js";

export const updatePlaceCache = ({ placeId, description, location }) => ({
  type: ACTION_TYPES.UPDATE_PLACES_CACHE,
  data: { placeId, description, location }
});

export const getPlaceDetail = placeId => dispatch => {
  dispatch({
    type: ACTION_TYPES.SET_STATUS,
    data: { status: STATUS.LOADING_PLACE_DETAIL }
  });
  getPlaceDetailService(placeId)
    .then(result => {
      dispatch(
        updatePlaceCache({
          placeId,
          description: `${result.name} ${result.vicinity}`,
          location: {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          }
        })
      );
      dispatch({
        type: ACTION_TYPES.SET_STATUS,
        data: { status: STATUS.PLACE_DETAIL_LOADED }
      });
    })
    .catch(e => {
      console.log(e);
      dispatch({
        type: ACTION_TYPES.SET_STATUS,
        data: { status: STATUS.PLACE_DETAIL_LOADED }
      });
    });
};

export const getDistance = (startPlace, endPlace) => dispatch => {
  dispatch({
    type: ACTION_TYPES.SET_STATUS,
    data: { status: STATUS.CALCULATING_DISTANCE }
  });
  getDistanceService(startPlace, endPlace)
    .then(result => {
      const key = getKey(startPlace.placeId, endPlace.placeId);
      dispatch({
        type: ACTION_TYPES.SET_PLACE_DISTANCE,
        data: {
          key,
          distance: result.distance.text,
          duration: result.duration.text
        }
      });
      dispatch({
        type: ACTION_TYPES.SET_STATUS,
        data: { status: STATUS.DISTANCE_CALCULATION_DONE }
      });
    })
    .catch(e => {
      console.log(e);
      dispatch({
        type: ACTION_TYPES.SET_STATUS,
        data: { status: STATUS.DISTANCE_CALCULATION_DONE }
      });
    });
};
