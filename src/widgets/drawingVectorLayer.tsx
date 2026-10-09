import { FeatureLike } from "ol/Feature";
import { Fill, RegularShape, Stroke, Style, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

// hente punkter fra localStorage. Når brukeren trykker et sted.
export const drawingVectorSource = new VectorSource();
export const featuresAsJson = localStorage.getItem("features");
if (featuresAsJson) {
  drawingVectorSource.addFeatures(new GeoJSON().readFeatures(featuresAsJson));
}

// Lagre til localStorage når brukeren setter navn og farge.
drawingVectorSource.on("change", () => {
  const featuresAsJson = new GeoJSON().writeFeatures(
    drawingVectorSource.getFeatures(),
  );
  localStorage.setItem("Dine punkter", featuresAsJson);
});

// stilen for hvordan punktet skal se ut.
const drawingLayerStyle = (feature: FeatureLike) => {
  const { color = "white", featureName } = feature.getProperties();

  return new Style({
    image: new RegularShape({
      points: 4,
      radius: 10,
      angle: Math.PI / 4, //roterer for å få en firkant
      fill: new Fill({ color }),
      stroke: new Stroke({ color: "black", width: 2 }),
    }),
    // Legger til navnet som brukeren gir
    text: new Text({
      text: featureName,
      offsetY: 20,
      font: "bold 13pt Arial",
      stroke: new Stroke({ color: "white", width: 3 }),
      fill: new Fill({ color: "black" }),
    }),
  });
};

export const drawingVectorLayer = new VectorLayer({
  source: drawingVectorSource,
  style: drawingLayerStyle,
});
