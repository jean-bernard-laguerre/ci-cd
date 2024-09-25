"use client";

import { Command, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandMenu } from "./CommandMenu";

export const Research = () => {
  const [isMac, setIsMac] = useState<boolean>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Détecte l'OS de l'utilisateur lors du rendu côté client
    const getOS = () => {
      if (typeof window !== "undefined") {
        const platform = window.navigator.platform.toLowerCase();
        if (platform.includes("mac")) return true; // macOS
      }
      return false; // Windows ou Linux
    };

    setIsMac(getOS());
  }, []);

  return (
    <>
      <div className="bg-stone-200 mb-4 relative rounded flex items-center px-2 py-1.5 text-sm cursor-pointer">
        <Search className="mr-2" />
        <input
          onFocus={(e) => {
            e.target.blur();
            setOpen(true);
          }}
          type="text"
          placeholder="Search"
          className="w-full bg-transparent placeholder:text-stone-400 focus:outline-none"
        />
        <span className="p-1 text-xs flex gap-0.5 items-center shadow bg-stone-50 rounded absolute right-1.5 top-18 text-stone-500 ">
          {isMac !== undefined && isMac ? (
            <>
              <Command size={12} className="mr-1 " /> + K
            </>
          ) : (
            <span>
              <span>Ctrl</span> + <span>K</span>
            </span>
          )}
        </span>
      </div>
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
};
