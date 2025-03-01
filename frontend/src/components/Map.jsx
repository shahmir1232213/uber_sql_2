import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import default marker images (for default Leaflet icon)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default icon issues:
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create a custom icon for the destination marker using pickup.png
// Ensure pickup.png is placed in your public/images folder so it can be accessed at /images/pickup.png
const destinationIcon = new L.Icon({
  iconUrl: '/images/destination.png',
  iconSize: [38, 38],     // Set the width and height (38px each)
  iconAnchor: [21, 33],   // These values center the icon on the marker's location
  popupAnchor: [0, -38]   // Adjust popup position relative to the icon if needed
});

const MapComponent = ({ pickUpCoordinates, destinationCoordinates }) => {
  // Default center (Karachi) if no coordinates provided
  const defaultCenter = [24.8607, 67.0011];
  const position = pickUpCoordinates?.latitude && pickUpCoordinates?.longitude
    ? [pickUpCoordinates.latitude, pickUpCoordinates.longitude]
    : null;
  const destination = destinationCoordinates?.latitude && destinationCoordinates?.longitude
    ? [destinationCoordinates.latitude, destinationCoordinates.longitude]
    : null;

  const path = position && destination ? [position, destination] : [];
  const mapCenter = position || defaultCenter;

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Pickup marker uses the default Leaflet icon */}
      {position && (
        <Marker position={position}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {/* Destination marker uses the custom icon (pickup.png) */}
      {destination && (
        <Marker position={destination} icon={destinationIcon}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {path.length > 0 && <Polyline positions={path} color="black" />}
    </MapContainer>
  );
};

export default MapComponent;
