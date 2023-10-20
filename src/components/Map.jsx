// import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
const h3 = require("h3-js");

// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

const Map = () => {
  return (
    <div id="map" className="map-container">
      <MapContainer
        center={[40.7579747, -73.9877313]}
        style={{ height: "100%" }}
        zoom={15}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={15}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
