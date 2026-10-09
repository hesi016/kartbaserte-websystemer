import { useEffect } from "react";
import OverviewMap from "ol/control/OverviewMap";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

//Mini kart i venstre hjørne. Henter komponent
export function OverviewMiniMap({ map }: { map: any }) {
  useEffect(() => {
    const overviewControl = new OverviewMap({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      collapsed: false,
    });

    map.addControl(overviewControl); //Gir tilgang til hovedkartet

    //fjerner komponenten dersom map endres
    return () => {
      map.removeControl(overviewControl);
    };
  }, [map]);

  return null;
}
