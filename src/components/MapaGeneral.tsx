import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Íconos personalizados de Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface Props {
    recetas: {
        id: number;
        title: string;
        latitud: number;
        longitud: number;
    }[];
}

const MapaGeneral: React.FC<Props> = ({ recetas }) => {
    const centroInicial = recetas.length
        ? [recetas[0].latitud, recetas[0].longitud]
        : [1.0, -76.0]; // Default: zona Putumayo

    return (
        <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700">
            <MapContainer
                center={centroInicial as [number, number]}
                zoom={7}
                scrollWheelZoom={true}
                className="h-[320px] w-full"
                style={{ borderRadius: '1rem' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    // Puedes reemplazar esta URL por una capa oscura si lo prefieres:
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    // O prueba un estilo dark: 
                    // url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                />
                {recetas.map((receta) => (
                    <Marker
                        key={receta.id}
                        position={[receta.latitud, receta.longitud]}
                    >
                        <Popup>
                            <strong>{receta.title}</strong>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapaGeneral;
