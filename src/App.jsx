import { createContext, useEffect, useState } from "react";
import { Home } from "./Custom_Components/Home";
import Auth from "./Custom_Components/Auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Login } from "./Custom_Components/Login";
import { auth } from "./config/firebase";

export const AppContext = createContext();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  console.log(auth?.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn , user , setUser }}>
      <div className="flex justify-center items-center h-screen">
        <Router>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Home /> : <Login/>} />
            <Route path="/register" element={<Auth />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </AppContext.Provider>
  );
}
