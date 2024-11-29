import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import YoutubeDocument from "@/pages/youtube-document";
import LoginPage from "@/pages/login";
import SignUpPage from "@/pages/signup";
import { ProtectedRoute } from "@/components/protected-route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/documents/:documentId",
    element: (
      <ProtectedRoute>
        <YoutubeDocument />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
]);
