// // src/MapComponent.js
// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Import marker images with ES module syntax:
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix for default icon issues:
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// const MapComponent = ({pickUpCoordinates,destinationCoordinates}) => {
//    console.log("from map component: ",pickUpCoordinates?.longitude)
//   //  const position = [24.8527673, 67.0747573]; // Start point
//   //  const destination = [24.8678, 67.0842]; // End point
//  const position = [pickUpCoordinates?.latitude, pickUpCoordinates?.longitude]; // Start point
//  const destination = [destinationCoordinates?.latitude,destinationCoordinates?.longitude ]; // End point
//   const path = [position, destination]; // Path between points

//   return (
//     <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <Marker position={position}>
//         <Popup>Start Point</Popup>
//       </Marker>
//       <Marker position={destination}>
//         <Popup>End Point</Popup>
//       </Marker>
//       <Polyline positions={path} color="red" /> {/* Line between markers */}
//     </MapContainer>
//   );
// };

// export default MapComponent;
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Import marker images with ES module syntax:
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

const MapComponent = ({ pickUpCoordinates, destinationCoordinates }) => {
  console.log("From MapComponent: ", pickUpCoordinates, destinationCoordinates);

  // Check if coordinates exist, otherwise provide default values
  const defaultCenter = [24.8607, 67.0011]; // Karachi Default
  const position = pickUpCoordinates?.latitude && pickUpCoordinates?.longitude
    ? [pickUpCoordinates.latitude, pickUpCoordinates.longitude]
    : null;

  const destination = destinationCoordinates?.latitude && destinationCoordinates?.longitude
    ? [destinationCoordinates.latitude, destinationCoordinates.longitude]
    : null;

  const path = position && destination ? [position, destination] : [];

  // If no valid pickup location, use the default center
  const mapCenter = position || defaultCenter;

  return (
    <MapContainer center={mapCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render markers only if valid coordinates exist */}
      {position && (
        <Marker position={position}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {destination && (
        <Marker position={destination}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {/* Draw path only if both coordinates exist */}
      {path.length > 0 && <Polyline positions={path} color="black" />}
    </MapContainer>
  );
};

export default MapComponent;