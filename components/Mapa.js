import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect, useState } from "react";
import L from "leaflet";

export default function Mapa() {
  const [postes, setPostes] = useState([]);
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    fetch("/api/postes")
      .then((res) => res.json())
      .then((data) => {
        const filtrados = data.filter((p) => {
          if (typeof p.coordenadas !== "string") return false;
          const [lat, lon] = p.coordenadas.split(",").map(Number);
          return !isNaN(lat) && !isNaN(lon);
        });
        setPostes(filtrados);
      });
  }, []);

  const handleClick = ([lat, lon]) => {
    setSelecionados((prev) => [...prev, [lat, lon]]);
  };

  const getColor = (empresas) => {
    const count = empresas?.split(",").length || 0;
    return count > 1 ? "red" : "green";
  };

  const customIcon = (color) =>
    new L.DivIcon({
      className: "custom-icon",
      html: `<div style="background-color:${color};width:16px;height:16px;border-radius:50%"></div>`,
    });

  return (
    <MapContainer
      center={[-23.72, -45.86]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MarkerClusterGroup chunkedLoading>
        {postes.map((poste, idx) => {
          const [lat, lon] = poste.coordenadas.split(",").map(Number);
          const color = getColor(poste.empresa);
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
      </MarkerClusterGroup>

      {selecionados.length > 1 && (
        <Polyline positions={selecionados} color="blue" />
      )}
    </MapContainer>
  );
}
