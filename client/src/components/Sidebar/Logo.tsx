import Image from "next/image";
import LogoDB from "../../app/images/logodb.png";

const Logo = () => {
  return (
    <div className="flex items-center justify-start mb-3 hover:bg-violet-100 rounded">
      <Image src={LogoDB} alt="logo" />
      <div className="px-1 -space-y-1">
        <span className="font-logo font-bold italic text-xl block leading-tight">
          Dump&Dumber
        </span>
        <span className="text-[10px]  font-thin whitespace-nowrap block text-stone-700">
          Database backups for dummies
        </span>
      </div>
    </div>
  );
};

export default Logo;
