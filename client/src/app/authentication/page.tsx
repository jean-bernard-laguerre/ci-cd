import { Dashboard } from "@/components/Dashboard/Dashboard";
import { Sidebar } from "@/components/Sidebar/Sidebar";

function Authentication() {
  return (
    <main className=" grid gap-4 p-4 grid-cols-[220px,_1fr] relative ">
      <Sidebar />
      <Dashboard />
    </main>
  );
}

export default Authentication;
