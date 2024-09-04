import { type FormEvent, useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import { useGeolocation } from "./use-geolocation";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

interface LocationSearchProps {
  id: string;
  label: string;
  placeholder: string;
  selectItem: (feature: any) => void;
  shouldReset: boolean;
}

export function LocationSearch({
  id,
  label,
  placeholder,
  selectItem,
  shouldReset,
}: LocationSearchProps) {
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const { position, getPosition } = useGeolocation();

  useEffect(() => {
    getPosition();
  }, []);

  const apiParameter = [
    `q=${searchText}`,
    "autocomplete=false",
    position ? `proximity=${position.lng},${position.lat}` : null,
    `access_token=${mapboxToken}`,
  ];

  const { data } = useQuery({
    queryKey: ["search", searchText, position?.lat, position?.lng],
    queryFn: async ({ signal }) => {
      await sleep(300);

      if (!signal?.aborted) {
        return fetch(
          `https://api.mapbox.com/search/geocode/v6/forward?${apiParameter.filter(Boolean).join("&")}`,
        ).then((res) => res.json());
      }
    },
    enabled: !!searchText && searchText.length > 3,
  });

  useEffect(() => {
    setShowSuggestions(!!data?.features);
  }, [data?.features]);

  function handleSelect(feature: any) {
    selectItem(feature);
    setSearchText(feature.name);
    setShowSuggestions(false);
    setHasSelected(true);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    handleSelect(data?.features[0].properties);
  }

  function handleBlur() {
    setHasFocus(false);

    if (data?.features) {
      handleSelect(data?.features[0].properties);
    }
  }

  const handleCleanUp = useCallback(() => {
    selectItem(null);
    setSearchText("");
    setShowSuggestions(false);
    setHasSelected(false);
  }, [selectItem]);

  useEffect(() => {
    if (shouldReset) {
      handleCleanUp();
    }
  }, [handleCleanUp, shouldReset]);

  return (
    <form className="group relative sm:w-1/3" onSubmit={handleSubmit}>
      <label
        htmlFor={id}
        className="text-xs text-white/30 pl-1 group-focus-within:text-white/50"
      >
        {label}
      </label>
      <div className="flex items-center gap-2 mt-1 px-2.5 py-1.5 bg-white/10 rounded border-b border-white group-focus-within:border-primary">
        <input
          id={id}
          disabled={hasSelected}
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent focus:outline-none text-white disabled:text-white/50"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          onFocus={() => setHasFocus(true)}
          onBlur={handleBlur}
        />
        {searchText ? (
          <XMarkIcon
            className="size-6 hover:cursor-pointer"
            onClick={handleCleanUp}
          />
        ) : (
          <MagnifyingGlassIcon className="size-6" />
        )}
      </div>
      <ul
        className={twMerge(
          "absolute w-full overflow-hidden bg-black/50 z-10 rounded-b-xl border border-t-0 border-white/30",
          showSuggestions && hasFocus ? "h-auto" : "h-0", // necessary to get list element click events
        )}
      >
        {data?.features.map((feature: any) => (
          <li
            key={feature.geometry.coordinates.join(",")}
            className="flex flex-row gap-2 items-center py-2 px-1 border-b border-black/10 hover:border-primary hover:cursor-pointer hover:bg-white/10 text-white/80 hover:text-white last:rounded-b-xl"
            onClick={() => handleSelect(feature.properties)}
          >
            <MapPinIcon className="size-6 text-white/50" />
            <span className="flex-1 flex flex-col">
              <span>{feature.properties.name}</span>
              <span className="text-xs text-white/50">
                {feature.properties.place_formatted}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </form>
  );
}
