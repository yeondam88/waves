import React from "react";
import { Switch, Route } from "react-router-dom";

import Layout from "./hoc/Layout";
import Home from "./components/Home";
import Register from "./components/Register";

const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </Layout>
  );
};

export default Routes;
