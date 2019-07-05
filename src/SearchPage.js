import React, { useState, useEffect } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import WithURLParams from "./WithURLParams";
import PlacePredictionInput from "./PlacePredictionInput.js";
import { getPlaceDetail } from "./actions.js";
import { get } from "lodash";
import { STATUS } from "./commonUtil.js";

const SearchPage = props => {
  const {
    startPlace,
    endPlace,
    date,
    nop,
    placeDetails,
    status,
    dispatch
  } = props;
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const nextFormData = {};
    if (!!startPlace) {
      if (!placeDetails[startPlace]) {
        dispatch(getPlaceDetail(startPlace));
      } else {
        nextFormData.startPlace = placeDetails[startPlace];
      }
    }
    if (!!endPlace) {
      if (!placeDetails[endPlace]) {
        dispatch(getPlaceDetail(endPlace));
      } else {
        nextFormData.endPlace = placeDetails[endPlace];
      }
    }
    nextFormData.date = date;
    nextFormData.nop = nop;
    setFormData(nextFormData);
  }, [startPlace, endPlace, date, nop, placeDetails, dispatch]);

  const onChangeFormElem = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSerializedFormData = () => {
    return `startPlace=${formData.startPlace.placeId}&endPlace=${
      formData.endPlace.placeId
    }&date=${formData.date}&nop=${formData.nop}`;
  };
  const submitForm = e => {
    const validForm = formData.startPlace && formData.endPlace;
    if (!validForm) {
      return;
    }
    props.history.push("/result?" + getSerializedFormData());
  };

  if (status === STATUS.LOADING_PLACE_DETAIL) {
    return <div>Loading Place details, please wait...</div>;
  }

  return (
    <div>
      Start Place:
      <PlacePredictionInput
        name="startPlace"
        onChange={onChangeFormElem}
        value={formData.startPlace}
      />
      End Place:
      <PlacePredictionInput
        name="endPlace"
        onChange={onChangeFormElem}
        value={formData.endPlace}
      />
      Date:
      <input
        type="text"
        name="date"
        onChange={onChangeFormElem}
        value={formData.date || ""}
      />
      Number of passengers:
      <input
        type="text"
        name="nop"
        onChange={onChangeFormElem}
        value={formData.nop || ""}
      />
      <button onClick={submitForm}>Calculate Distance</button>
    </div>
  );
};
const mapStateToProps = state => ({
  status: get(state, "appStatus"),
  placeDetails: get(state, `places`, {})
});
export default compose(
  WithURLParams,
  connect(mapStateToProps)
)(SearchPage);
