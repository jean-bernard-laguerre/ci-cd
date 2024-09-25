import React, { useEffect, useState } from "react";
import { ArchiveRestore, ChevronLeft, ChevronRight } from "lucide-react";
import { actions as historyAction } from "@/services/historyService";

interface History {
  Id: number;
  Name: string;
  Status: boolean;
  Action: string;
  Created_at: string;
  Bdd_source: number;
  Bdd_target: number;

  Bdd_source_type: string;
  Bdd_source_name: string;
  Bdd_target_name: string;
}

const RestoreContent = () => {
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState<History[]>();

  useEffect(() => {
    getHistory();
  }, [page]);

  async function getHistory() {
    const response = await historyAction.getAll(page, "restore");
    // verify if response is an error with the staus code
    if (response.success !== true) {
      console.log("erreur lors de la récupération des backups:", response);
      setHistory([]);
      return;
    }
    setHistory(response.history);
  }

  const handlenextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <table className="w-full table-auto">
      <TableHead></TableHead>
      <tbody>
        {history?.map((h, index) => (
          <TableRow key={h.Id} entry={h} order={index}></TableRow>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td className="text-sm text-stone-500 pt-3" colSpan={6}>
            <div className="flex justify-between items-center">
              <span>Page {page}</span>
              <div className="flex items-center space-x-1">
                <button
                  disabled={page === 1}
                  className="p-1 rounded border border-violet-500 bg-violet-400 items-center justify-center text-stone-50 disabled:opacity-50"
                  onClick={handlePrevPage}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={history?.length !== 10}
                  className="p-1 rounded border border-violet-500 bg-violet-400 items-center justify-center text-stone-50 disabled:opacity-50"
                  onClick={handlenextPage}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">Name</th>
        <th className="text-start p-1.5">Status</th>
        <th className="text-start p-1.5">Creation date</th>
        <th className="text-start p-1.5">Source database</th>
        <th className="text-start p-1.5">Target database</th>
        <th className="w-1"></th>
      </tr>
    </thead>
  );
};

const TableRow = ({ entry, order }: { entry: History; order: number }) => {
  const DateDisplay = new Date(entry.Created_at);
  const createdAtDisplay = DateDisplay.toLocaleString("en-UK", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const name = entry.Name.split("T");

  return (
    <tr className={order % 2 ? "bg-violet-100 text-sm" : "text-sm"}>
      <td className="text-start py-3 px-1.5 font-semibold">{name[0]}</td>
      <td className="text-start py-3 px-1.5">
        {entry.Status ? (
          <span className="bg-[#6df3d2] inline-block rounded-full w-20 text-center px-2 text-stone-950">
            Success
          </span>
        ) : (
          <span className="bg-[#f76287] inline-block rounded-full w-20 text-center px-2 text-stone-950">
            Error
          </span>
        )}
      </td>
      <td className="text-start py-3 px-1.5">{createdAtDisplay}</td>
      <td className="text-start py-3 px-1.5">{entry.Bdd_source_name}</td>

      <td className="text-start py-3 px-1.5">{entry.Bdd_target_name}</td>
    </tr>
  );
};

export default RestoreContent;
