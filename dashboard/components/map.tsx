import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        if (mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/dark-v11',
                
                center: [-74.5, 40], // starting position [lng, lat]
                zoom: 4 // starting zoom
            });

            map.on('load', () => {
                console.log('Map loaded');
                const style = map.getStyle();
                const layers = style && style.layers ? style.layers : [];
                console.log('Available layers:', layers.map(layer => layer.id));

                const layersToHide = [
                    // 'land',
                    'national-park',
                    'landuse',
                    'waterway',
                    // 'water',
                    // 'land-structure-polygon',
                    // 'land-structure-line',
                    'aeroway-polygon',
                    'aeroway-line',
                    'building',
                    'tunnel-path-trail',
                    'tunnel-path-cycleway-piste',
                    'tunnel-path',
                    'tunnel-steps',
                    'tunnel-pedestrian',
                    'tunnel-simple',
                    'road-path-trail',
                    'road-path-cycleway-piste',
                    'road-path',
                    'road-steps',
                    'road-pedestrian',
                    'road-simple',
                    'road-rail',
                    'bridge-path-trail',
                    'bridge-path-cycleway-piste',
                    'bridge-path',
                    'bridge-steps',
                    'bridge-pedestrian',
                    'bridge-case-simple',
                    'bridge-simple',
                    'bridge-rail',
                    // 'admin-1-boundary-bg',
                    // 'admin-0-boundary-bg',
                    // 'admin-1-boundary',
                    // 'admin-0-boundary',
                    // 'admin-0-boundary-disputed',
                    'road-label-simple',
                    'waterway-label',
                    // 'natural-line-label',
                    'natural-point-label',
                    // 'water-line-label',
                    'water-point-label',
                    'poi-label',
                    'airport-label',
                    'settlement-subdivision-label',
                    'settlement-minor-label',
                    'settlement-major-label',
                    // 'state-label',
                    // 'country-label',
                    'continent-label'
                ];

                layersToHide.forEach(layer => {
                    if (map.getLayer(layer)) {
                        console.log(`Hiding layer: ${layer}`);
                        map.setLayoutProperty(layer, 'visibility', 'none');
                    } else {
                        console.log(`Layer not found: ${layer}`);
                    }
                });

                const stateLabelLayer = 'state-label'; // Ensure this is the correct layer ID

                if (map.getLayer(stateLabelLayer)) {
                    map.setFilter(stateLabelLayer, ['==', 'country_code', 'US']);
                    console.log(`Filter applied to ${stateLabelLayer} to show only US states.`);
                } else {
                    console.log(`Layer not found: ${stateLabelLayer}`);
                }
            });

            return () => map.remove();
        }
    }, []);

    return <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent; 