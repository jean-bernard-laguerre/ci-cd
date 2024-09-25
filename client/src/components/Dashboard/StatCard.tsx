"use client";
import { actions as connecActions } from "@/services/connectionService";
import { actions as historyAction } from "@/services/historyService";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Database, DatabaseBackup, History } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

// Enregistre les composants de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Définition des types pour les props du composant Card
interface CardProps {
  title: string;
  data: ChartData;
  icon?: React.ReactNode;
}

interface CardPropsDb {
  title: string;
  data: number;
  icon?: React.ReactNode;
  nbMysql: number;
  nbPostgres: number;
}

// Type pour les données du graphique
interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }>;
}

interface BarData {
  dataPoint: number;
}

interface DatabaseInterface {
  Id: number;
  Name: string;
  Db_name: string;
  Db_type: string;
  Host: string;
  Port: number;
}

// interface de databases contenant un array de Database
interface Databases {
  databases: DatabaseInterface[];
}

interface Overview {
  Total: number;
  backup_success: number;
  backup_fail: number;
  restore_success: number;
  restore_fail: number;
}

export const StatCards: React.FC = () => {
  const [databases, setDatabases] = useState<Databases | null>(null);
  const [nbDatabases, setNbDatabases] = useState<number>(0);
  const [nbMysql, setNbMysql] = useState<number>(0);
  const [nbPostgres, setNbPostgres] = useState<number>(0);

  async function getUserDatabase() {
    // get user databases
    const response = await connecActions.getUserConnections();
    console.log("response", response);
    if (response.success === false) {
      console.log("erreur lors de la récupération des connections:", response);
      return;
    } else if (response.connections.length > 0) {
      console.log("response.connections", response.connections);
      setDatabases({ databases: response.connections });
    } else {
      setDatabases(null);
    }
  }

  useEffect(() => {
    getUserDatabase();
  }, []);

  useEffect(() => {
    if (databases) {
      setNbDatabases(databases.databases.length);
      setNbMysql(
        databases.databases.filter((db) => db.Db_type === "mysql").length
      );
      setNbPostgres(
        databases.databases.filter((db) => db.Db_type === "postgres").length
      );
    }
  }, [databases]);

  useEffect(() => {
    console.log("nbDatabases", nbDatabases);
    console.log("nbMysql", nbMysql);
    console.log("nbPostgres", nbPostgres);
  }, [nbDatabases, nbMysql, nbPostgres]);

  const [overview, setOverview] = React.useState<Overview>();

  useEffect(() => {
    getOverview();
  }, []);

  const getOverview = async () => {
    const response = await historyAction.getOverview();
    if (response.success !== true) {
      console.log("erreur lors de la récupération des backups:", response);
      return;
    }
    setOverview(response.overview);
  };

  return (
    <>
      {overview && (
        <>
          <Card
            icon={<DatabaseBackup />}
            title="Backups"
            data={createChartData(
              [overview?.backup_success, overview?.backup_fail],
              ["Completed", "Failed"]
            )}
          />
          <Card
            icon={<History />}
            title="Restorations"
            data={createChartData(
              [overview?.restore_success, overview?.restore_fail],
              ["Completed", "Failed"]
            )}
          />
        </>
      )}
      {/* <Card
        icon={<DatabaseBackup />}
        title="Backups"
        data={createChartData([60, 40], ["Success", "Failed"])}
      />
      <Card
        icon={<History />}
        title="Restores"
        data={createChartData([80, 20], ["Completed", "Failed"])}
      /> */}
      <CardDb
        icon={<Database />}
        title="Databases"
        data={nbDatabases}
        nbMysql={nbMysql}
        nbPostgres={nbPostgres}
      />
    </>
  );
};

const Card: React.FC<CardProps> = ({ icon, title, data }) => {
  return (
    <div
      // className={` p-4 rounded border border-stone-200 shadow-md col-span-${colSpan}`}
      className="p-4 rounded border border-stone-200 shadow-md col-span-4"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <Pie data={data} />
    </div>
  );
};

const CardDb: React.FC<CardPropsDb> = ({
  icon,
  title,
  data,
  nbMysql,
  nbPostgres,
}) => {
  return (
    <div className="p-4 rounded border border-stone-200 shadow-md col-span-4">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <DatabaseDisplay dataPoint={data} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mt-20">
          <div className="w-12 h-4 bg-violet-200 rounded-full"></div>
          <span className="text-lg font-semibold">{nbMysql}</span>
          <span className="text-lg font-semibold text-stone-800 ">MySQL</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-4 bg-violet-500 rounded-full"></div>

          <span className="text-lg font-semibold ">{nbPostgres}</span>
          <span className="text-lg font-semibold text-stone-800 ">
            Postgres
          </span>
        </div>
      </div>
    </div>
  );
};

// Fonction pour créer les données du graphique
const createChartData = (dataPoints: number[], labels: string[]): ChartData => {
  return {
    labels: labels,
    datasets: [
      {
        data: dataPoints,
        backgroundColor: ["#e0d6fe", "#673aed"], // Couleurs pour les segments
        borderWidth: 1,
      },
    ],
  };
};

const DatabaseDisplay: React.FC<BarData> = ({ dataPoint }) => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <span className="text-[100px] font-bold">{dataPoint}</span>
      <span className="text-sm text-gray-500">Databases</span>
    </div>
  );
};
