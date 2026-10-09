import { Feature } from "ol";
import React, { useState, useRef } from "react";
import { Draw } from "ol/interaction";
import { Map } from "ol";
import { PointFeatureForm } from "./pointFeatureForm";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

//Map objekt + vectorsource der punkter skal lagres
interface AddPointButtonProps {
  map: Map;
  source: VectorSource;
}

export function AddPointButton({ map, source }: AddPointButtonProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //Ved tegning av punkt (klikk)
  function handleAddPointClick() {
    if (isDialogOpen) return;

    const draw = new Draw({
      type: "Point",
      source,
    });
    map.addInteraction(draw);

    draw.on("drawend", (e) => {
      const feature = e.feature;
      setCurrentFeature(feature);
      setIsDialogOpen(true);
      dialogRef.current?.showModal();
      map.removeInteraction(draw);
    });
  }

  function handleSaveFeature(feature: Feature) {
    saveToLocalStorage();
    closeDialog();
  }

  //lukker og rydder opp dersom feature er tom
  function closeDialog() {
    if (currentFeature) {
      const name = currentFeature.get("featureName");
      const color = currentFeature.get("color");

      const isEmpty =
        (!name || name.trim() === "") && (!color || color.trim() === "");

      if (isEmpty) {
        source.removeFeature(currentFeature);
      }
    }

    setCurrentFeature(null);
    setIsDialogOpen(false);
    dialogRef.current?.close();
  }

  //Konverterer features til geojson og lagrer i local storage
  function saveToLocalStorage() {
    const features = source.getFeatures();
    const geojson = new GeoJSON().writeFeatures(features);
    localStorage.setItem("features", geojson);
  }

  return (
    <>
      <button
        onClick={handleAddPointClick}
        className="addPointButton"
        disabled={isDialogOpen}
      >
        Add Point
      </button>

      <dialog ref={dialogRef} className="popup-form-wrapper">
        {currentFeature && (
          <div className="popup-box">
            <PointFeatureForm
              feature={currentFeature}
              onSave={handleSaveFeature}
              onClose={closeDialog}
            />
          </div>
        )}
      </dialog>
    </>
  );
}
