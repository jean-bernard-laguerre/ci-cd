"use client";
import { actions } from "@/services/userService";
import React, { useState } from "react";
import { toast } from "sonner";

interface User {
  email: string;
  password: string;
}

interface Error {
  email: string;
  password: string;
}

interface SignInProps {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignIn: React.FC<SignInProps> = ({ setAuth }) => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<Error>({
    email: "",
    password: "",
  });

  async function handleSubmit(user: User) {
    const { email, password } = user;

    if (!email) {
      console.log("Veuillez renseigner un email valide");
      setError({ ...error, email: "Veuillez renseigner un email" });
      return;
    }
    if (!password) {
      console.log("Veuillez renseigner un mot de passe");
      setError({ ...error, password: "Veuillez renseigner un mot de passe" });
      return;
    }

    const response = await actions.login(user);

    if (response.success == false) {
      if (response.message == "Invalid input") {
        console.log("email not found");
        setError({
          ...error,
          email: "Il y a eu un problème lors de la connection",
        });
        return;
      } else {
        console.log("vos informations sont incorrectes");
        setError({ ...error, password: "Informations incorrects" });
        return;
      }
    } else {
      delete response.user.Password;
      toast.success(" 👌 Vous êtes connecté!");
      localStorage.setItem("user", JSON.stringify(response.user));
      window.location.href = "/";
      return;
    }
  }
  return (
    <div className="p-4 col-span-12 bg-transparent rounded border border-stone-300 mx-2">
      <form action="post" className="bg-violet-400">
        <input
          type="text"
          placeholder="email"
          className="w-full"
          onChange={(e) => {
            setUser({ ...user, email: e.target.value });
            setError({ ...error, email: "" });
          }}
        />
        {error.email && <p>{error.email}</p>}

        <input
          type="password"
          placeholder="password"
          className="w-full"
          onChange={(e) => {
            setUser({ ...user, password: e.target.value });
            setError({ ...error, password: "" });
          }}
        />
        {error.password && <p>{error.password}</p>}

        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(user);
          }}
        >
          Se Connecter!
        </button>
      </form>
      <button onClick={() => setAuth(true)}>
        Pas de compte? Inscrivez-vous!
      </button>
    </div>
  );
};

export default SignIn;
