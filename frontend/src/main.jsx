import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Loading from "./Loading/Loading"
import Home from "./Home/Home"
import About from "./About/About"
import Login from "./Login/Login"
import Signup from "./Signup/Signup"
import Profile from "./Profile/Profile"
import ProtectedRoute from "./ProtectedRoute"
import AdminLogin from "./AdminLogin/AdminLogin"
import AdminDashboard from "./AdminDashboard/AdminDashboard"
import AddChallenges from "./AddChallenges/AddChallenges"
import Challenges from "./Challenges/Challenges"
import LeaderBoard from "./LeaderBoard/LeaderBoard"
import ViewTeams from "./ViewTeams/ViewTeams" 
import ViewIndividual from "./ViewIndividual/ViewIndividual"

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
      { path: "/admin/login", element: <AdminLogin /> },
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/add-challenge", element: <AddChallenges /> },
      { path: "/challenges", element: <Challenges/> },
      { path: "/leaderboard", element: <LeaderBoard /> },
      { path: "/admin/view-teams", element: <ViewTeams /> },
      { path: "/admin/view-individuals", element: <ViewIndividual /> }
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
