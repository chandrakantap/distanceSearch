import React, { useEffect } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import WithURLParams from "./WithURLParams";
import { get } from "lodash";
import { STATUS, getKey } from "./commonUtil.js";
import { getPlaceDetail, getDistance } from "./actions.js";

const ResultPage = props => {
  const {
    status,
    startPlace,
    endPlace,
    placeDetails,
    placeDistances,
    dispatch,
    history
  } = props;

  const key = getKey(startPlace, endPlace);

  useEffect(() => {
    const startPlaceDetail = placeDetails[startPlace];
    const endPlaceDetail = placeDetails[endPlace];
    if (!startPlaceDetail) {
      dispatch(getPlaceDetail(startPlace));
    }
    if (!endPlaceDetail) {
      dispatch(getPlaceDetail(endPlace));
    }
    const distanceDetail = placeDistances[key];
    if (!distanceDetail && startPlaceDetail && endPlaceDetail) {
      dispatch(getDistance(startPlaceDetail, endPlaceDetail));
    }
  }, [startPlace, endPlace, placeDetails, placeDistances, key, dispatch]);

  if (status === STATUS.LOADING_PLACE_DETAIL) {
    return <div>Loading Place details, please wait...</div>;
  }

  const goBack = () => history.goBack();

  const startPlaceDetail = placeDetails[startPlace] || {};
  const endPlaceDetail = placeDetails[endPlace] || {};
  const distanceDetail = placeDistances[key] || {};
  return (
    <div>
      <h4>{startPlaceDetail.description}</h4>
      <h4>To</h4>
      <h4>{endPlaceDetail.description}</h4>
      {status === STATUS.LOADING_PLACE_DISTANCE && (
        <h4>Calculating Distance, please wait..</h4>
      )}
      <h4>Distance: {distanceDetail.distance}</h4>
      <h4>Duration: {distanceDetail.duration}</h4>
      <h4>Travel Mode: DRIVING</h4>
      <br />
      <br />
      <button onClick={goBack}>Back</button>
    </div>
  );
};
const mapStateToProps = state => ({
  status: get(state, "appStatus"),
  placeDetails: get(state, `places`, {}),
  placeDistances: get(state, `placeDistances`, {})
});
export default compose(
  WithURLParams,
  connect(mapStateToProps)
)(ResultPage);
