"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX!

interface VenueMapProps {
  tilesetId: string;
}

const VenueMap: React.FC<VenueMapProps> = ({ tilesetId }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: {
        version: 8,
        sources: {},
        layers: []
      },
      center: [0, 0],
      zoom: 0,
      attributionControl: false,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Add the source for your tileset
    map.current.addSource("venue_custom", {
      type: "vector",
      url: `mapbox://${tilesetId}`,
    });

    // Add a layer for all geometries
    map.current.addLayer({
      id: "venue-layer",
      type: "fill",
      source: "venue_custom",
      "source-layer": "venue_custom", // Make sure this matches your tileset layer name
      paint: {
        "fill-color": [
          "match",
          ["get", "type"],
          "rectangle", "blue",
          "circle", "red",
          "gray" // default color
        ],
        "fill-opacity": 0.7,
      },
    });

    // Fit the map to the bounds of your data
    map.current.on('sourcedata', (e) => {
      if (e.sourceId === 'venue' && e.isSourceLoaded) {
        const bounds = map.current!.getBounds();
        if (!bounds?.isEmpty()) {
          map.current!.fitBounds(bounds!, {
            padding: 20,
            maxZoom: 19
          });
        } else {
          console.warn("No features found in the tileset or bounds are empty.");
        }
      }
    });

    // Add error handling
    map.current.on("error", (e) => {
      console.error("Mapbox error:", e);
    });

  }, [mapLoaded, tilesetId]);

  return (
    <div className="map-container w-full h-full bg-gray-200">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default VenueMap;