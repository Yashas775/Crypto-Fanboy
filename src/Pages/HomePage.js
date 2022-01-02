import React, { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Banner from "../components/Banner/Banner";
import ErrorFallback from "../components/ErrorBoundary";
import { Button, Tab, Tabs, AppBar, Box } from "@material-ui/core";
const CoinsTable = React.lazy(() => import("../components/CoinsTable"));
const FavCoinsTable = React.lazy(() => import("../components/fav_page"));

const Homepage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <AppBar
          position="static"
          style={{
            backgroundColor: "transparent",
            color: "white",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            style={{ borderRadius: 10, boxShadow: "none" }}
          >
            <Tab label="Home" />
            <Tab label="Favorite" />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <Suspense fallback={<div>Loading...</div>}>
            <CoinsTable />
          </Suspense>
        )}
        {value === 1 && <FavCoinsTable />}
      </ErrorBoundary>
    </div>
  );
};

export default Homepage;
