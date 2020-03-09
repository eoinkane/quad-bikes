import React from "react";
import { Route, Switch } from "react-router-dom";

import AgeMain from "./components/AgeMain/AgeMain.jsx";
import EditPricesComponent from "./components/edit/prices/index.jsx";

import "./App.css";
import AppBar from "./components/AppBar";

const AppChild = () => {
  return (
    <Switch>
      <Route
        path={"/calc"}
        render={props => (
          <Route path={`${props.match.url}/price`} exact component={AgeMain} />
        )}
      />
      <Route
        path={"/edit"}
        render={props => (
          <Route
            path={`${props.match.url}/prices`}
            exact
            component={EditPricesComponent}
          />
        )}
      />
      <Route path={"/"} exact render={props => <p>Home</p>} />
      <Route render={() => <p>empty</p>} />
    </Switch>
  );
};

const App = () => {
  return (
    <Route
      render={props => (
        <div className="App">
          <AppBar {...props}>
            <AppChild />
          </AppBar>
        </div>
      )}
    />
  );
};

export default App;
