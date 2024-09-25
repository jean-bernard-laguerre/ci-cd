"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TopBar } from "./TopBar";

import AuthView from "./Views/AuthView";
import BackupView from "./Views/BackupView";
import DatabaseView from "./Views/DatabaseView";
import HistoryView from "./Views/HistoryView";
import SummaryView from "./Views/SummaryView";

export const Dashboard = () => {
  const pathname = usePathname();
  const [currentView, setCurrentView] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentView("authentication");
    } else if (pathname) {
      // On met à jour la vue actuelle en fonction du pathname, sécurisation si pathname est null
      const view = pathname.split("/")[1] || "dashboard";
      setCurrentView(view);
    }
  }, [pathname, isAuthenticated]);

  const renderContent = () => {
    switch (currentView) {
      case "authentication":
        return <AuthView />;
      case "history":
        return <HistoryView />;
      case "database":
        return <DatabaseView />;
      case "backup":
        return <BackupView />;
      default:
        return <SummaryView />;
    }
  };

  return (
    <div className="bg-white rounded-lg pb-4 shadow h-[100%]">
      <TopBar />
      {renderContent()}
    </div>
  );
};
