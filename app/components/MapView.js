"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

export default function MapView({ stops, regionLat, regionLng }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layers = useRef([]);

  useEffect(() => {
    if (mapInstance.current) return;
    const lat = regionLat || 44.0;
    const lng = regionLng || 2.0;
    const m = L.map(mapRef.current, { scrollWheelZoom: true, zoomControl: false }).setView([lat, lng], 10);
    L.control.zoom({ position: "bottomright" }).addTo(m);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "© OpenStreetMap © CARTO", maxZoom: 19,
    }).addTo(m);
    mapInstance.current = m;
    return () => { m.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    const m = mapInstance.current;
    if (!m) return;
    layers.current.forEach(l => m.removeLayer(l));
    layers.current = [];
    if (!stops?.length) {
      if (regionLat && regionLng) m.setView([regionLat, regionLng], 10);
      return;
    }
    const pts = stops.map(s => [s.lat, s.lng]);
    if (pts.length > 1) {
      const pl = L.polyline(pts, { color: "#C4705A", weight: 3, opacity: 0.5, dashArray: "6,8" }).addTo(m);
      layers.current.push(pl);
    }
    const bounds = [];
    stops.forEach((s, i) => {
      const ico = L.divIcon({
        className: "x",
        html: '<div style="width:32px;height:32px;border-radius:10px;background:' + (i === 0 ? "linear-gradient(135deg,#C4705A,#E8967E)" : "linear-gradient(135deg,#5B5F52,#8A9178)") + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;font-family:Outfit,sans-serif;box-shadow:0 3px 12px rgba(0,0,0,0.2)">' + (i+1) + '</div>',
        iconSize: [32, 32], iconAnchor: [16, 16],
      });
      const mk = L.marker([s.lat, s.lng], { icon: ico }).addTo(m)
        .bindPopup('<div style="font-family:Outfit,sans-serif;padding:4px"><strong>' + s.name + '</strong><br/><span style="font-size:12px;color:#888">' + (s.time||"") + '</span></div>');
      layers.current.push(mk);
      bounds.push([s.lat, s.lng]);
    });
    if (bounds.length) m.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
  }, [stops, regionLat, regionLng]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: 16 }} />;
}
