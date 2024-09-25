import { actions as connect } from "@/services/connectionService";
import { actions as dump } from "@/services/dumpService";
import { toast } from "sonner";
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

const RestoreForm = ({
  history,
  close,
}: {
  history: History;
  close: () => void;
}) => {
  const [restoreTarget, setRestoreTarget] = React.useState<number>(0);
  const [databases, setDatabases] = React.useState<Databases>();
  const [formOk, setFormOk] = React.useState<boolean>(false);

  async function getUserDatabase() {
    // get user databases
    const response = await connect.getUserConnections();
    console.log("response", response);
    if (response.success === false) {
      toast.error("An error occured while fetching databases:");
      return;
    } else if (response.connections.length > 0) {
      console.log("response.connections", response.connections);
      const filtered = response.connections.filter(
        (db: Database) =>
          db.Id !== history.Bdd_source && db.Db_type === history.Bdd_source_type
      );
      setDatabases({ databases: filtered });
    }
  }

  async function restoreDatabase() {
    const response = await dump.restore(history.Id, restoreTarget);
    console.log("response", response);
    if (response.success === true) {
      console.log("Successful restoration", response.message);
      toast.success("Restoration completed successfully");
      close();
    } else {
      console.log("An error occured during the restoration:", response);
      toast.error("An error occured during the restoration:", {
        description: response.message,
      });
    }
  }

  useEffect(() => {
    getUserDatabase();
  }, []);

  useEffect(() => {
    if (restoreTarget !== 0) {
      setFormOk(true);
    } else {
      setFormOk(false);
    }
  }, [restoreTarget]);

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">
        Restore {history.Bdd_source_name}
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">
          Select the target database
        </label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => {
            setRestoreTarget(parseInt(e.target.value));
          }}
        >
          <option value={0}>
            Select a database
          </option>
          {databases?.databases.map((database) => (
            <option key={database.Id} value={database.Id}>
              <span>
                {database.Db_name} (type: {database.Db_type})
              </span>
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={close}
          className="text-sm font-semibold bg-red-500 text-white p-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!formOk}
          className={`ml-2 text-sm font-semibold p-2 rounded ${
            formOk
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-stone-500 cursor-not-allowed"
          }`}
          onClick={(e) => {
            e.preventDefault();
            restoreDatabase();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default RestoreForm;
