import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Loading from "./Loading/Loading"
import Home from "./Home/Home"

const router = createBrowserRouter([
  {
    element: <Loading />, 
    children: [
      { path: "/", element: <Home /> },
      
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
