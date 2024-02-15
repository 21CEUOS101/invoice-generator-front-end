import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Forms } from "./Forms";
import { List } from "./List";
import { useState } from "react";

export function Home() {

    const [products , setProducts] = useState([
        {
        id : 1,
          name: "Apple",
          price: 5,
        },
        {
            id : 2,
          name: "Banana",
          price: 3,
        },
        {
            id : 3,
          name: "Blueberry",
          price: 6,
        },
        {
            id : 4,
          name: "Grapes",
          price: 7,
        },
        {
            id : 5,
          name: "Pineapple",
          price: 8,
        },
    ]);

    const [items , setItems] = useState([]);
    
  return (
    <div class="flex items-center justify-between">
    <div class="flex items-center space-x-8">
        <Forms products={products} items={items} setItems={setItems} setProducts={setProducts} />
        <List items={items} />
    </div>
    </div>

  );
}
