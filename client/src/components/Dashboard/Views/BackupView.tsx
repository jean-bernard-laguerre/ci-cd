import { actions as dump } from "@/services/dumpService";
import { Tooltip } from "@nextui-org/tooltip";
import { DatabaseBackup, Pause, Play, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BackupForm from "../Forms/BackupForm";
import Modal from "../Modal";

interface Backup {
  Id: number;
  Name: string;
  Cron_job: string;
  Db_name: string;
  Db_type: string;
  Created_at: string;
  Active: boolean;
  Connection_id: number;
}

interface Backups {
  backups: Backup[];
}

const BackupView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backups, setBackups] = useState<Backups | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //TODO: PILLS + legende

  async function getUserBackups() {
    // get user backups
    const response = await dump.getAll();
    console.log("response", response);
    if (response.success === false) {
      toast.error("An error occured while fetching backups:", {
        description: response.message,
      });

      return;
    } else if (response.data.length > 0) {
      console.log("response.tasks", response.data);
      setBackups({ backups: response.data });
    } else {
      setBackups(null);
    }
  }

  async function dumpDatabase(id: number) {
    const response = await dump.dump(id);
    console.log("response", response);
    if (response.success === true) {
      getUserBackups();
      toast.success("Backup completed successfully");
    } else {
      toast.error("An error occured during the database backup:", {
        description: response.message,
      });
    }
  }

  async function deleteTask(id: number) {
    const response = await dump.deleteTask(id);
    console.log("response", response);
    if (response.success === true) {
      toast.success("Task deleted successfully");
      getUserBackups();
    } else {
      toast.error("An error occured during the task suppression:", {
        description: response.message,
      });
    }
  }

  async function toggleTask(id: number, value: boolean) {
    const response = await dump.toggleTask(id, value);
    console.log("response", response);
    if (response.success === true) {
      toast.success("Task modified successfully");
      getUserBackups();
    } else {
      toast.error("An error occured during the task modification", {
        description: response.message,
      });
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      getUserBackups();
    }
  }, [isModalOpen]);

  useEffect(() => {
    console.log("backups", backups);
  }, [backups]);

  return (
    <div className="p-4 col-span-12 bg-transparent rounded border border-stone-300 mx-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
          <DatabaseBackup />
          BackUps
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
          content="Add a new backup"
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
      {backups ? (
        <table className="w-full table-auto">
          <TableHead></TableHead>
          <tbody>
            {backups.backups.map((backup, index) => (
              <TableRow
                key={index}
                id={backup.Id}
                name={backup.Name}
                cron={backup.Cron_job}
                dbName={backup.Db_name}
                dbType={backup.Db_type}
                createdAt={backup.Created_at}
                active={backup.Active}
                connectionId={backup.Connection_id}
                order={index + 1}
                toggleTask={toggleTask}
                dumpDatabase={dumpDatabase}
                deleteTask={deleteTask}
              ></TableRow>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-sm">
          <span>You have no scheduled backups currently.</span>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <BackupForm handleCloseModal={handleCloseModal} />
      </Modal>
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">Name</th>
        <th className="text-start p-1.5">Schedule</th>
        <th className="text-start p-1.5">Database name</th>
        <th className="text-start p-1.5">Creation date</th>
        <th className="text-start p-1.5">Action</th>
        <th className="w-1"></th>
      </tr>
    </thead>
  );
};

const TableRow = ({
  id,
  name,
  cron,
  dbName,
  dbType,
  createdAt,
  active,
  connectionId,
  order,
  toggleTask,
  dumpDatabase,
  deleteTask,
}: {
  id: number;
  name: string;
  cron: string;
  dbName: string;
  dbType: string;
  createdAt: string;
  active: boolean;
  connectionId: number;
  order: number;
  toggleTask: (id: number, value: boolean) => void;
  dumpDatabase: (id: number) => void;
  deleteTask: (id: number) => void;
}) => {
  const CronModels = [
    {
      name: "Every day at 6am",
      model: "0 6 * * *",
    },
    {
      name: "Every day at noon",
      model: "0 12 * * *",
    },
    {
      name: "Every day at 6pm",
      model: "0 18 * * *",
    },
    {
      name: "Every day at midnight",
      model: "0 0 * * *",
    },
    {
      name: "Every sunday at midnight",
      model: "0 0 * * 0",
    },
    {
      name: "Every minute",
      model: "* * * * *",
    },
    {
      name: "Every hour",
      model: "0 * * * *",
    },
    {
      name: "Every first day of the month at midnight",
      model: "0 0 1 * *",
    },
    {
      name: "Every first day of the year at midnight",
      model: "0 0 1 1 *",
    },
  ];
  // cronDisplay
  const cronDisplay = CronModels.find((model) => model.model === cron)?.name;

  const DateDisplay = new Date(createdAt);
  const createdAtDisplay = DateDisplay.toLocaleString("en-UK", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <tr className={order % 2 ? "bg-violet-100 text-sm" : "text-sm"}>
      <td className="text-start p-1.5">{name}</td>
      <td className="text-start p-1.5">{cronDisplay}</td>
      <td className="text-start p-1.5">
        <span
          className={
            dbType == "postgres"
              ? "px-2 py-1 w-[16px] bg-violet-400 rounded-full text-stone-100"
              : "bg-violet-600 px-2 py-1 w-[16px] rounded-full text-stone-200"
          }
        >
          {dbName}
        </span>
      </td>
      <td className="text-start p-1.5">{createdAtDisplay}</td>
      <td className="text-start p-1.5 flex">
        {active ? (
          <Tooltip
            closeDelay={0.5}
            showArrow
            content="Arrêter la tâche"
            placement="top"
            className="border border-stone-300 text-sm bg-slate-500 text-stone-50 rounded p-1 shadow-sm"
          >
            <button
              className="hover:bg-stone-200 transition-colors grid place-content-center rounded-full text-sm size-8"
              onClick={() => {
                toggleTask(id, false);
              }}
            >
              <Pause size={16} />
            </button>
          </Tooltip>
        ) : (
          <Tooltip
            closeDelay={0.5}
            showArrow
            content="Reprendre la tâche"
            placement="top"
            className="border border-stone-300 text-sm bg-slate-500 text-stone-50 rounded p-1 shadow-sm"
          >
            <button
              className="hover:bg-stone-200 transition-colors grid place-content-center rounded-full text-sm size-8"
              onClick={() => {
                toggleTask(id, true);
              }}
            >
              <Play size={16} />
            </button>
          </Tooltip>
        )}
        <Tooltip
          closeDelay={0.5}
          showArrow
          content="Sauvegarder"
          placement="top"
          className="border border-stone-300 text-sm bg-slate-500 text-stone-50 rounded p-1 shadow-sm"
        >
          <button
            className="hover:bg-stone-200 transition-colors grid place-content-center rounded-full text-sm size-8"
            onClick={() => {
              dumpDatabase(connectionId);
            }}
          >
            <Save size={16} />
          </button>
        </Tooltip>

        <Tooltip
          closeDelay={0.5}
          showArrow
          content="Supprimer"
          placement="top"
          className="border border-stone-300 text-sm bg-slate-500 text-stone-50 rounded p-1 shadow-sm"
        >
          <button
            className="hover:bg-stone-200 transition-colors grid place-content-center rounded-full text-sm size-8"
            onClick={() => {
              deleteTask(id);
            }}
          >
            <Trash2 size={16} />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default BackupView;
