import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet'; // 💡 Importación necesaria

interface Props {
    lat: number;
    lng: number;
    title: string;
}

const MapaReceta: React.FC<Props> = ({ lat, lng, title }) => {
    const position: LatLngExpression = [lat, lng]; // 💡 Solución a los errores

    return (
        <div style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    
                    attribution='&copy; OpenStreetMap contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker position={position}>
                    <Popup>{title}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapaReceta;
