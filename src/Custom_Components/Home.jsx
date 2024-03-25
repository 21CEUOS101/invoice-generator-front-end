import { Button } from "@/components/ui/button";
import { Forms } from "./Forms";
import { List } from "./List";
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { AppContext } from "@/App";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AddCompany from "./AddCompany";

export function Home() {
  const { setIsLoggedIn ,setUser } = React.useContext(AppContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState();
  const productRef = collection(db,"products");
  const [refresh, setRefresh] = useState(false);
  const [items, setItems] = useState([]);
  let company = JSON.parse(localStorage.getItem("company"));
  const isCompany = (company !== undefined && company !== null) ? false : true;
  console.log(isCompany , company);
  
  const getProducts = async () => {
    await getDocs(productRef).then((response) => {
      const data = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    });
  }
  React.useEffect(() => {
    try {
      getProducts();
    }
    catch (error) {
      console.error("Error getting documents: ", error);
    }
  }, [refresh]);



  async function logOut() {
    try {
      await signOut(auth).then((response) => {
        localStorage.removeItem("user");
        localStorage.removeItem("company");
        setUser(null);
        setIsLoggedIn(false);
        navigate("/register");
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <Button
        className="absolute right-4 top-4 md:right-8 md:top-8"
        onClick={logOut}
      >
        LogOut
      </Button>
      <div className="flex flex-col items-center space-y-4">
        {isCompany && <AddCompany setRefresh={setRefresh} refresh={refresh} />}
        {!isCompany && <div className="flex items-center space-x-8">
          <Forms
            products={products}
            items={items}
            setItems={setItems}
            setProducts={setProducts}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          <List items={items} />
        </div>}
      </div>
    </div>
  );
}
