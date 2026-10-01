"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export function SearchBarHero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      router.push("/parts");
      return;
    }
    router.push(`/parts?query=${encodeURIComponent(searchTerm.trim())}`);
  };

  const quickSearches = [
    { label: "Brake Pads", query: "Brake Pad" },
    { label: "Shock Absorbers", query: "Shock Absorber" },
    { label: "Air Filter", query: "Air Filter" },
    { label: "Iridium Spark Plugs", query: "Iridium" },
    { label: "Toyota Land Cruiser", query: "Land Cruiser" },
    { label: "Nissan Patrol", query: "Patrol" },
    { label: "Brembo Rotors", query: "Brembo" },
  ];

  return (
    <div className="max-w-4xl mx-auto -mt-6 sm:-mt-8 px-4 sm:px-6 relative z-20">
      <div className="rounded-2xl sm:rounded-3xl glass-card border border-white/95 p-4 sm:p-5 shadow-2xl">
        <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#16834b]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by part name, OEM number (e.g. BP-4821) or car model..."
              className="w-full h-13 pl-12 pr-4 rounded-xl border border-white/90 bg-white/70 backdrop-blur-md text-sm sm:text-base text-[#111412] placeholder:text-[#68706b]/70 focus:bg-white focus:border-[#16834b] focus:outline-none focus:ring-4 focus:ring-[#16834b]/15 transition-all font-medium shadow-inner"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto h-13 px-7 text-sm font-semibold rounded-xl shrink-0 shadow-lg shadow-[#16834b]/20"
          >
            <span>Search Parts</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-3.5 pt-3 border-t border-[rgba(17,20,18,0.06)] flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
          <span className="text-[#68706b] font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-[#16834b]" />
            Trending:
          </span>
          {quickSearches.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => router.push(`/parts?query=${encodeURIComponent(item.query)}`)}
              className="px-2.5 py-1 rounded-lg glass-pill hover:border-[#16834b]/40 hover:text-[#0d6338] text-[#111412]/80 font-medium transition-all"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
