// src/components/GomapsProMap.js
import React, { useEffect, useRef } from 'react';
// If gomaps-pro.js supports ES module syntax, import it directly:
import '/gomaps-pro.js';

const GomapsProMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    try {
      if (
        window.$ &&
        window.$.fn &&
        typeof window.$.fn.gomap === 'function' &&
        mapContainerRef.current
      ) {
        // Initialize the Gomaps Pro map
        window.$(mapContainerRef.current).gomap({
          map: {
            latitude: 37.7749,
            longitude: -122.4194,
            zoom: 12
          },
          markers: [
            {
              latitude: 37.7749,
              longitude: -122.4194,
              html: 'San Francisco'
            }
          ]
        });
      } else {
        console.error(
          "Gomaps Pro is not available. Ensure that jQuery and gomaps-pro.js are loaded."
        );
      }
    } catch (error) {
      console.error("Error initializing Gomaps Pro map:", error);
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '500px' }}
      id="gomap"
    />
  );
};

export default GomapsProMap;
