import { useEffect, useRef, useState } from "react";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Stroke, Style, Fill, Text } from "ol/style";
import { Feature } from "ol";
import { FeatureLike } from "ol/Feature";
import { MapBrowserEvent } from "ol";
import { Source } from "ol/source";
import { CheckboxButton } from "../../widgets/checkBox";
import React from "react";

//Styling
function originalStyle(): Style {
  return new Style({
    stroke: new Stroke({
      color: "green",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 128, 0, 0.05)",
    }),
  });
}

//Styling & interaktivitet ved hovring
function hoverStyle(feature: FeatureLike): Style {
  return new Style({
    stroke: new Stroke({
      color: "#2ecc71",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(0, 128, 0, 0.15)",
    }),
    text: new Text({
      text: feature.get("navn"),
      font: "bold 14px sans-serif",
      placement: "point",
      fill: new Fill({ color: "#064d1f" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
  });
}

//Bare regioner/distrikter vises ved hovring
export function CivilDefenceLayer({
  map,
  setLayers,
}: {
  map: any;
  setLayers: React.Dispatch<React.SetStateAction<Layer<Source>[]>>;
}) {
  const [checked, setChecked] = useState<boolean>(false);
  const [opacity, setOpacity] = useState(1); // default opacity = 100%
  const vectorLayerRef = useRef<VectorLayer<any> | null>(null);
  const focusFeatures = useRef<Feature[]>([]);

  function handlePointerMove(e: MapBrowserEvent<PointerEvent>) {
    for (const feature of focusFeatures.current) {
      feature.setStyle(originalStyle());
    }

    const features =
      vectorLayerRef.current
        ?.getSource()
        ?.getFeaturesAtCoordinate(e.coordinate) || [];

    if (features.length === 0) {
      focusFeatures.current = [];
      return;
    }

    for (const feature of features) {
      feature.setStyle(hoverStyle(feature));
    }

    focusFeatures.current = features;
  }

  //Innhenting av data fra databasen. Sivildistrikter
  useEffect(() => {
    if (checked) {
      fetch("/api/CivilDefenceDistricts")
        .then((res) => res.json())
        .then((data) => {
          const source = new VectorSource({
            features: new GeoJSON().readFeatures(data, {
              featureProjection: "EPSG:4326",
            }),
          });

          const vectorLayer = new VectorLayer({
            source,
            style: originalStyle,
          });

          map.addLayer(vectorLayer);
          vectorLayerRef.current = vectorLayer;
          setLayers((prev) => [...prev, vectorLayer]);
          map.on("pointermove", handlePointerMove as any);
        });
    }

    return () => {
      if (vectorLayerRef.current) {
        map.removeLayer(vectorLayerRef.current);
        setLayers((prev) =>
          prev.filter((layer) => layer !== vectorLayerRef.current),
        );
        map.un("pointermove", handlePointerMove as any);
        vectorLayerRef.current = null;
      }
    };
  }, [checked, map, setLayers]);

  useEffect(() => {
    if (vectorLayerRef.current) {
      vectorLayerRef.current.setOpacity(opacity);
    }
  }, [opacity]);

  //Filterknapp for sivildistrikter
  return (
    <div>
      <CheckboxButton
        checked={checked}
        onClick={() => setChecked((prev) => !prev)}
      >
        Civil Defence Districts
      </CheckboxButton>

      {checked && (
        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="civildef-opacity">Layer Opacity:</label>
          <input
            id="civildef-opacity"
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
  );
}
