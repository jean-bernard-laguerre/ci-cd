import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserInfos {
  Id: number;
  Email: string;
}
export const TopBar = () => {
  const [storage, setStorage] = useState({} as UserInfos);
  const [userName, setUserName] = useState("");
  const logout = () => {
    localStorage.removeItem("user");
    toast.success(" 🥺 Déconnexion réussie");
    window.location.href = "/authentication";
  };

  useEffect(() => {
    setStorage(JSON.parse(localStorage.getItem("user") || "{}"));
  }, []);

  useEffect(() => {
    if (storage.Email) {
      setUserName(storage.Email.split("@")[0]);
    }
  }, [storage.Email]);

  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-2 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          {!storage.Email ? (
            <span className="text-sm font-bold block">
              🚀 Hey Salut, merci de vous connecter!
            </span>
          ) : (
            <span className="text-sm font-bold block">
              🚀 Hey Salut, {userName.toUpperCase()}!
            </span>
          )}
          <span className="text-xs block text-stone-900">
            {date.charAt(0).toUpperCase() + date.slice(1)}
          </span>
        </div>
        {storage.Email && (
          <div>
            <button
              className="flex cursor-pointer transition-colors p-2 text-xs text-stone-50 hover:bg-stone-700 bg-stone-900 rounded items-center gap-2"
              onClick={() => logout()}
            >
              <LogOut size={12} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
