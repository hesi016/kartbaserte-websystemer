import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Feature, Map, MapBrowserEvent, Overlay } from "ol";
import { useGeographic } from "ol/proj";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";
import { FeatureLike } from "ol/Feature";
import { Layer } from "ol/layer";
import { CheckboxButton } from "../../widgets/checkBox";

//Geografiske koordinater
useGeographic();

//Originale AMK styling
function originalStyle(feature: FeatureLike): Style {
  return new Style({
    stroke: new Stroke({
      color: "orange",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(255, 165, 0, 0.3)",
    }),
  });
}

//Funksjon og styling ved hovring
function hoverStyle(feature: FeatureLike): Style {
  return new Style({
    fill: new Fill({ color: "rgba(255, 140, 0, 0.5)" }),
    stroke: new Stroke({
      color: "orange",
      width: 2,
    }),
  });
}

//innhenting av geo.json data
const amkLayer = new VectorLayer({
  source: new VectorSource({
    url: "geojson/AMK-distrikter.geojson",
    format: new GeoJSON(),
  }),
  style: originalStyle,
});

//Kart lag med geojson data
export function AmkLayer({
  setLayers,
  map,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  map: Map;
}) {
  const focusFeatures = useRef<Feature[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlay = useRef<Overlay>(
    new Overlay({
      autoPan: false,
      positioning: "bottom-center",
    }),
  ).current;

  const [checked, setChecked] = useState(false); //Dersom laget er aktivt eller ikke
  const [opacity, setOpacity] = useState(1); //Gjennomsiktighet

  const [selectedDistrict, setSelectedDistrict] = useState<{
    name: string;
    location: string;
  } | null>(null);

  //Innhenting av info om distrikt
  const handleClick = (e: MapBrowserEvent<PointerEvent>) => {
    const features =
      amkLayer.getSource()?.getFeaturesAtCoordinate(e.coordinate) || [];

    if (features.length > 0) {
      const feature = features[0];
      const name = feature.getProperties().navn;
      const location = feature.getProperties().lokalisering;

      setSelectedDistrict({ name, location });
      overlay.setPosition(e.coordinate);
    } else {
      setSelectedDistrict(null);
      overlay.setPosition(undefined);
    }
  };

  //Hover
  const handlePointerMove = (e: MapBrowserEvent<PointerEvent>) => {
    for (const feature of focusFeatures.current) {
      feature.setStyle(originalStyle(feature));
    }

    const features =
      amkLayer.getSource()?.getFeaturesAtCoordinate(e.coordinate) || [];

    if (features.length === 0) {
      focusFeatures.current = [];
      return;
    }

    for (const feature of features) {
      feature.setStyle(hoverStyle(feature));
    }

    focusFeatures.current = features;
  };

  //Implementering av lag, overlay og eventlisteners
  useEffect(() => {
    setLayers((old) => [...old, amkLayer]);
    overlay.setElement(overlayRef.current || undefined);
    map.addOverlay(overlay);

    //Eventlistener simplementert ved klikk
    if (checked) {
      map.on("pointermove", handlePointerMove as any);
      map.on("click", handleClick as any);
    } else {
      // Remove event listeners when the checkbox is unchecked
      map.un("pointermove", handlePointerMove as any);
      map.un("click", handleClick as any);
    }

    //Fjerner "logg" ved interaksjon
    return () => {
      map.un("pointermove", handlePointerMove as any);
      map.un("click", handleClick as any);
      setLayers((old: any[]) => old.filter((l) => l !== amkLayer));
      map.removeOverlay(overlay);
    };
  }, [map, setLayers, overlay, checked]);

  //Gjennomsiktighetsfunksjon
  useEffect(() => {
    amkLayer.setVisible(checked);
  }, [checked]);

  useEffect(() => {
    amkLayer.setOpacity(opacity);
  }, [opacity]);

  //Check box og filter i header
  return (
    <div>
      <div
        ref={overlayRef}
        className="overlay"
        style={{ display: selectedDistrict ? "block" : "none" }}
      >
        {selectedDistrict && (
          <>
            <button
              className="close-button"
              onClick={() => {
                setSelectedDistrict(null);
                overlay.setPosition(undefined);
              }}
              aria-label="Lukk"
            >
              ×
            </button>
            <div className="overlay-content">
              <h3>{selectedDistrict.name}</h3>
              <p>Plassert i : {selectedDistrict.location}</p>
            </div>
          </>
        )}
      </div>
      <div>
        <CheckboxButton
          checked={checked}
          onClick={() => setChecked((prev) => !prev)}
        >
          Amk districts
        </CheckboxButton>

        {checked && (
          <div style={{ marginTop: "0.5rem" }}>
            <label htmlFor="amk-opacity">Layer Opacity:</label>
            <input
              id="amk-opacity"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
