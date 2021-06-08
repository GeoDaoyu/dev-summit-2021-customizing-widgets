import React, { useState, useEffect, useCallback } from "react";
import useCenter from './useCenter';
import "./index.css";

const CenterWidget = ({ view }) => {
  const { longitude, latitude, scale, go } = useCenter(view);
  const onClick = () => {
    go();
  };
  const onViewClick = useCallback((e) => {
    const { mapPoint } = e;
    const { longitude, latitude } = mapPoint;
    console.log(longitude, latitude);
  }, []);
  useEffect(() => {
    if (!view) {
      return;
    }
    const handle = view.on("click", onViewClick);
    return function removeHandle() {
      handle.remove();
    };
  }, [view, onViewClick]);

  return (
    <div id="centerWidget" onClick={onClick}>
      <p>longitude: {Number(longitude).toFixed(3)}</p>
      <p>latitude: {Number(latitude).toFixed(3)}</p>
      <p>scale: {Number(scale).toFixed(0)}</p>
    </div>
  );
};
export default CenterWidget;
