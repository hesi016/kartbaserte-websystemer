import { useEffect, useRef, useState } from "react";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Cluster from "ol/source/Cluster";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Overlay from "ol/Overlay";
import { MapBrowserEvent } from "ol";
import { CheckboxButton } from "../../widgets/checkBox";
import React from "react";

//Tar inn firestation og map og setter inn i layers
export function FirestationLayer({
  map,
  setLayers,
}: {
  map: any;
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
}) {
  const [checked, setChecked] = useState(false);
  const [clusterLayer, setClusterLayer] = useState<VectorLayer<any> | null>(
    null,
  );

  //Pop ups ved klikk
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlay = useRef<Overlay>(
    new Overlay({
      autoPan: false,
      positioning: "bottom-center",
    }),
  ).current;

  const [popupText, setPopupText] = useState<string | null>(null);

  //Hente firestation fra databasen
  useEffect(() => {
    if (checked && !clusterLayer) {
      fetch("/api/firestation")
        .then((res) => res.json())
        .then((data) => {
          const originalSource = new VectorSource({
            features: new GeoJSON().readFeatures(data, {
              featureProjection: "EPSG:4326", //Geografiske koordinater i grader, lengde og breddegrad. oversettelse for å vise riktig ved innhenting
            }),
          });

          //Cluster punkter på kartet
          const clusterSource = new Cluster({
            distance: 40,
            source: originalSource,
          });

          //for nærme punkter vises som 1 punkt (problemer med koordinater hvor flere vises på samme punkt)
          const newClusterLayer = new VectorLayer({
            source: clusterSource,
            style: (feature: any) => {
              const features = feature.get("features");
              const size = features.length;

              if (size === 1) {
                const single = features[0];
                return new Style({
                  text: new Text({
                    text: single.get("brannstasjon") || "",
                    offsetY: -25,
                    font: "bold 12px sans-serif",
                    fill: new Fill({ color: "black" }),
                    stroke: new Stroke({ color: "white", width: 2 }),
                  }),
                });
              }

              //Styling knyttet til cluster punkter på firestation
              return new Style({
                image: new CircleStyle({
                  radius: 15,
                  fill: new Fill({ color: "red" }),
                  stroke: new Stroke({ color: "white", width: 2 }),
                }),
                text: new Text({
                  text: size.toString(),
                  font: "bold 14px sans-serif",
                  fill: new Fill({ color: "white" }),
                }),
              });
            },
          });

          //kobler opp mot UI
          map.addLayer(newClusterLayer);
          setClusterLayer(newClusterLayer);
          setLayers((prev) => [...prev, newClusterLayer]);
          newClusterLayer.setVisible(checked);

          overlay.setElement(overlayRef.current || undefined);
          map.addOverlay(overlay);

          // Pop up kommer ved klikk på brannstasjons punkter
          map.on("click", (evt: MapBrowserEvent<any>) => {
            map.forEachFeatureAtPixel(evt.pixel, (feature: any) => {
              const clusterFeatures = feature.get("features");
              if (clusterFeatures && clusterFeatures.length > 0) {
                const names = clusterFeatures
                  .map((f: any) => f.get("brannstasjon"))
                  .join(", ");
                setPopupText(`Brannstasjon/er: ${names}`);
                overlay.setPosition(evt.coordinate);
              }
            });
          });
        });
    }

    //Oppdatering ved klikk og klikk av lag
    return () => {
      if (clusterLayer) {
        map.removeLayer(clusterLayer);
        setLayers((prev) => prev.filter((layer) => layer !== clusterLayer));
        setClusterLayer(null);
      }
    };
  }, [checked, map, setLayers, clusterLayer]);

  useEffect(() => {
    if (clusterLayer) {
      clusterLayer.setVisible(checked);
    }
  }, [checked, clusterLayer]);

  //Filter checkbox i header
  return (
    <div>
      <CheckboxButton
        checked={checked}
        onClick={() => setChecked((prev) => !prev)} // Toggle checkbox state
      >
        Firestations
      </CheckboxButton>

      <div
        ref={overlayRef}
        className="overlay"
        style={{ display: popupText ? "block" : "none" }}
      >
        {popupText && (
          <>
            <button
              className="close-button"
              onClick={() => {
                setPopupText(null);
                overlay.setPosition(undefined);
              }}
            >
              ×
            </button>
            <div className="overlay-content">
              <p>{popupText}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
