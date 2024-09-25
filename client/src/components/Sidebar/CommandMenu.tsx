import { Command } from "cmdk";
import { CirclePlus, Eye, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

export const CommandMenu = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  // Toggle le menu lorsque l'utilisateur appuie sur Cmd + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const logout = () => {
    localStorage.removeItem("user");
    toast.success(" 🥺 Déconnexion réussie");
    window.location.href = "/authentication";
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 bg-stone-950/50 z-30"
      onClick={() => setOpen(false)}
    >
      <div
        onSelect={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl border-stone-300 border overflow-hidden w-full max-w-lg mx-auto mt-12"
      >
        <Command.Input
          value={value}
          onValueChange={setValue}
          placeholder="Are you looking for something?"
          className="relative border-b border-stone-300 p-3 text-lg w-full placeholder:text-stone-400 focus:outline-none"
        />
        <Command.List className="p-3">
          <Command.Empty className="px-2">
            No result found for&nbsp;
            <span className="text-violet-500">"{value}"</span>
          </Command.Empty>

          <Command.Group
            heading="Databases"
            className="text-sm font-semibold  text-stone-400 p-2"
          >
            <Command.Item
              className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2"
              onSelect={() => {
                console.log("clicked");
                router.push("/database");
              }}
            >
              <CirclePlus />
              Add a Database
            </Command.Item>
            {/* <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <Eye />
              See All
            </Command.Item> */}
            <Command.Separator />
          </Command.Group>
          <Command.Group
            heading="Backups"
            className="text-sm font-semibold text-stone-400 p-2"
          >
            <Command.Item
              className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2"
              onSelect={() => router.push("/backup")}
            >
              <CirclePlus />
              Create a scheduled backup
            </Command.Item>
            {/* <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
              <Eye />
              See All
            </Command.Item> */}
            <Command.Separator />
          </Command.Group>
          <Command.Group
            heading="History"
            className="text-sm font-semibold text-stone-400 p-2"
          >
            <Command.Item
              className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 mb-2 rounded items-center gap-2"
              onSelect={() => router.push("/history")}
            >
              <Eye />
              See operations history
            </Command.Item>
            <Command.Separator />
          </Command.Group>

          <Command.Item
            className="flex cursor-pointer transition-colors p-2 text-sm text-stone-50 hover:bg-stone-700 bg-stone-900 rounded items-center gap-2"
            onSelect={() => logout()}
          >
            <LogOut />
            Sign Out
          </Command.Item>
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
