import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
    lat: number;
    lng: number;
    onChange: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<Props> = ({ lat, lng, onChange }) => {
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
        }
    });

    return <Marker position={[lat, lng]} />;
};

const MapaSelector: React.FC<Props> = ({ lat, lng, onChange }) => {
    const position: LatLngExpression = [lat, lng];

    return (
        <MapContainer center={position} zoom={13} style={{ height: '300px', width: '100%', borderRadius: '12px' }}>
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker lat={lat} lng={lng} onChange={onChange} />
        </MapContainer>
    );
};

export default MapaSelector;
