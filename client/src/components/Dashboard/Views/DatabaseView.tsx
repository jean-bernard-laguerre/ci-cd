import { actions } from "@/services/connectionService";
import { actions as dump } from "@/services/dumpService";
import { Tooltip } from "@nextui-org/tooltip";
import { ArrowDownToLine, DatabaseZap, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DatabaseForm } from "../Forms/DatabaseForm";
import Modal from "../Modal";

interface User {
  id: number;
  email: string;
}

interface Database {
  Id: number;
  Name: string;
  Db_name: string;
  Db_type: string;
  Host: string;
  Port: number;
}

// interface de databases contenant un array de Database
interface Databases {
  databases: Database[];
}

const DatabaseView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [databases, setDatabases] = useState<Databases | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  async function getUserDatabase() {
    const response = await actions.getUserConnections();
    if (response.success === false) {
      return;
    } else if (response.connections.length > 0) {
      setDatabases({ databases: response.connections });
    } else {
      setDatabases(null);
    }
  }

  async function dumpDatabase(id: number) {
    const response = await dump.dump(id);
    if (response.success === true) {
      toast.success("Backup completed successfully");
    } else {
      toast.error("An error occured during the database backup", {
        description: response.message,
      });
    }
  }

  async function deleteDatabase(id: number) {
    const response = await actions.deleteConnection(id);
    if (response.success === true) {
      toast.success("Database connection deleted successfully");
      getUserDatabase();
    } else {
      toast.error("An error occured during the database connection deletion ", {
        description: response.message,
      });
    }
  }

  useEffect(() => {
    getUserDatabase();
  }, [isModalOpen]);

  return (
    <div className="p-4 col-span-12 bg-transparent rounded border border-stone-300 mx-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <DatabaseZap />
          Database Connection
        </h3>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <div className="w-10 h-4 bg-violet-400 rounded-full"></div>
            <span className="text-sm font-semibold text-stone-600">
              Postgres
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-10 h-4 bg-violet-600 rounded-full"></div>
            <span className="text-sm font-semibold text-stone-600">MySQL</span>
          </div>
        </div>

        <Tooltip
          content="Add a new database"
          placement="left"
          showArrow
          className="border border-slate-300 text-sm bg-slate-500 text-stone-50 rounded p-1 shadow-sm"
        >
          <button
            onClick={handleOpenModal}
            className="text-sm font-semibold bg-violet-400 text-stone-50 p-1 rounded border  border-violet-500"
          >
            Add +
          </button>
        </Tooltip>
      </div>

      {databases ? (
        <table className="w-full table-auto">
          <TableHead></TableHead>
          <tbody>
            {databases.databases.map((database, index) => (
              <TableRow
                key={database.Id}
                id={database.Id}
                dbName={database.Db_name}
                type={database.Db_type}
                host={database.Host}
                port={database.Port}
                name={database.Name}
                order={index + 1}
                dumpDatabase={dumpDatabase}
                deleteDatabase={deleteDatabase}
              ></TableRow>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-sm">
          <span>
            You have no saved database.
          </span>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <DatabaseForm handleCloseModal={handleCloseModal} />
      </Modal>
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">Database name</th>
        <th className="text-start p-1.5">Type</th>
        <th className="text-start p-1.5">Host</th>
        <th className="text-start p-1.5">Port</th>
        <th className="text-start p-1.5">Custom name</th>
        <th className="w-1"></th>
      </tr>
    </thead>
  );
};

const TableRow = ({
  id,
  dbName,
  type,
  host,
  port,
  name,
  order,
  dumpDatabase,
  deleteDatabase,
}: {
  id: number;
  dbName: string;
  type: string;
  host: string;
  port: number;
  name: string;
  order: number;
  dumpDatabase: (id: number) => void;
  deleteDatabase: (id: number) => void;
}) => {
  return (
    <tr className={order % 2 ? "bg-violet-100 text-sm" : "text-sm "}>
      <td className="p-1.5">{dbName}</td>
      <td className="p-1.5">
        <span
          className={
            type == "postgres"
              ? "px-2 py-1 w-[16px] bg-violet-400 rounded-full text-stone-100"
              : "bg-violet-600 px-2 py-1 w-[16px] rounded-full text-stone-200"
          }
        >
          {type}
        </span>
      </td>
      <td className="p-1.5">{host}</td>
      <td className="p-1.5">{port}</td>
      <td className="p-1.5">{name}</td>
      <td className="p-1.5 flex gap-2">
        <Tooltip
          showArrow
          content="Sauvegarder"
          placement="left"
          className="border border-slate-300 text-sm bg-slate-500 text-stone-50 rounded p-1 shadow-sm"
        >
          <button
            className="hover:bg-stone-200 transition-colors grid place-content-center rounded text-sm size-8"
            onClick={() => {
              dumpDatabase(id);
            }}
          >
            <ArrowDownToLine size={16} />
          </button>
        </Tooltip>

        <Tooltip
          showArrow
          content="Supprimer"
          placement="left"
          className="border border-slate-300 text-sm bg-slate-500 text-stone-50 rounded p-1 shadow-sm"
        >
          <button
            className="hover:bg-stone-200 transition-colors grid place-content-center rounded text-sm size-8"
            onClick={() => {
              deleteDatabase(id);
            }}
          >
            <Trash2 size={16} />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default DatabaseView;
