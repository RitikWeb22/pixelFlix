import { RouterProvider } from "react-router-dom";
import { router } from "./app.route";
import { AuthProvider } from "./features/auth/auth.context";
import "./features/shared/global.scss";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};
export default App;
