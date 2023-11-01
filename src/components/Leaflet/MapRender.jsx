import { useRef, useState } from "react";
import {
  MapContainer,
  Polygon,
  Marker,
  Circle,
  TileLayer,
  Tooltip,
  CircleMarker,
  Polyline,
  AttributionControl,
} from "react-leaflet";
import L from "leaflet";

import { data } from "../../data/data";

const h3 = require("h3-js");

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const baseStyle = {
  weight: 0.5,
  opacity: 1,
  color: "black", //Outline color
  fillOpacity: 0.5,
};

const HIGH_COLOR = "40F99B";
const LOW_COLOR = "ff5733";

const MapRender = () => {
  let hexagonMap = new Map();
  const RESOLUTION = 11;
  const K_RING = 0;
  const [mapJson, setMapJson] = useState([...data]);

  const getColor = (ratio, low = LOW_COLOR, high = HIGH_COLOR) => {
    const hex = (x) => {
      const xString = x.toString(16);
      return xString.length === 1 ? "0" + xString : xString;
    };

    const r = Math.ceil(
      parseInt(high.substring(0, 2), 16) * ratio +
        parseInt(low.substring(0, 2), 16) * (1 - ratio)
    );
    const g = Math.ceil(
      parseInt(high.substring(2, 4), 16) * ratio +
        parseInt(low.substring(2, 4), 16) * (1 - ratio)
    );
    const b = Math.ceil(
      parseInt(high.substring(4, 6), 16) * ratio +
        parseInt(low.substring(4, 6), 16) * (1 - ratio)
    );

    return `#${hex(r)}${hex(g)}${hex(b)}`;
  };

  const getWeight = (count, min, max) => {
    if (count > 0) {
      let op = Math.round((10 * (count - min)) / (max - min)) / 10;
      return op > 0.1 ? op : 0.1;
    } else return 0.1;
  };

  const groupPolygonsByOpacity = (polygons) => {
    const retMap = {};
    polygons.forEach(([pol, weight]) => {
      if (retMap[weight.toString()]) {
        retMap[weight.toString()] = [...retMap[weight.toString()], pol];
      } else {
        retMap[weight.toString()] = [pol];
      }
    });
    return retMap;
  };

  [...mapJson].forEach((json) => {
    const H3_INDEX = h3.latLngToCell(json[0], json[1], 11);
    const HEX_COUNT = hexagonMap.get(H3_INDEX);

    if (HEX_COUNT) {
      hexagonMap.set(H3_INDEX, HEX_COUNT + 1);
    } else {
      hexagonMap.set(H3_INDEX, 1);
    }
  });

  Array.from(hexagonMap.keys()).forEach((key) => {
    const kring = h3.gridDisk(key, K_RING);
    kring.forEach((hex) => {
      if (!hexagonMap.has(hex)) {
        hexagonMap.set(hex, 0);
      }
    });
  });

  const [counts, keys] = [
    Array.from(hexagonMap.values()),
    Array.from(hexagonMap.keys()),
  ];

  let max = Math.max(...counts);
  let min = Math.min(...counts);

  let hexagons = keys.map((key, i) => {
    let polygon = h3.cellToBoundary(key, false);
    return [polygon, getWeight(counts[i], min, max)];
  });

  const groups = groupPolygonsByOpacity(hexagons);

  return (
    <div id="map" className="map-container">
      <MapContainer
        center={[40.7579747, -73.9877313]}
        style={{ width: "50%", height: "100%" }}
        zoom={15}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={15}
        />
        {Object.entries(groups).map(([weight, polygons]) => {
          const color = getColor(weight);
          return (
            <>
              <Polygon
                key={weight}
                positions={polygons}
                pathOptions={{
                  ...baseStyle,
                  fillColor: color,
                  color: color, // stroke color
                  weight: 0, // stroke weight
                }}
              />
            </>
          );
        })}
        <Polyline
          smoothFactor={1}
          positions={data.map((item) => ({
            lat: item[0],
            lng: item[1],
          }))}
          stroke={true}
          weight={3}
          dashArray={[4]}
          dashOffset=""
        />
        <Circle center={[40.7579747, -73.9777313]} radius={50} />
        <Marker position={[40.7579747, -73.9777313]}>
          <Tooltip
            opacity={1}
            direction="auto"
            position={[40.7579747, -73.9777313]}
            content={"This is difficult...."}
          />
        </Marker>
        <CircleMarker
          center={[40.7579747, -73.9677313]}
          color="black"
          radius={30}
        >
          <Tooltip
            opacity={1}
            direction="auto"
            position={[40.7579747, -73.9677313]}
            content={"This is difficult...."}
          />
        </CircleMarker>
      </MapContainer>

      <MapContainer
        center={[40.7579747, -73.9877313]}
        style={{ width: "50%", height: "100%" }}
        zoom={15}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={15}
        />
        {Object.entries(groups).map(([weight, polygons]) => {
          const color = getColor(weight);
          return (
            <>
              <Polygon
                key={weight}
                positions={polygons}
                pathOptions={{
                  ...baseStyle,
                  fillColor: color,
                  color: color, // stroke color
                  weight: 0, // stroke weight
                }}
              />
            </>
          );
        })}
        <Polyline
          smoothFactor={1}
          positions={data.map((item) => ({
            lat: item[0],
            lng: item[1],
          }))}
          stroke={true}
          weight={3}
          dashArray={[4]}
          dashOffset=""
        />
        <Circle center={[40.7579747, -73.9777313]} radius={50} />
        <Marker position={[40.7579747, -73.9777313]}>
          <Tooltip
            opacity={1}
            direction="auto"
            position={[40.7579747, -73.9777313]}
            content={"This is difficult...."}
          />
        </Marker>
        <CircleMarker
          center={[40.7579747, -73.9677313]}
          color="black"
          radius={30}
        >
          <Tooltip
            opacity={1}
            direction="auto"
            position={[40.7579747, -73.9677313]}
            content={"This is difficult...."}
          />
        </CircleMarker>
      </MapContainer>
    </div>
  );
};

export default MapRender;
