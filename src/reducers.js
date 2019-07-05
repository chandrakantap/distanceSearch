import { STATUS } from "./commonUtil.js";

export const ACTION_TYPES = {
  SET_STATUS: "set_app_status",
  SET_PLACE_DISTANCE: "set_place_distance",
  UPDATE_PLACES_CACHE: "update_places_cache"
};
const initialState = {
  places: {},
  placeDistances: {},
  appStatus: STATUS.INITIAL
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_PLACES_CACHE: {
      const { placeId, description, location } = action.data;
      return {
        ...state,
        places: {
          ...state.places,
          [placeId]: { placeId, description, location }
        }
      };
    }
    case ACTION_TYPES.SET_STATUS: {
      const { status } = action.data;
      return {
        ...state,
        appStatus: status
      };
    }
    case ACTION_TYPES.SET_PLACE_DISTANCE: {
      const { key, distance, duration } = action.data;
      return {
        ...state,
        placeDistances: {
          ...state.placeDistances,
          [key]: { distance, duration }
        }
      };
    }
    default:
      return state;
  }
};
