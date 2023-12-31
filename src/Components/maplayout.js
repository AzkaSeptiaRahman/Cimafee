// Library
import { MapContainer, GeoJSON, Polygon} from "react-leaflet";
import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

// Components
import Mark from "./marker";

// Utils
import bondary from "../utils/cmgs.json";
import streets from "../utils/jalan.json";
import MapLayerControl from "./mapLayerControl";
import MinimapControl from "./minimap";

// Style
import style from "../style/MapLayout.module.css";

export default function MapLayout() {
  const overlayStyle = {
    color: "var(--orange)",
    weight: 4,
    fill: true,
  };

  const streetStyle = {
    color: "#ffffff",
    weight: 2,
    fill: false,
  };

  const insideBoundaryCoords = changeFormat(bondary.coordinates[0][0]);

  const outsideBoundaryCoords = [
    [90, -180],
    [90, 180],
    [-90, 180],
    [-90, -180],
    [90, -180],
  ];

  const [map, setMap] = useState(null);

  const { marks, scrollable } = useSelector((state) => state.setup.setup);
  const { center, zoom } = useSelector((state) => state.setup);

  useEffect(() => {
    // Re-center Map
    if (map) {
      map?.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return (
    <MapContainer
      // key={pre}
      MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollable}
      className={style.map}
      ref={setMap}
    >
      {/* Kontrol TileLayer Map */}
      <MapLayerControl />
      <MinimapControl position="bottomright" />
      {/* Mark untuk setiap titik cafe */}
      {marks?.map((mark, index) => (
        <Mark data={mark} key={index} />
      ))}
      ,{/* Bondary Regional Cinere */}
      {/* With Polygon Vector */}
      <Polygon
        positions={[outsideBoundaryCoords, insideBoundaryCoords]}
        pathOptions={{ color: "black" }}
      />
      {/* GeoJSON Bondary */}
      <GeoJSON data={bondary} style={() => overlayStyle} />
      {/* Streets */}
      {streets.map((street) => (
        <GeoJSON data={street} style={() => streetStyle}>
        </GeoJSON>
      ))}
    </MapContainer>
  );
}

// Flip Lot and Lat
function changeFormat(cordinates) {
  const newCordinates = cordinates.map((cordinate) => [
    cordinate[1],
    cordinate[0],
  ]);

  return [newCordinates];
}
