
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import InvoiceGenerator from "./InvoiceGenerator";

export function Forms({products , items , setItems , setProducts}) {
    
  return (
    <Tabs defaultValue="account" className="w-[800px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="bill">Bill</TabsTrigger>
        <TabsTrigger value="add">Add Product</TabsTrigger>
        <TabsTrigger value="update">Update Product</TabsTrigger>
      </TabsList>
      <TabsContent value="bill">
        <InvoiceGenerator products={products} items={items} setItems={setItems} setProducts={setProducts}/>
      </TabsContent>
      <TabsContent value="add">
        <AddProduct products={products} setProducts={setProducts} />
      </TabsContent>
      <TabsContent value="update">
        <UpdateProduct products={products} setProducts={setProducts}/>
      </TabsContent>
    </Tabs>
  );
}
