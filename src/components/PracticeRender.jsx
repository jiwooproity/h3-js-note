import L from "leaflet";
import { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvent,
  Popup,
  useMap,
  Polyline,
  Polygon,
} from "react-leaflet";

import icon from "../assets/constants";
import { data } from "../data/data";
import { heatmapData } from "../data/heatmapData";
import { loadData } from "../data/loadData";
import HeatmapLayer from "./HeatmapLayer";

const h3 = require("h3-js");
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapStyle = {
  width: "100%",
  height: "100%",
};

const LineToMarkers = ({ markers }) => {
  return <Polyline positions={[...markers]} />;
};

const LocationMarker = ({ position, center }) => {
  return (
    <>
      <Marker position={position}>
        <Popup>당신의 위치는 여기입니다.</Popup>
      </Marker>
      <Polyline
        positions={[{ ...position }, { lat: center[0], lng: center[1] }]}
      />
    </>
  );
};

const LocationMarkerButton = ({ center }) => {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const [onMarker, setOnMarker] = useState(false);
  const [markers, setMarkers] = useState([]);

  // const onMoveLocation = useMapEvent({
  //   click() {
  //     onMoveLocation.locate();
  //   },
  //   locationfound(e) {
  //     setPosition(e.latlng);
  //     onMoveLocation.flyTo(e.latlng, onMoveLocation.getZoom());
  //   },
  // });

  const createMarking = useMapEvent({
    click: (e) => {
      if (onMarker) {
        const { lat, lng } = e.latlng;
        L.marker([lat, lng], { icon }).addTo(createMarking);
        setMarkers([...markers, e.latlng]);
      }
    },
  });

  const onClick = (key) => {
    switch (key) {
      case "reset":
        setPosition(null);
        map.flyTo(center, map.getMaxZoom());
        break;
      case "locate":
        map.locate().on("locationfound", (e) => {
          setPosition(e.latlng);
          map.flyTo(e.latlng, map.getMaxZoom());
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <LineToMarkers markers={markers} />
      <div className="map-controller-wrapper">
        <button
          className="map-controller-btn"
          onClick={() => onClick("locate")}
        >
          내 위치로
        </button>
        <button className="map-controller-btn" onClick={() => onClick("reset")}>
          돌아가기
        </button>
        <button
          className={`map-controller-btn ${onMarker ? "active" : ""}`}
          onClick={() => setOnMarker(!onMarker)}
        >
          마커
        </button>
      </div>
      {position && (
        <LocationMarker position={position} center={center} markers={markers} />
      )}
    </>
  );
};

const MiniMapContainer = ({ position, zoom }) => {
  const parentMap = useMap();
  const mapZoom = zoom || 0;
  const miniStyle = { width: "80px", height: "80px" };

  const minimap = useMemo(
    () => (
      <MapContainer
        style={miniStyle}
        center={parentMap.getCenter()}
        maxZoom={mapZoom}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    ),
    []
  );

  const POSITION_CLASSES = {
    bottomleft: "leaflet-bottom leaflet-left",
    bottomright: "leaflet-bottom leaflet-right",
    topleft: "leaflet-top leaflet-left",
    topright: "leaflet-top leaflet-right",
  };

  const positionClass = position
    ? POSITION_CLASSES[position]
    : POSITION_CLASSES.topright;

  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{minimap}</div>
    </div>
  );
};

const PracticeRender = () => {
  const DejayPosition = [37.5515653, 126.9176736];
  const [latLngs, setLatLngs] = useState([...data]);

  const convertBoundary = (cell) => {
    return h3.cellToBoundary(cell);
  };

  const getCells = latLngs.map((latLng) => {
    return h3.latLngToCell(latLng[0], latLng[1], 11);
  });

  const getBoundary = getCells.map(convertBoundary);
  // console.log("CellToBoundary", getBoundary);

  const getGridDisk = getCells.map((cell) => {
    return h3.gridDisk(cell, 1);
  });

  const getGridBoundary = getGridDisk.map((grids) => {
    return grids.map(convertBoundary);
  });

  const cfg = {
    radius: 0.1,
    maxOpacity: 0.8,
    scaleRadius: true,
    useLocalExtrema: true,
    latField: "lat",
    lngField: "lng",
    valueField: "count",
  };

  return (
    <div className="map-container">
      <MapContainer style={MapStyle} zoom={4} center={DejayPosition}>
        <TileLayer
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={15}
          minZoom={4}
        />
        <MiniMapContainer position="topright" />
        <Marker position={DejayPosition}>
          <Tooltip content="Dejay" direction="auto" />
        </Marker>
        <LocationMarkerButton center={DejayPosition} />
        {getGridBoundary.map((boundary) => (
          <Polygon positions={boundary} />
        ))}
        <Polyline positions={loadData} />
        <HeatmapLayer config={cfg} data={heatmapData} />
      </MapContainer>
    </div>
  );
};

export default PracticeRender;
