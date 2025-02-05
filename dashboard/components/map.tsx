import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAppSelector } from '@/lib/hooks/store-hooks'; // Import your custom hook
import { Facility } from '@/lib/types'; // Import the Facility type

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
    const mapContainerRef = useRef(null);
    const facilities = useAppSelector((state) => state.selectedFacilities.selected); // Access selected facilities

    useEffect(() => {
        if (mapContainerRef.current) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/dark-v11',
                center: [-98.5795, 39.8283], // Center on the US
                zoom: 3.4, // Appropriate zoom level for the US
                pitchWithRotate: false, // Disable pitch and rotation
                dragRotate: false, // Disable map rotation
                // show all the properties of the map
                
            });

            map.on('load', () => {
                console.log('Map loaded');
                console.log('Facilities:', facilities);
                const style = map.getStyle();
                const layers = style && style.layers ? style.layers : [];
                // console.log('Available layers:', layers.map(layer => layer.id));

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
                    // 'poi-label',
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
                        // console.log(`Hiding layer: ${layer}`);
                        map.setLayoutProperty(layer, 'visibility', 'none');
                    } else {
                        // console.log(`Layer not found: ${layer}`);
                    }
                });

                const stateLabelLayer = 'state-label'; // Ensure this is the correct layer ID

                if (map.getLayer(stateLabelLayer)) {
                    map.setFilter(stateLabelLayer, ['==', 'country_code', 'US']);
                    // console.log(`Filter applied to ${stateLabelLayer} to show only US states.`);
                } else {
                    // console.log(`Layer not found: ${stateLabelLayer}`);
                }

                new mapboxgl.Marker()
                    .setLngLat([-122.3321, 47.6062])
                    .addTo(map);

                // Add markers for each facility
                facilities.forEach((facility: Facility) => {
                    if (facility.locationx !== null && facility.locationy !== null) {
                        console.log(`Adding marker for facility: ${facility.name}`);
                        console.log(`Coordinates: x=${facility.locationx}, y=${facility.locationy}`);
                        new mapboxgl.Marker()
                            .setLngLat([facility.locationx, facility.locationy])
                            .setPopup(new mapboxgl.Popup().setText(facility.name))
                            .addTo(map);
                    }
                });
            });

            return () => map.remove();
        }
    }, [facilities]); // Re-run the effect if facilities change

    return <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapComponent; 