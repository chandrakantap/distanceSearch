import React from "react";
import { shallow } from "enzyme";
import { PlacePredictionInput } from "./PlacePredictionInput.js";

it("renders without crashing", () => {
  const props = {
    name: "startPoint",
    classes: {}
  };
  const wrapper = shallow(<PlacePredictionInput {...props} />);
  expect(wrapper).toMatchSnapshot();
});
