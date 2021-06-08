import React, { useEffect, useRef } from "react";
import HomeViewModel from "@arcgis/core/widgets/Home/HomeViewModel";
import "./index.css";

const HomeWidget = ({ view }) => {
  const homeViewModelRef = useRef();
  // 初始化
  useEffect(() => {
    const homeViewModel = new HomeViewModel({
      view,
    });
    homeViewModelRef.current = homeViewModel;
    return () => {
      homeViewModel && homeViewModel.destroy();
    }
  }, [view]);
  const onClick = () => {
    if (view.zoom >= 7) {
      homeViewModelRef.current.go();
    }
  };
  return (
    <div
      id="homeWidget"
      className="esri-component esri-home esri-widget--button esri-widget"
      role="button"
      tabIndex="0"
      aria-label="默认地图视图"
      title="默认地图视图"
      onClick={onClick}
    >
      <span>Home</span>
    </div>
  );
};
export default HomeWidget;
