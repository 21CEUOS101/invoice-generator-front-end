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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const formSchema = z.object({
  id: z.string({
    message: "Please enter a valid id",
  }),
  name: z.string({
    message: "Please enter a valid name",
  }),
  price: z.string().transform((value) => parseFloat(value)), // Convert string to number
});

function UpdateProduct({ products, setProducts, refresh, setRefresh }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      price: 0,
    },
  });

  const updateProduct = async (product) => {
    // check if the product already exists in the list
    const productExists = products.find((p) => p.id === product.id);
    const productDoc = doc(db, "products", product?.id);
    if (productExists) {
      productExists.name = product.name;
      productExists.price = product.price;
      try {
        await updateDoc(productDoc , productExists);
        setRefresh((prev) => !prev);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    return false;
  };

  const onSubmit = async (data) => {
    let status = await updateProduct(data);

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

  const productOptions = products.map((product) => (
    <SelectItem key={product.id} value={product.id}>
      {product.name} - {product.price}
    </SelectItem>
  ));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Update Product</CardTitle>
            <CardDescription>Update the product details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="w-full mr-2">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormMessage />
                    <FormLabel>Id</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Products</SelectLabel>
                          {productOptions}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
