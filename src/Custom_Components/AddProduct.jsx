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

const formSchema = z.object({
    id: z.string({
        message: "Please enter a valid id",
    }),
    name: z.string({
        message: "Please enter a valid name",
    }),
    price: z.string().transform(value => parseFloat(value)), // Convert string to number
});


function AddProduct({ products, setProducts }) {

    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            name: "",
            price : 0
        },
    });

    const addProduct = (product) => {
      
        // check if the product already exists in the list

        const productExists = products.find((p) => p.id === product.id);
        
        if (productExists) {
            return false;
        }

    setProducts([
      ...products,
      {
        id: product.id,
        name: product.name,
        price: parseInt(product.price),
      },
    ]);
        
    return true;
  };
    
    const onSubmit = (data) => {
        let status = addProduct(data);

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
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Id</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Id" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
