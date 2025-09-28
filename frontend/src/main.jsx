import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Loading from "./Loading/Loading"
import Home from "./Home/Home"
import About from "./About/About"
import Login from "./Login/Login"
import Signup from "./Signup/Signup"
import Profile from "./Profile/Profile"
import ProtectedRoute from "./ProtectedRoute"

const router = createBrowserRouter([
  {
    element: <Loading />, 
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/profile", element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )
        },
      
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
