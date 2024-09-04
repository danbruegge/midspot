import { Marker as GlMarker } from "react-map-gl";
import { twMerge } from "tailwind-merge";
import { MapPinIcon } from "@heroicons/react/20/solid";

export function Marker({
  className,
  longitude,
  latitude,
  scale,
}: {
  className?: string;
  longitude: number;
  latitude: number;
  scale?: number;
}) {
  const styles = twMerge("size-6 cursor-pointer text-primary", className);

  return (
    <GlMarker longitude={longitude} latitude={latitude}>
      <MapPinIcon scale={scale} className={styles} />
    </GlMarker>
  );
}
