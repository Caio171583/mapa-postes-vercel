import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Mapa = dynamic(() => import("../components/Mapa"), { ssr: false });

export default function Home() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Mapa />
    </div>
  );
}
