"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Map, { type MapRef } from "react-map-gl";
import {
  point as tPoint,
  midpoint as tMidpoint,
  bbox as tBbox,
  lineString as tLineString,
} from "@turf/turf";
import type { Feature, GeoJsonProperties, Point } from "geojson";
import {
  EqualsIcon,
  MapPinIcon,
  NoSymbolIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import { CenterCircle } from "./center-circle";
import { Marker } from "./marker";
import { LocationSearch } from "./location-search/location-search";

import "mapbox-gl/dist/mapbox-gl.css";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type Location = {
  coordinates: {
    longitude: number;
    latitude: number;
  };
};

function useMapCenter(location1: Location | null, location2: Location | null) {
  const [mapCenter, setMapCenter] = useState<Feature<
    Point,
    GeoJsonProperties
  > | null>(null);

  useEffect(() => {
    if (location1 && location2) {
      setMapCenter(
        tMidpoint(
          tPoint([
            location1.coordinates.longitude,
            location1.coordinates.latitude,
          ]),
          tPoint([
            location2.coordinates.longitude,
            location2.coordinates.latitude,
          ]),
        ),
      );
    } else {
      setMapCenter(null);
    }
  }, [location1, location2]);

  return mapCenter;
}

function getZoom(mapRef: MapRef, location1: Location, location2: Location) {
  const bbox = tBbox(
    tLineString([
      [location1.coordinates.longitude, location1.coordinates.latitude],
      [location2.coordinates.longitude, location2.coordinates.latitude],
    ]),
  ) as [number, number, number, number];
  const { zoom } = mapRef.cameraForBounds(bbox, {
    padding: 100,
  }) as { zoom: number };

  return zoom;
}

const INITIAL_VIEW_STATE = {
  longitude: 9.0,
  latitude: 53.0,
  zoom: 5,
};

export function MapView() {
  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [center, setCenter] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [location1, setLocation1] = useState<Location | null>(null);
  const [location2, setLocation2] = useState<Location | null>(null);
  const mapCenter = useMapCenter(location1, location2);

  useEffect(() => {
    if (mapCenter && mapRef.current) {
      setCenter({
        longitude: mapCenter.geometry.coordinates[0],
        latitude: mapCenter.geometry.coordinates[1],
      });

      if (location1 && location2) {
        setViewState({
          longitude: mapCenter.geometry.coordinates[0],
          latitude: mapCenter.geometry.coordinates[1],
          zoom: getZoom(mapRef.current, location1, location2),
        });
      }
    }
  }, [location1, location2, mapCenter]);

  const apiParameter = [
    `longitude=${center?.longitude}`,
    `latitude=${center?.latitude}`,
    "types=address",
    "limit=5",
    `access_token=${mapboxToken}`,
  ].join("&");

  const { data } = useQuery({
    queryKey: ["geocoding", apiParameter],
    queryFn: () =>
      fetch(
        `https://api.mapbox.com/search/geocode/v6/reverse?${apiParameter}`,
      ).then((res) => res.json()),
    enabled: !!center,
  });

  function handleReset() {
    setCenter(null);
    setViewState(INITIAL_VIEW_STATE);
    setLocation1(null);
    setLocation2(null);
  }

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="w-full flex flex-col sm:flex-row justify-evenly items-center gap-4 sm:gap-0">
        <LocationSearch
          id="location-search-1"
          label="Location 1"
          placeholder="Enter location name"
          selectItem={setLocation1}
          shouldReset={location1 === null}
        />
        <EqualsIcon className="size-8" />
        <LocationSearch
          id="location-search-2"
          label="Location 2"
          placeholder="Enter location name"
          selectItem={setLocation2}
          shouldReset={location2 === null}
        />
      </div>
      <div className="rounded-3xl overflow-hidden">
        <Map
          ref={mapRef}
          {...viewState}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={mapboxToken}
          attributionControl={false}
          reuseMaps
          style={{ width: "70vw", height: "40vh" }}
          boxZoom={false}
          doubleClickZoom={false}
          dragPan={false}
          dragRotate={false}
          keyboard={false}
          scrollZoom={false}
          touchPitch={false}
          touchZoomRotate={false}
        >
          {location1 ? (
            <Marker
              className="text-white/75"
              longitude={location1.coordinates.longitude}
              latitude={location1.coordinates.latitude}
            />
          ) : null}
          {location2 ? (
            <Marker
              className="text-white/75"
              longitude={location2.coordinates.longitude}
              latitude={location2.coordinates.latitude}
            />
          ) : null}
          {mapCenter ? (
            <CenterCircle
              longitude={mapCenter.geometry.coordinates[0]}
              latitude={mapCenter.geometry.coordinates[1]}
              features={data?.features}
            />
          ) : null}
        </Map>
      </div>
      {mapCenter ? (
        <ul className="w-[70vw] flex flex-wrap gap-4 justify-evenly">
          {data?.features.length > 0
            ? data?.features.map((feature: any) => (
                <li
                  key={feature.geometry.coordinates.join(",")}
                  className="flex gap-4 items-center px-4 py-2 bg-white/10 text-white/90 rounded-xl border border-white/10"
                >
                  <MapPinIcon className="size-6 text-primary" />
                  <span className="flex flex-col gap-0">
                    <span>{feature.properties.name}</span>
                    <span className="flex flex-row text-white/50 text-sm">
                      {feature.properties.place_formatted}
                    </span>
                  </span>
                </li>
              ))
            : null}
          {data?.features.length === 0 ? (
            <li className="flex gap-4 items-center px-4 py-2 bg-white/10 text-white/90 rounded-xl border border-white/10">
              <NoSymbolIcon className="size-6 text-primary" />
              <span>No locations found</span>
            </li>
          ) : null}
        </ul>
      ) : null}
      <button
        className="flex justify-center items-center gap-1 rounded-md bg-white/10 px-2.5 py-1.5 text-white shadow-sm hover:bg-primary/80"
        onClick={handleReset}
      >
        <XMarkIcon className="size-5" /> Reset Map
      </button>
    </div>
  );
}
