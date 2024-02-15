import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Axios from "axios";

function InvoiceGenerator({ items, setItems, products, setProducts }) {
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Select");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

    const submitInvoice = (e) => {
    e.preventDefault();
    // check if the username is empty
    if (username === "") {
      console.log("Please enter a username");
      toast({
        variant: "destructive",
        title: "Please enter a username",
        description: "Username is required",
      });
      return;
    }

    // check if the items list is empty
    if (items.length === 0) {
      console.log("Please add items to the invoice");
      toast({
        variant: "destructive",
        title: "Please add items to the invoice",
        description: "Items are required",
      });
      return;
    }

    // check if the payment method is not selected
    if (paymentMethod === "Select") {
      console.log("Please select a payment method");
      toast({
        variant: "destructive",
        title: "Please select a payment method",
        description: "Payment method is required",
      });
      return;
    }
        
        const T_products = items.map((item) => {
            return {
                id: item.item,
                name: item.name,
                price: products.find((product) => product.id === item.item).price,
                quantity: item.quantity,
                totalAmount: item.totalAmount,
            };
        });

    const data = {
      billDate : new Date().toLocaleDateString(),
        billNumber: Math.floor(Math.random() * 100000),
        products: T_products,
        username : username,
        paymentType: paymentMethod,
        transactionDetails : ""
    };
    console.log(data);
    setItems([]);
    setUsername("");
    setPaymentMethod("Select");
    setSelectedItem({
      id: "",
      name: "",
      price: 0,
    });
    generatePDF(data);
    console.log("Invoice Submitted");
  };
    
  async function generatePDF(data) {
    try {
      const response = await Axios.post("http://localhost:3000/generate-pdf", data, {
        responseType: 'blob' // Set the response type to blob
      });
  
      // Create a blob URL for the PDF
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
  
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
  
      // Programmatically click the anchor to trigger the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      // Return success
        toast({
            title: "Invoice Generated",
            description: "Invoice has been generated successfully",
        });

    } catch (error) {
      // Return error
        toast({
            variant: "destructive",
            title: "Invoice Generation Failed",
            description: "Invoice generation failed",
        });
    }
  }

  const productOptions = products.map((product) => (
    <SelectItem key={product.id} value={product.id}>
      {product.name} - {product.price}
    </SelectItem>
  ));

    const addItem = (item) => {
    if (item === undefined || item.id === null || item.id === "") {
      console.log("Please select a valid item");
      toast({
        variant: "destructive",
        title: "Please select a valid item",
        description: "Item is required",
      });
      return;
    }

    const price = products.find((product) => product.id === item).price;
    // check items if the item already exists in the list increase the quantity and total amount else add the item to the list
    const itemExists = items.find((i) => i.item === item);
    if (itemExists) {
      itemExists.quantity += 1;
      itemExists.totalAmount = itemExists.quantity * price;
      setItems([...items]);
    } else {
      setItems([
        ...items,
        {
          item,
          name: products.find((product) => product.id === item).name,
          quantity: 1,
          totalAmount: price,
        },
      ]);
    }
  };

    const [selectedItem, setSelectedItem] = useState({
        id: "",
        name: "",
        price: 0,
  });

  const handleSelectChange = (value) => {
    setSelectedItem(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice</CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Ashish Prajapati"
            onChange={handleUsernameChange}
            value={username}
          />
        </div>

        <div>
          <Label htmlFor="select-item">Select Item</Label>
          <div className="flex items-center space-x-5" id="select-item">
            <Select
              onValueChange={handleSelectChange}
              value={selectedItem.name}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Products</SelectLabel>
                  {productOptions}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={() => addItem(selectedItem)}>Add</Button>
          </div>
        </div>
        <div>
          <Label htmlFor="payment">Select Payment Method</Label>
          <div className="flex items-center space-x-5" id="payment">
            <Select
              onValueChange={(value) => handlePaymentMethodChange(value)}
              value={paymentMethod}
            >
              <SelectTrigger className="w-full">
                {paymentMethod ? (
                  <SelectValue>{paymentMethod}</SelectValue>
                ) : (
                  <SelectValue placeholder="Select" />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment Method</SelectLabel>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={submitInvoice}>
          Generate Invoice
        </Button>
      </CardFooter>
    </Card>
  );
}

export default InvoiceGenerator;
