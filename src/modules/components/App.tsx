import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import "./App.css";
import "ol/ol.css";
import { Layer } from "ol/layer";
import { AmkLayer } from "../layers/amkLayer";
import { FirestationLayer } from "../layers/FirestationLayer";
import { CivilDefenceLayer } from "../layers/CivilDefenceLayer";
import { PoliceDistrictLayer } from "../layers/policeDistrictLayer";
import { OverviewMiniMap } from "../layers/OverViewMiniMap";
import { AddPointButton } from "../../widgets/addPointButton";
import {
  drawingVectorLayer,
  drawingVectorSource,
} from "../../widgets/drawingVectorLayer";

useGeographic(); //Må bruke geografiske koordinater (ESPG: 4326)

const view = new View({ center: [11, 65.5], zoom: 5 });
const map = new Map({ view });

//Komponent for å vise kartet
function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    map.setTarget(mapRef.current!);
    return () => map.setTarget(undefined);
  }, []);
  return <div ref={mapRef}></div>;
}

//Hovedkomponenten for applikasjonen
export function App() {
  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
    drawingVectorLayer,
  ]);

  //oppdatere kartlaget ved tilstandsendringer
  useEffect(() => map.setLayers(layers), [layers]);

  //importeringer av komponenter i <nav>
  return (
    <>
      <header className="header">
        <h1>NORGES NØDETATER</h1>
        <p className="undertittel">
          Et oversiktskart over nødetaters ansvarsområder i Norge
        </p>
        <p className="filterhint">
          Bruk filterene under for å se ønsket informasjon på kartet.
        </p>
      </header>
      <nav>
        <OverviewMiniMap map={map} />
        <CivilDefenceLayer setLayers={setLayers} map={map} />
        <FirestationLayer setLayers={setLayers} map={map} />
        <AmkLayer setLayers={setLayers} map={map} />
        <PoliceDistrictLayer setLayers={setLayers} map={map} />
        <AddPointButton map={map} source={drawingVectorSource} />
      </nav>

      <MapView />
    </>
  );
}
