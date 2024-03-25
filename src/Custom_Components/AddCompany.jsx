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
  company_name: z.string().min(1),
  contact_no: z.string().min(1),
  company_address: z.string().min(1),
  company_gst: z.string().min(1),
});

function AddCompany({ setRefresh, refresh }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      contact_no: "",
      company_address: "",
      company_gst: "",
    },
  });

  const onSubmit = async (data) => {
    localStorage.setItem("company", JSON.stringify(data));

    if (localStorage.getItem("company") !== null) {
      toast({
        title: "Company added to LocalStorage successfully",
        description: "Please Don't close the browser to keep the data saved.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again.",
      });
    }

    setRefresh((prev) => !prev);
    form.reset();
  };

  let formfields = [
    {
      name: "company_name",
      label: "Company Name",
      type: "text",
      placeholder: "Enter Company Name",
    },
    {
      name: "contact_no",
      label: "Contact Number",
      type: "text",
      placeholder: "Enter Contact Number",
    },
    {
      name: "company_address",
      label: "Company Address",
      type: "text",
      placeholder: "Enter Company Address",
    },
    {
      name: "company_gst",
      label: "Company GST",
      type: "text",
      placeholder: "Enter Company GST",
    },
  ];

  const formfieldsmap = formfields.map((data, index) => (
    <div className="py-2 w-full px-2" key={index}>
      <FormField
        control={form.control}
        name={data?.name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{data?.label}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={data?.placeholder} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  ));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Add Company</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 px-4">{formfieldsmap}</CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default AddCompany;
