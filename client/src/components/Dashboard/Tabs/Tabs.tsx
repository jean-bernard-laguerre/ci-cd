"use client";

import { History } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BackupContent from "./BackupContent";
import RestoreContent from "./RestoreContent";

const Tabs = () => {
  // Etat pour gérer la tab sélectionnée
  const [selectedTab, setSelectedTab] = useState("history");
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (firstBtnRef.current) {
      firstBtnRef.current.focus();
    }
  }, []);

  const renderContent = () => {
    switch (selectedTab) {
      case "history":
        return <RestoreContent />;
      case "backup":
        return <BackupContent />;
      default:
        return <BackupContent />;
    }
  };

  return (
    <div className="p-4 col-span-12 bg-transparent rounded border border-stone-300 mx-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <History />
          History
        </h3>
      </div>
      <div className=" flex flex-col gap-y-1 w-full">
        {/* Tabs Navigation */}
        <div className="bg-violet-200 p-1 rounded-xl flex justify-center items-center text-sm w-1/3 space-x-2">
          <TabsButton
            title="Restore"
            onClick={() => setSelectedTab("history")}
            isActive={selectedTab === "history"}
            ref={firstBtnRef}
          />
          <TabsButton
            title="Backup"
            onClick={() => setSelectedTab("backup")}
            isActive={selectedTab === "backup"}
          />
        </div>

        {/* Tabs Content */}
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border w-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Composant de bouton de tab
const TabsButton = ({
  title,
  onClick,
  isActive,
  ref,
}: {
  title: string;
  onClick: () => void;
  isActive: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`outline-none w-full px-2 hover:bg-violet-400 rounded-xl text-center font-semibold text-white focus:ring-2 focus:ring-violet-500 focus:bg-white focus:text-violet-500 ${
        isActive ? "bg-violet-300" : ""
      }`}
    >
      {title}
    </button>
  );
};

export default Tabs;
