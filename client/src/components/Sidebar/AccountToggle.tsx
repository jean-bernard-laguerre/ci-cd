"use client";
import { ChevronsUpDownIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProfilImage from "../../app/images/profilImage.avif";

interface UserInfos {
  Id: number;
  Email: string;
}
export const AccountToggle = () => {
  const [storage, setStorage] = useState({} as UserInfos);
  const [name, setName] = useState("");

  useEffect(() => {
    setStorage(JSON.parse(localStorage.getItem("user") || "{}"));
  }, []);

  useEffect(() => {
    if (storage.Email) {
      setName(storage.Email.split("@")[0]);
    }
  }, [storage.Email]);
  return (
    <div className="border-b mb-4 pb-4 border-stone-300">
      <button className="flex items-center w-full p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 ">
        <Image
          src={ProfilImage}
          alt="avatar"
          className="size-8 rounded shrink-0 bg-violet-500 shadow"
        />
        <div className="text-start pl-1">
          {storage.Email ? (
            <>
              <p className="text-sm font-bold block">{name}</p>
              <p className="text-xs block text-stone-500">{storage.Email}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold block">Déconnecté</p>
              <p className="text-xs block text-stone-500">Connectez-vous</p>
            </>
          )}
        </div>
        <ChevronsUpDownIcon
          size={18}
          className="absolute right-2 top-1/4 text-stone-950"
        />
      </button>
    </div>
  );
};
