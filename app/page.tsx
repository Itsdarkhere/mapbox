'use client'
import VenueMap from "@/components/VenueMap";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h3>MAPBOX</h3>
      <div className=" max-w-7xl w-full max-h-7xl h-full bg-zinc-400 rounded-lg">
        <VenueMap tilesetId="jxvonen.abd48zpt"/>
      </div>
    </div>
  );
}
