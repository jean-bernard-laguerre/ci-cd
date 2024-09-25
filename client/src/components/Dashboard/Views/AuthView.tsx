import { useState } from "react";
import SignIn from "../../Authentication/SignIn";
import Signup from "../../Authentication/Signup";
const AuthView = () => {
  const [toggleAuth, setToggleAuth] = useState<boolean>(false);
  return (
    <div>
      {toggleAuth ? (
        <Signup setAuth={setToggleAuth} />
      ) : (
        <SignIn setAuth={setToggleAuth} />
      )}
    </div>
  );
};

export default AuthView;
