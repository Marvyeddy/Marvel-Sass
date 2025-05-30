import { SignUp } from "@clerk/nextjs";
import React from "react";

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center h-dvh">
      <SignUp />
    </div>
  );
};

export default RegisterPage;
