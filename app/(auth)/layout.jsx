import { Suspense } from "react";

const AuthLayout = ({ children }) => {
  return;
  <div className="flex justify-center pt-20">
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
  </div>;
};

export default AuthLayout;
