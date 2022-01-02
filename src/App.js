import React, { Suspense, lazy } from "react";
import { makeStyles } from "@material-ui/core";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Header from "./components/Header";
import Alert from "./components/Alert";

const Homepage = lazy(() => import("./Pages/HomePage"));

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Route path="/" component={Homepage} exact />
        </Suspense>
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;
