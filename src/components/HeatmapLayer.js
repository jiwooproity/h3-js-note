import { useEffect, useRef } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import HeatmapOverlay from "leaflet-heatmap";

const HeatmapLayer = ({ config, data }) => {
  const context = useLeafletContext();
  const heatMapOverlayRef = useRef();

  useEffect(() => {
    heatMapOverlayRef.current = new HeatmapOverlay(config);

    const container = context.layerContainer || context.map;
    container.addLayer(heatMapOverlayRef.current);
    heatMapOverlayRef.current.setData(data);

    return () => {
      container.removeLayer(heatMapOverlayRef.current);
    };
  }, [context.layerContainer, context.map, config, data]);

  return null;
};

export default HeatmapLayer;