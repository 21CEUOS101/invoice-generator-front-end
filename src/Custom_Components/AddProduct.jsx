import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/config/firebase";

const formSchema = z.object({
    name: z.string({
        message: "Please enter a valid name",
    }),
    price: z.string().transform(value => parseFloat(value)), // Convert string to number
});


function AddProduct({ products, setRefresh , refresh }) {

    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            price : 0
        },
    });

    const addProduct = async (product) => {
      
        // check if the product already exists in the list

        const productExists = products.find((p) => p.name === product.name);
        
        if (productExists) {
            return false;
        }
      const productsRef = collection(db, "products");
      try {
        await addDoc(productsRef, product).then((response) => {
          console.log("Document written with ID: ", response.id);
          setRefresh((prev) => !prev);
        });
      }
      catch (error) {
        console.error("Error adding document: ", error);
      }
        
    return true;
  };
    
    const onSubmit = async (data) => {
        let status = await addProduct(data);

        if (status)
        {
            toast({
                title: "Product added successfully",
                description: "Product has been added to the list",
            });
        }
        else
        {
            toast({
                variant: "destructive",
                title: "Product already exists",
                description: "Product with the same id already exists in the list",
            });
        }

        form.reset();
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>Add new product to the list.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name your treasure"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Valued at"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Add
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default AddProduct;
