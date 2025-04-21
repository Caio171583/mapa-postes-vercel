import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

export default function Mapa() {
  const [postes, setPostes] = useState([]);
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    fetch("/api/postes")
      .then(res => res.json())
      .then(data => {
        // Filtra registros válidos com coordenadas no formato correto
        const filtrados = data.filter(p =>
          typeof p.coordenadas === "string" &&
          p.coordenadas.includes(",") &&
          !isNaN(parseFloat(p.coordenadas.split(",")[0])) &&
          !isNaN(parseFloat(p.coordenadas.split(",")[1]))
        );
        setPostes(filtrados);
      });
  }, []);

  const handleClick = (poste) => {
    setSelecionados([...selecionados, poste]);
  };

  const getColor = (empresas) => {
    const count = (empresas?.split(",").length) || 0;
    return count > 1 ? "red" : "green";
  };

  const customIcon = (color) =>
    new L.DivIcon({
      className: "custom-icon",
      html: `<div style="background-color:${color};width:16px;height:16px;border-radius:50%"></div>`
    });

  return (
    <MapContainer center={[-23.72, -45.86]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {postes.map((poste, idx) => {
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
              <strong>Empresa:</strong> {poste.empresa}<br />
              <strong>Resumo:</strong> {poste.resumo}<br />
              <strong>Município:</strong> {poste.nome_municipio}
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
