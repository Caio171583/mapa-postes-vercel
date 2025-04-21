import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

function AtualizarMapa() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 500); // Pequeno delay ajuda o layout
  }, [map]);
  return null;
}

export default function Mapa() {
  const [postes, setPostes] = useState([]);
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    fetch("/api/postes")
      .then(res => res.json())
      .then(setPostes);
  }, []);

  const handleClick = (poste) => {
    setSelecionados([...selecionados, poste]);
  };

  const getColor = (empresas) => {
    const count = empresas?.split(",").length || 0;
    return count > 5 ? "red" : "green";
  };

  const customIcon = (color) =>
    new L.DivIcon({
      className: "custom-icon",
      html: `<div style="background-color:${color};width:16px;height:16px;border-radius:50%"></div>`
    });

  return (
    <MapContainer center={[-23.55, -46.63]} zoom={12} style={{ height: "100vh", width: "100vw" }}>
      <AtualizarMapa />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {Array.isArray(postes) && postes.map((poste, idx) => {
        const [lat, lon] = poste.coordenadas?.split(",").map(Number);
        const color = getColor(poste.empresa || "");
        return (
          <Marker
            key={idx}
            position={[lat, lon]}
            icon={customIcon(color)}
            eventHandlers={{ click: () => handleClick([lat, lon]) }}
          >
            <Popup>
              <strong>ID:</strong> {poste.id_poste}<br />
              <strong>Empresas:</strong> {poste.empresa}
            </Popup>
          </Marker>
        );
      })}
      {selecionados.length > 1 && (
        <Polyline positions={selecionados} color="blue" />
      )}
    </MapContainer>
  );
}
