import React, { useState, useEffect } from "react";
import injectSheet from "react-jss";
import { getPredictions } from "./commonUtil.js";

export const PlacePredictionInput = props => {
  const { name, value = {}, classes, onChange } = props;
  const [internalValue, setInternalValue] = useState(value.description || "");
  const [selectedPrediction, setSelectedPrediction] = useState(value);
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [timeoutFunction, setTimeoutFunction] = useState(false);

  useEffect(() => {
    // if a different value passed via props then update internal state
    if (value.placeId !== selectedPrediction.placeId) {
      setInternalValue(value.description || "");
      setSelectedPrediction(value);
    }
  }, [value, selectedPrediction]);

  const onChangeSearchKey = e => {
    if (timeoutFunction) {
      clearTimeout(timeoutFunction);
    }
    // place search api will be called after user finish typing
    setTimeoutFunction(
      setTimeout(() => {
        fetchPredictions();
      }, 1000)
    );
    setInternalValue(e.target.value);
  };
  const onFocus = e => {
    setInternalValue("");
    setShowPredictions(true);
  };
  const onClickOutSide = () => {
    setShowPredictions(false);
    setInternalValue(selectedPrediction.description || "");
  };

  const fetchPredictions = () => {
    getPredictions(internalValue).then(predictions => {
      setPredictions(predictions);
      setShowPredictions(true);
    });
  };

  const selectPrediction = prediction => () => {
    setShowPredictions(false);
    setPredictions([]);
    setSelectedPrediction(prediction);
    setInternalValue(prediction.description || "");
    if (onChange) {
      onChange({
        target: {
          name,
          value: prediction
        }
      });
    }
  };

  const predictionCount = predictions.length;

  return (
    <div className={classes.ppiContainer}>
      <input
        className={classes.ppiInput}
        autoComplete="off"
        type="text"
        name={name}
        value={internalValue}
        onChange={onChangeSearchKey}
        onFocus={onFocus}
      />
      {showPredictions && (
        <div className={classes.backdrop} onClick={onClickOutSide} />
      )}
      {showPredictions && predictionCount > 0 && (
        <ul className={classes.predictionPanel}>
          {predictions.map(p => (
            <li
              key={`${name}_${p.placeId}`}
              onClick={selectPrediction(p)}
              className={classes.pItem}
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = theme => ({
  ppiContainer: {
    position: "relative"
  },
  ppiInput: {
    height: `${theme.spacing * 3}px`,
    padding: `${theme.spacing}px`,
    fontSize: "18px",
    width: "100%",
    position: "relative",
    zIndex: 101,
    color: theme.primaryColor
  },
  predictionPanel: {
    position: "absolute",
    listStyleType: "none",
    background: "white",
    width: "100%",
    top: `${theme.spacing * 6}px`,
    borderTop: "1px solid grey",
    borderLeft: "1px solid grey",
    borderRight: "1px solid grey",
    zIndex: 103
  },
  pItem: {
    padding: "8px",
    borderBottom: "1px solid grey",
    cursor: "pointer"
  },
  backdrop: {
    position: "fixed",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    zIndex: 100
  }
});
export default injectSheet(styles)(PlacePredictionInput);
