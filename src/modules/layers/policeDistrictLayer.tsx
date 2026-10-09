import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Feature, Map, MapBrowserEvent } from "ol";
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";
import { Layer } from "ol/layer";
import React from "react";
import { CheckboxButton } from "../../widgets/checkBox";

//"default" stiling som er base style for politidistrikter før hovring
function originalStyle(feature: FeatureLike) {
  return new Style({
    stroke: new Stroke({
      color: "white",
      width: 2,
    }),
    fill: new Fill({
      color: "#1b3c63", // Dark blue
    }),
    text: new Text({
      text: feature.getProperties().politidist,
      font: "bold 10px sans-serif",
      fill: new Fill({ color: "white" }),
      stroke: new Stroke({ color: "black", width: 1 }),
    }),
  });
}

//Stiling ved hovring. avvik fra original style
function hoverStyle(feature: FeatureLike) {
  return new Style({
    fill: new Fill({ color: "#4a6d94" }),
    stroke: new Stroke({
      color: "#4a6d94",
      width: 2,
    }),
  });
}

//Innhenting av politidistrikter geojson
const policeDistrictLayer = new VectorLayer({
  source: new VectorSource({
    url: "geojson/Politidistrikter.geojson",
    format: new GeoJSON(),
  }),
  style: originalStyle,
});

//Politidistriktene på kartet
export function PoliceDistrictLayer({
  setLayers,
  map,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  map: Map;
}) {
  const [checked, setChecked] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const focusFeatures = useRef<Feature[]>([]);

  //Interaktivitet ved musebevegelse
  function handlePointerMove(e: MapBrowserEvent<PointerEvent>) {
    for (const feature of focusFeatures.current) {
      feature.setStyle(originalStyle(feature));
    }

    const features = policeDistrictLayer
      .getSource()!
      .getFeaturesAtCoordinate(e.coordinate);

    if (features.length === 0) {
      focusFeatures.current = [];
      return;
    }

    for (const feature of features) {
      feature.setStyle(hoverStyle(feature));
    }

    focusFeatures.current = features;
  }

  //Tilbakestilling ved hoverstyle, hooking av og på
  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, policeDistrictLayer]);
      map.on("pointermove", handlePointerMove as any);
    } else {
      map.un("pointermove", handlePointerMove as any);
      setLayers((old: any[]) => old.filter((l) => l !== policeDistrictLayer));
    }

    return () => {
      map.un("pointermove", handlePointerMove as any);
    };
  }, [checked, map, setLayers]);

  // Update opacity when it changes
  useEffect(() => {
    policeDistrictLayer.setOpacity(opacity);
  }, [opacity]);

  //Filterknapp for politidistrikter
  return (
    <div>
      <CheckboxButton
        checked={checked}
        onClick={() => setChecked((prev) => !prev)}
      >
        Police districts
      </CheckboxButton>

      {checked && (
        <div>
          <label>Layer Opacity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}
