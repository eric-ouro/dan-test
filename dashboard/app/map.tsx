import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapComponent from '../components/MapComponent';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const MapPage = () => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        if (mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [-74.5, 40], // starting position [lng, lat]
                zoom: 9 // starting zoom
            });

            return () => map.remove();
        }
    }, []);

    return (
        <div>
            <h1>Map Page</h1>
            <MapComponent />
        </div>
    );
};

export default MapPage; 