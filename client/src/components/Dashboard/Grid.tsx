import { StatCards } from "./StatCard";
import Tutorial from "./Tutorial";

export const Grid = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-12">
      <StatCards />
      <div className="col-span-12 mt-8">
        <Tutorial />
      </div>
    </div>
  );
};
