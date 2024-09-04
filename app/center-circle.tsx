import { Layer, Source } from "react-map-gl";
import { lineString as tLineString, length as tLength } from "@turf/turf";

import { Marker } from "./marker";

export function CenterCircle({
  latitude,
  longitude,
  features,
}: {
  latitude: number;
  longitude: number;
  features?: any;
}) {
  let radius = 25;

  if (features?.length > 0) {
    const line = tLineString([
      [longitude, latitude],
      ...features?.map((feature: any) => [
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1],
      ]),
    ]);
    radius = tLength(line) * 100;
  }

  return (
    <>
      <Source
        id={`Circle`}
        type="geojson"
        data={{
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
            },
          ],
        }}
      >
        <Layer
          id={`Point`}
          type="circle"
          paint={{
            "circle-color": "#000",
            "circle-opacity": 0.25,
            "circle-radius": radius,
            "circle-stroke-color": "#000",
            "circle-stroke-width": 2,
          }}
        />
      </Source>
      {features?.map((feature: any) => (
        <Marker
          key={feature.id}
          longitude={feature.geometry.coordinates[0]}
          latitude={feature.geometry.coordinates[1]}
          scale={1.25}
        />
      ))}
    </>
  );
}
