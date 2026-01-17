import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import React from 'react';
import 'leaflet-control-geocoder'; // must be imported once
//import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

export default function SearchControl({ onSelect }) {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
      placeholder: 'Search location...',
    })
      .on('markgeocode', function (e) {
        const { center, name } = e.geocode;
        map.setView(center, 15);
        onSelect([center.lat, center.lng], name);
      })
      .addTo(map);

    return () => map.removeControl(geocoder);
  }, [map, onSelect]);

  return null;
}
