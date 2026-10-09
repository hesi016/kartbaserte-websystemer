import React, { useState, useEffect } from "react";
import { Feature } from "ol";

interface PointFeatureFormProps {
  feature: Feature;
  onSave: (feature: Feature) => void;
  onClose: () => void; // ✅ Ny prop for lukking
}

//Mottagende info fra pop up
export function PointFeatureForm({
  feature,
  onSave,
  onClose,
}: PointFeatureFormProps) {
  const [featureName, setFeatureName] = useState(
    feature.get("featureName") || "",
  );
  const [color, setColor] = useState(feature.get("color") || "#ff0000");

  useEffect(() => {
    feature.setProperties({ featureName, color });
  }, [featureName, color, feature]);

  //Håndtering av lagring & lukk av pop up boks
  function handleSave() {
    onSave(feature);
    onClose();
  }

  return (
    <div className="popup-form">
      <h2>Legg inn punkt</h2>
      <div>
        Navn:
        <input
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
          type="text"
        />
      </div>
      <div>
        Farge:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <div className="popup-buttons">
        <button onClick={handleSave}>Lagre</button>
        <button onClick={onClose}>Lukk</button>
      </div>
    </div>
  );
}
