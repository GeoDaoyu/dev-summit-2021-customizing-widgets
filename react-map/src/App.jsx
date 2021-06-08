import React, { useEffect, useRef, useState } from "react";
import Home from "@arcgis/core/widgets/Home";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import HomeWidget from "./components/HomeWidget";
import CenterWidget from "./components/CenterWidget";
import "./App.css";

function App() {
  const elRef = useRef();
  const [view, setView] = useState();
  useEffect(() => {
    const map = new Map({
      basemap: "streets",
    });

    const mapView = new MapView({
      map,
      container: elRef.current,
      zoom: 7,
      center: [120, 30],
      ui: { components: [] },
    });
    mapView.when(() => {
      const home = new Home({
        view: mapView,
      });

      mapView.ui.add(home, "top-left");
      setView(mapView);
    });

    return () => {
      mapView && mapView.destroy();
    };
  }, []);
  return (
    <div id="viewDiv" ref={elRef}>
      <div>
        <HomeWidget view={view}></HomeWidget>
        <CenterWidget view={view}></CenterWidget>
      </div>
    </div>
  );
}

export default App;
