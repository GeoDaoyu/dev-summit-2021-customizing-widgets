import { useState, useEffect, useCallback } from "react";

const useCenter = (view) => {
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [scale, setScale] = useState(0);
  const [initialCenter, setInitialCenter] = useState([0, 0]);
  const onViewChange = useCallback(() => {
    const { scale, center } = view;
    const { latitude, longitude } = center;
    setLatitude(latitude);
    setLongitude(longitude);
    setScale(scale);
  }, [view]);
  useEffect(() => {
    if (!view) {
      return;
    }
    onViewChange();
    const handle = view.watch("center, scale", onViewChange);
    return function removeHandle() {
      handle.remove();
    };
  }, [view, onViewChange]);
  const go = useCallback(() => {
    view.goTo(initialCenter);
  }, [view, initialCenter]);
  useEffect(() => {
    if (!view) {
      return;
    }
    const { center } = view;
    setInitialCenter(center);
  }, [view]);

  return { longitude, latitude, scale, go };
};

export default useCenter;
