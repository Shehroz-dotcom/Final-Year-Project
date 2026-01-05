// components/UserLocationMap.jsx
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import L from "leaflet";
import SearchControl from "./SearchControl.jsx";
import React from "react";

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function DraggableMarker({ position, onChange }) {
  const [pos, setPos] = useState(position);

  useMapEvents({
    click(e) {
      setPos([e.latlng.lat, e.latlng.lng]);
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={pos}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const p = marker.getLatLng();
          setPos([p.lat, p.lng]);
          onChange([p.lat, p.lng]);
        },
      }}
    />
  );
}

export default function UserLocationMap({ initialCoords, onLocationChange }) {
  return (
    <MapContainer
      center={initialCoords}
      zoom={15}
      style={{ height: "400px", width: "100%" }} // ✅ important
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <SearchControl
        onSelect={(coords) => {
          onLocationChange(coords);
        }}
      />
      <DraggableMarker
        position={initialCoords}
        onChange={(coords) => onLocationChange(coords)}
      />
    </MapContainer>
  );
}
