import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect, useLayoutEffect, useState } from "react";
import L from "leaflet";

// Força o mapa a redimensionar corretamente
function ForceResize() {
  const map = useMap();

  useLayoutEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
      window.dispatchEvent(new Event("resize"));
    }, 300); // tempo suficiente pra renderizar antes
  }, [map]);

  return null;
}

export default function Mapa() {
  const [postes, setPostes] = useState([]);
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    fetch("/api/postes")
      .then(res => res.json())
      .then(setPostes)
      .catch(err => console.error("Erro ao carregar postes:", err));
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
    <MapContainer
      center={[-23.71, -46.20]}
      zoom={13}
      style={{ height: "100vh", width: "100vw" }}
    >
      <ForceResize />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {postes.map((poste, idx) => {
        if (!poste.coordenadas || !poste.coordenadas.includes(",")) return null;

        const [lat, lon] = poste.coordenadas.split(",").map(Number);
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
