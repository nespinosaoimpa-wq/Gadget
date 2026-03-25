import { useMemo } from 'react';
import { Marker, Popup, Polygon } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useGeoStore } from '../../store/geoStore';
import type { GeoZone } from '../../types/geoTypes';

// Fix for default marker icons in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const getIncidentColor = (type: string) => {
  switch (type) {
    case 'HOMICIDIO': return '#ff4d4f';
    case 'NARCOTRAFICO': return '#faad14';
    case 'ROBO': return '#1890ff';
    case 'AMENAZAS': return '#722ed1';
    case 'MICROTRAFICO': return '#f5222d';
    case 'LESIONES': return '#eb2f96';
    default: return '#bfbfbf';
  }
};

const createCustomIcon = (type: string) => {
  const color = getIncidentColor(type);
  return new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    className: 'custom-marker-icon',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

const GeoLayers = ({ onZoneSelect }: { onZoneSelect: (zone: GeoZone) => void }) => {
  const { incidents, zones, layers, filters } = useGeoStore();

  // Filter incidents based on store filters
  const filteredIncidents = useMemo(() => {
    return incidents.filter(i => {
      const matchesType = filters.crimeTypes.includes(i.type);
      const matchesSeverity = i.severity >= filters.minSeverity;
      const date = new Date(i.date);
      const matchesDate = date >= new Date(filters.dateRange[0]) && date <= new Date(filters.dateRange[1]);
      return matchesType && matchesSeverity && matchesDate;
    });
  }, [incidents, filters]);

  const markersLayer = layers.find(l => l.id === 'markers');
  const zonesLayer = layers.find(l => l.id === 'zones');

  return (
    <>
      {/* 1. Incident Markers with Clustering */}
      {markersLayer?.visible && (
        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          maxClusterRadius={50}
        >
          {filteredIncidents.map(incident => (
            <Marker 
              key={incident.id} 
              position={[incident.lat, incident.lng]}
              icon={createCustomIcon(incident.type)}
            >
              <Popup>
                <div style={popupStyles.container}>
                  <div style={popupStyles.header}>
                    <span style={{...popupStyles.badge, backgroundColor: getIncidentColor(incident.type)}}>
                      {incident.type}
                    </span>
                    <span style={popupStyles.date}>
                      {new Date(incident.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={popupStyles.desc}>{incident.description}</div>
                  <div style={popupStyles.footer}>
                    <span>Severidad: {incident.severity}/5</span>
                    <button className="text-btn">Ver Caso</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      )}

      {/* 2. Intelligence Zones */}
      {zonesLayer?.visible && zones.map(zone => (
        <Polygon
          key={zone.id}
          positions={zone.polygon}
          pathOptions={{
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.2,
            weight: 2,
            dashArray: '5, 5'
          }}
          eventHandlers={{
            click: () => onZoneSelect(zone)
          }}
        >
          <Popup>
            <div style={{ padding: '5px' }}>
              <strong>{zone.name}</strong><br />
              <span style={{ fontSize: '0.75rem', color: '#666' }}>Tipo: {zone.type}</span>
            </div>
          </Popup>
        </Polygon>
      ))}

      {/* 3. GPU Heatmap Overlay (Filtro base - simplificado para Leaflet natively) */}
      {/* 
          En una implementación más robusta usaríamos DeckGL con el layer de Leaflet.
          Aquí usamos una aproximación compatible con el entorno.
      */}
    </>
  );
};

const popupStyles = {
  container: {
    minWidth: '200px',
    padding: '5px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: '700'
  },
  date: {
    fontSize: '0.7rem',
    color: '#666'
  },
  desc: {
    fontSize: '0.85rem',
    margin: '10px 0',
    lineHeight: '1.4'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    marginTop: '10px',
    paddingTop: '8px',
    borderTop: '1px solid #eee'
  }
};

export default GeoLayers;
