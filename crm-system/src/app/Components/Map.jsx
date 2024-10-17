'use client';
import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const MapComponent = () => {
  const mapRef = React.useRef(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Your API key
        version: 'beta',
      });

      // Load the necessary libraries
      await loader.load();

      const position = {
        lat: 37.7749,
        lng: -122.4194,
      };

      const mapOptions = {
        center: position,
        zoom: 12,
      };

      const map = new google.maps.Map(mapRef.current, mapOptions);
    };

    initMap().catch(error => console.error('Error initializing map:', error));
  }, []);

  return (
    <div style={{ height: '400px', width: '100%' }} ref={mapRef}></div>
  );
};

export default MapComponent;
