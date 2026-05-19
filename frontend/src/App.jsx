import { useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";

import AuthLoader from "./components/auth/AuthLoader";

import FullScreenLoader from "./components/common/FullScreenLoader";

function App() {

  const { isAuthLoading } =
    useSelector(
      (state) => state.auth
    );

  return (
    <>
      <AuthLoader />

      {isAuthLoading ? (
        <FullScreenLoader />
      ) : (
        <AppRoutes />
      )}
    </>
  );
}

export default App;