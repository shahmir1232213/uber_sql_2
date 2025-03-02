import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Default marker images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons configuration
const icons = {
  destination: new L.Icon({
    iconUrl: '/images/destination.png',
    iconSize: [55, 55],
    iconAnchor: [27.5, 55],  // Center bottom anchor
    popupAnchor: [0, -55]
  }),
  defaultVehicle: new L.Icon({
    iconUrl: '/images/blackCar2.png',  // Updated car image
    iconSize: [55, 55],
    iconAnchor: [27.5, 55],  // Proper center alignment
    popupAnchor: [0, -55]
  })
};

const MapComponent = ({ pickUpCoordinates, destinationCoordinates, captinsAr }) => {
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

      {/* Pickup Marker */}
      {position && (
        <Marker position={position}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {/* Destination Marker */}
      {destination && (
        <Marker position={destination} icon={icons.destination}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {/* Vehicle Markers */}
      {captinsAr?.map((captain, index) => {
        const vehicleIcon = new L.Icon({
          iconUrl: captain.vehicleType || icons.defaultVehicle.options.iconUrl,
          iconSize: [55, 55],
          iconAnchor: [27.5, 55],
          popupAnchor: [0, -55]
        });

        return (
          <Marker
            key={`captain-${index}`}
            position={[captain.latitude, captain.longitude]}
            icon={vehicleIcon}
          >
            <Popup>Captain {index + 1}</Popup>
          </Marker>
        );
      })}

      {/* Route Polyline */}
      {path.length > 0 && <Polyline positions={path} color="black" />}
    </MapContainer>
  );
};

export default MapComponent;