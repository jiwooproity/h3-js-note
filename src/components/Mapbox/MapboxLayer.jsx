import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import data from "../../data/mapbox-example.json";

const Pin = ({ data, handlePopup }) => {
  return (
    <Marker
      key={`markers-${data.title}`}
      longitude={data.longitude}
      latitude={data.latitude}
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        handlePopup(data);
      }}
    >
      <button className="btn-marker" />
    </Marker>
  );
};

const MapboxLayer = () => {
  const [markers, setMarkers] = useState([...data]);

  const [popupInfo, setPopupInfo] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const handlePopup = (data) => {
    setShowPopup(true);
    setPopupInfo({ ...data });
  };

  return (
    <div className="map-container">
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 126.9176768,
          latitude: 37.5515208,
          zoom: 14,
          pitch: 0,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {markers.map((marker) => (
          <Pin data={marker} handlePopup={handlePopup} />
        ))}

        {showPopup ? (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setShowPopup(false)}
          >
            <div>{popupInfo.title}</div>
            <img width="100%" src={popupInfo.image} alt="" />
          </Popup>
        ) : null}
      </Map>
    </div>
  );
};

export default MapboxLayer;
