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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  id: z.string({
    message: "Please enter a valid id",
  }),
  name: z.string({
    message: "Please enter a valid name",
  }),
  price: z.string().transform((value) => parseFloat(value)), // Convert string to number
});

function UpdateProduct({ products, setProducts }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      price: 0,
    },
  });

    const updateProduct = (product) => {
        // check if the product already exists in the list
        const productExists = products.find((p) => p.id === product.id);
        if (productExists) {
            productExists.name = product.name;
            productExists.price = product.price;
            setProducts([...products]);
            return true;
        }
        return false;
  };

  const onSubmit = (data) => {
    let status = updateProduct(data);

    if (status) {
      toast({
        title: "Product updated successfully",
        description: "Product details has been updated successfully",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Product doesn't exists",
        description: "Product with the given id doesn't exists in the list",
      });
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Update Product</CardTitle>
            <CardDescription>Update the product details</CardDescription>
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
                      <Input {...field} placeholder="Name your treasure" />
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
                      <Input {...field} placeholder="Valued at" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Update
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default UpdateProduct;
