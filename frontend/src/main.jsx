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
import HowItWorks from "./HowItWorks/HowItWorks"
import Txt from "./Webchallenge1/Txt"
import Foundout from "./Webchallenge1/Foundout"
import DocPage from "./WebChallenge2/DocPage"
import NextPage from "./WebChallenge2/NextPage"

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
      { path: "/admin/view-individuals", element: <ViewIndividual /> },
      { path: "/howitworks", element: <HowItWorks /> },
    ],
  },
  { path: "/aliens", element: <Txt /> },
  { path: "/70r3hnanldfspufdsoifnlds", element: <Foundout /> },
  { path: "/doc/:id", element: <DocPage /> },
  { path: "/doc/:id/next", element: <NextPage /> },
])

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
