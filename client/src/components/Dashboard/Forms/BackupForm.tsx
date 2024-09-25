import { actions as connect } from "@/services/connectionService";
import { actions as dump } from "@/services/dumpService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BackupFormProps {
  handleCloseModal: () => void;
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

interface Task {
  Name: string;
  Cron_job: string;
  Connection_id: number;
}

export const BackupForm: React.FC<BackupFormProps> = ({ handleCloseModal }) => {
  const [databases, setDatabases] = useState<Databases | null>(null);
  const [task, setTask] = useState<Task>({
    Name: "",
    Cron_job: "0 6 * * *",
    Connection_id: 1,
  });
  const [formOk, setFormOk] = useState<boolean>(false);

  // modéles de cron avec valeurs par défaut et son équivallent en français
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

  async function getUserDatabase() {
    // get user databases
    const response = await connect.getUserConnections();
    console.log("response", response);
    if (response.success === false) {
      toast.error("An error occured while fetching connections:", {
        description: response.message,
      });
      console.log("erreur lors de la récupération des connections:", response);
      return;
    } else if (response.connections.length > 0) {
      console.log("response.connections", response.connections);
      setDatabases({ databases: response.connections });
    }
  }

  async function addTask() {
    const response = await dump.createTask(task);
    console.log("response", response);
    if (response.success === true) {
      toast.success("Task added successfully");

      handleCloseModal();
    } else {
      toast.error("An error occured while adding the task:", {
        description: response.message,
      });
    }
  }

  useEffect(() => {
    getUserDatabase();
  }, []);

  useEffect(() => {
    if (task.Name && task.Cron_job && task.Connection_id) {
      setFormOk(true);
    } else {
      setFormOk(false);
    }
  }, [task]);

  // Fonction pour déterminer la classe en fonction du type de base de données
  const getDbTypeClass = (dbType: string) => {
    switch (dbType.toLowerCase()) {
      case "postgres":
        return "bg-blue-200 text-blue-800";
      case "mysql":
        return "bg-green-200 text-green-800";
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Add New Task</h2>
      {databases ? (
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter task name"
              onChange={(e) => {
                setTask({ ...task, Name: e.target.value });
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Planned execution time
            </label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => {
                setTask({ ...task, Cron_job: e.target.value });
              }}
            >
              {CronModels.map((cron) => (
                <option key={cron.model} value={cron.model}>
                  {cron.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Source database
            </label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => {
                setTask({ ...task, Connection_id: Number(e.target.value) });
              }}
            >
              {databases?.databases.map((database) => (
                <option
                  key={database.Id}
                  value={database.Id}
                  className={getDbTypeClass(database.Db_type)}
                >
                  {database.Db_name} (type: {database.Db_type})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCloseModal}
              className="text-sm font-semibold bg-error-500 text-white p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formOk}
              className={`ml-2 text-sm font-semibold p-2 rounded ${
                formOk
                  ? "bg-success-cta-500 text-white"
                  : "bg-success-cta-400 border border-success-cta-600 text-stone-50 cursor-not-allowed"
              }`}
              onClick={(e) => {
                e.preventDefault();
                addTask();
              }}
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center text-sm">
          <span>
            No database found.
          </span>
          <span className="block mt-2">
            Please add a database before continuing.
          </span>
        </div>
      )}
    </div>
  );
};

export default BackupForm;
