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
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";

const formSchema = z.object({
  id: z.string({
    message: "Please enter a valid id",
  }),
});

function DeleteProduct({ products, setProducts, refresh, setRefresh }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
    },
  });

  const deleteProduct = async (product) => {
    // check if the product already exists in the list
    const productExists = products.find((p) => p.id === product.id);
    const productDoc = doc(db, "products", product?.id);

    console.log(productDoc);
    if (productExists) {
      try {
        await deleteDoc(productDoc);
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
    let status = await deleteProduct(data);
    if (status) {
      toast({
        title: "Product deleted successfully",
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
            <CardTitle>Delete Product</CardTitle>
            <CardDescription>Delete the product details</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="flex items-center justify-between w-full">
              <div className="w-full mr-2">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormMessage />
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Product" />
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
              <Button type="submit">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default DeleteProduct;
