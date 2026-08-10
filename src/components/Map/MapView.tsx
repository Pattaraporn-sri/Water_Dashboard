import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { WaterSource } from "../../types/Water";
import "../Map/Map.css";
import MapLayer from "../../assets/layers.png";
// import type { TambonGeoJSON } from "../../types/GeoJSON";
import tambonBoundaryUrl from "../../assets/tambon_boundary.geojson?url";

interface MapViewProps {
  data: WaterSource[];
  onMarkerClick?: (item: WaterSource) => void;
}

const MapView = ({ data, onMarkerClick }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [showBasemapMenu, setShowBasemapMenu] = useState(false);
  const [basemap, setBasemap] = useState<keyof typeof BASEMAPS>("Satellite");
  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

  const BASEMAPS = {
    Satellite: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,

    Streets: "https://tiles.stadiamaps.com/styles/alidade_bright.json",
  };

  const fitToMarkers = (map: maplibregl.Map, data: WaterSource[]) => {
    if (data.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();

    let hasMarker = false;

    data.forEach((item) => {
      if (item.lat == null || item.lng == null) return;

      bounds.extend([item.lng, item.lat]);
      hasMarker = true;
    });

    if (hasMarker) {
      map.fitBounds(bounds, {
        padding: 80,
        maxZoom: 15,
      });
    }
  };

  const changeBasemap = (type: keyof typeof BASEMAPS) => {
    if (!mapRef.current) return;

    mapRef.current.setStyle(BASEMAPS[type]);

    setBasemap(type);
  };

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,

      style:
        "https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",

      // ขอนแก่น
      center: [102.839, 16.441],

      zoom: 11,
    });

    // ปุ่ม Zoom In / Zoom Out
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // ปุ่ม Fullscreen
    map.addControl(new maplibregl.FullscreenControl(), "top-right");

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("tambon-boundary", {
        type: "geojson",
        data: tambonBoundaryUrl,
      });

      map.addLayer({
        id: "tambon-fill",
        type: "fill",
        source: "tambon-boundary",
        paint: {
          "fill-color": "#E60026",
          "fill-opacity": 0.1,
        },
      });

      map.addLayer({
        id: "tambon-outline",
        type: "line",
        source: "tambon-boundary",
        paint: {
          "line-color": "#FF2400",
          "line-width": 3,
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    const handleResize = () => {
      requestAnimationFrame(() => {
        map.resize();
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // สร้าง Marker
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    //ลบ Marker เก่าออก
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    data.forEach((item) => {
      if (item.lat == null || item.lng == null) return;

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true,
      }).setHTML(`
        <div style="font-family: Kanit; min-width: 180px;">
            <h3 style="margin:0 0 8px; font-size:16px; font-weight: 600; color:#0077b6; line-height: 1.4;">
            ${item.name}
            </h3>

            <div style="font-size:12px; line-height:1.8; ">
                <div> ประเภท : ${item.type}</div>
                <div> ปริมาณ : ${item.volume.toLocaleString()} ลบ.ม.</div>
                <div> จังหวัด : ${item.province}</div>
                <div> อำเภอ : ${item.district}</div>
                <div> ตำบล: ${item.subdistrict}</div>
            </div>
        </div>
        `);

      const marker = new maplibregl.Marker({
        color: "#0077b6",
      })
        .setLngLat([item.lng, item.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);

      marker.getElement().addEventListener("click", () => {
        if (popupRef.current && popupRef.current !== popup) {
          popupRef.current.remove();
        }

        popupRef.current = popup;

        onMarkerClick?.(item);
      });
    });

    if (map.isStyleLoaded()) {
      fitToMarkers(map, data);
    }
  }, [data]);

  return (
    <div className="relative w-full h-full min-w-0">
      <div className="absolute top-[10px] left-3 z-20">
        {/* ปุ่ม Layer */}
        <button
          onClick={() => setShowBasemapMenu(!showBasemapMenu)}
          className="bg-white
            p-2
            rounded-lg
            shadow-lg
          hover:bg-gray-100
            transition"
        >
          <img src={MapLayer} className="w-6 h-6" />
        </button>

        {/* popup */}
        {showBasemapMenu && (
          <div
            className="
              absolute
              left-12
              top-0
            bg-white
              rounded-lg
              p-4
              w-32"
          >
            <label className="flex items-center gap-2 mb-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="basemap"
                value="Satellite"
                checked={basemap === "Satellite"}
                onChange={() => changeBasemap("Satellite")}
              />
              <span>ดาวเทียม</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="basemap"
                value="Streets"
                checked={basemap === "Streets"}
                onChange={() => changeBasemap("Streets")}
              />
              <span>ถนน</span>
            </label>
          </div>
        )}
      </div>

      <div
        ref={mapContainer}
        className="w-full h-full min-w-0 rounded-xl overflow-hidden"
      />
    </div>
  );
};

export default MapView;
