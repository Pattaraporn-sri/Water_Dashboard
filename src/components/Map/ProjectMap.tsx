import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapLayer from "../../assets/layers.png";

interface ProjectBank {
  province: string;
  district: string;
  subdistrict: string;
  no: number | string;
  projectName: string;
  projectDetail: string;
  responsibleAgency: string;
  supportingAgency: string;
  budget: number;
  year: number;
  strategy: string;
  benefit: string;
  villageNo: number | string;
  villageName: string;
  waterSource: string;
  lat: number | null;
  long: number | null;
}

interface ProjectMapProps {
  projects: ProjectBank[];
}

const ProjectMap = ({ projects }: ProjectMapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const [showBasemapMenu, setShowBasemapMenu] = useState(false);
  const [basemap, setBasemap] =
    useState<keyof typeof BASEMAPS>("Satellite");

  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

  const BASEMAPS = {
    Satellite: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,
    Streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
  };

  // Zoom ให้เห็นโครงการทั้งหมด
  const fitToProjects = (
    map: maplibregl.Map,
    projectData: ProjectBank[],
  ) => {
    if (projectData.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    let hasMarker = false;

    projectData.forEach((project) => {
      if (project.lat == null || project.long == null) return;

      const lat = Number(project.lat);
      const lng = Number(project.long);

      if (isNaN(lat) || isNaN(lng)) return;

      bounds.extend([lng, lat]);
      hasMarker = true;
    });

    if (hasMarker) {
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  };

  // เปลี่ยน Basemap
  const changeBasemap = (type: keyof typeof BASEMAPS) => {
    if (!mapRef.current) return;

    mapRef.current.setStyle(BASEMAPS[type]);
    setBasemap(type);
  };

  // สร้าง Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: BASEMAPS.Satellite,

      // ตำแหน่งเริ่มต้น
      center: [102.839, 16.441],
      zoom: 7,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-right",
    );

    map.addControl(
      new maplibregl.FullscreenControl(),
      "top-right",
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Resize เมื่อขนาด Container เปลี่ยน
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
    const map = mapRef.current;

    if (!map) return;

    // ลบ Marker เดิม
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // ปิด Popup เดิม
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    projects.forEach((project) => {
      if (project.lat == null || project.long == null) return;

      const lat = Number(project.lat);
      const lng = Number(project.long);

      if (isNaN(lat) || isNaN(lng)) return;

      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true,
      }).setHTML(`
        <div style="
          font-family: Kanit, sans-serif;
          min-width: 220px;
        ">
          <h3 style="
            margin: 0 0 8px;
            font-size: 16px;
            font-weight: 600;
            color: #023e8a;
            line-height: 1.4;
          ">
            ${project.projectName || "ไม่ระบุชื่อโครงการ"}
          </h3>

          <div style="
            font-size: 12px;
            line-height: 1.8;
          ">
            <div>
              ปีงบประมาณ : ${project.year || "-"}
            </div>

            <div>
              หมู่ที่ : ${project.villageNo || "-"}
            </div>

            <div>
              หมู่บ้าน : ${project.villageName || "-"}
            </div>

            <div>
              งบประมาณ :
              ${Number(project.budget || 0).toLocaleString()} บาท
            </div>

            <div>
              หน่วยงาน :
              ${project.responsibleAgency || "-"}
            </div>

            <div>
              ตำบล : ${project.subdistrict || "-"}
            </div>

            <div>
              อำเภอ : ${project.district || "-"}
            </div>

            <div>
              จังหวัด : ${project.province || "-"}
            </div>
          </div>
        </div>
      `);

      const marker = new maplibregl.Marker({
        color: "#e63946",
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);

      marker.getElement().addEventListener("click", () => {
        if (popupRef.current && popupRef.current !== popup) {
          popupRef.current.remove();
        }

        popupRef.current = popup;
      });
    });

    // Zoom ตามโครงการ
    if (projects.length > 0) {
      const zoomToProjects = () => {
        fitToProjects(map, projects);
      };

      if (map.isStyleLoaded()) {
        zoomToProjects();
      } else {
        map.once("load", zoomToProjects);
      }
    }
  }, [projects]);

  return (
    <div className="relative w-full h-full min-w-0">
      {/* Layer */}
      <div className="absolute top-[10px] left-3 z-20">
        <button
          onClick={() =>
            setShowBasemapMenu(!showBasemapMenu)
          }
          className="
            bg-white
            p-2
            rounded-lg
            shadow-lg
            hover:bg-gray-100
            transition
          "
        >
          <img
            src={MapLayer}
            className="w-6 h-6"
            alt="Layers"
          />
        </button>

        {showBasemapMenu && (
          <div
            className="
              absolute
              left-12
              top-0
              bg-white
              rounded-lg
              shadow-lg
              p-4
              w-32
            "
          >
            <label className="flex items-center gap-2 mb-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="project-basemap"
                value="Satellite"
                checked={basemap === "Satellite"}
                onChange={() =>
                  changeBasemap("Satellite")
                }
              />

              <span>ดาวเทียม</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="project-basemap"
                value="Streets"
                checked={basemap === "Streets"}
                onChange={() =>
                  changeBasemap("Streets")
                }
              />

              <span>ถนน</span>
            </label>
          </div>
        )}
      </div>

      {/* Map */}
      <div
        ref={mapContainer}
        className="
          w-full
          h-full
          min-w-0
          rounded-xl
          overflow-hidden
        "
      />
    </div>
  );
};

export default ProjectMap;