"use client";
import { actions } from "@/services/userService";
import React, { useState } from "react";

interface User {
  email: string;
  password: string;
  confpassword: string;
}

interface Error {
  email: string;
  password: string;
  confpassword: string;
}

interface SignupProps {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const Signup: React.FC<SignupProps> = ({ setAuth }) => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    confpassword: "",
  });
  const [error, setError] = useState<Error>({
    email: "",
    password: "",
    confpassword: "",
  });

  const [message, setMessage] = useState<string>("");

  async function handleSubmit(user: User) {
    const { email, password, confpassword } = user;

    if (!email) {
      setError({ ...error, email: "Veuillez renseigner un email" });
      return;
    }
    if (!password) {
      setError({ ...error, password: "Veuillez renseigner un mot de passe" });
      return;
    }
    if (!confpassword) {
      setError({
        ...error,
        confpassword: "Veuillez confirmer votre mot de passe",
      });
      return;
    }
    if (password !== confpassword) {
      setError({
        ...error,
        confpassword: "Les mots de passe ne correspondent pas",
      });
      return;
    }
    const response = await actions.register(user);

    if (response.success === false) {
      if (response?.message == "User already exists") {
        setError({
          ...error,
          email: "Cet utilisateur existe déjà, veuillez choisir un autre email",
        });
        return;
      } else {
        setError({ ...error, email: "Erreur lors de l'inscription" });
        return;
      }
    } else {
      setMessage("inscription réussie, redirection vers la page de connexion");
      setTimeout(() => {
        setMessage("");
        setAuth(false);
      }, 2000);
      return;
    }
  }

  return (
    <div className="p-4 col-span-12 bg-transparent rounded border border-stone-300 mx-2">
      <form action="" method="post" className="bg-violet-400">
        <input
          type="email"
          name=""
          placeholder="votre@mail.com"
          // className="w-full"
          className={`w-full border ${
            error.email ? "border-red-500" : "border-gray-300"
          }`}
          onChange={(e) => {
            setUser({ ...user, email: e.target.value });
            setError({ ...error, email: "" });
          }}
        />
        {error.email && <p>{error.email}</p>}
        <input
          type="password"
          name="password"
          placeholder="mot de passe"
          // className="w-full"
          className={`w-full ${
            error.password ? "border-red-500" : "border-gray-300"
          }`}
          onChange={(e) => {
            setUser({ ...user, password: e.target.value });
            setError({ ...error, password: "" });
          }}
        />
        {error.password && <p>{error.password}</p>}
        <input
          type="password"
          name="confpassword"
          placeholder="confirmer mot de passe"
          // className="w-full"
          className={`w-full ${
            error.confpassword ? "border-red-500" : "border-gray-300"
          }`}
          onChange={(e) => {
            setUser({ ...user, confpassword: e.target.value });
            setError({ ...error, confpassword: "" });
          }}
        />
        {error.confpassword && <p>{error.confpassword}</p>}
        <input
          type="submit"
          value="Inscrivez-vous!"
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(user);
          }}
        />
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => setAuth(false)}>
        Déjà inscrit? Connectez-vous!
      </button>
    </div>
  );
};

export default Signup;
