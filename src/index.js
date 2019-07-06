import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "./reducers.js";
import { HashRouter as Router, Route } from "react-router-dom";
import { ThemeProvider } from "react-jss";

import SearchPage from "./SearchPage.js";
import ResultPage from "./ResultPage.js";

import "./styles.css";

const middlewares = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(...middlewares))
);

const theme = {
  primaryColor: "teal",
  spacing: 8
};
const App = () => (
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Router>
        <Route exact path="/" component={props => <SearchPage {...props} />} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/result" component={ResultPage} />
      </Router>
    </Provider>
  </ThemeProvider>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
