import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import StoresTabCard from "../components/tabs/StoresTabCard";
import CategoriesTabCard from "../components/tabs/CategoriesTabCard";
import ProductsTabCard from "../components/tabs/ProductsTabCard";
import OrdersTabCard from "../components/tabs/OrdersTabCard";

const MarketPage = () => {
  const [activeTab, setActiveTab] = useState("stores");

  return (
    <div className="p-6 flex flex-col gap-6 border-b-2">
      <h1 className="font-bold text-2xl">Market Management</h1>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="stores">
          <StoresTabCard />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTabCard />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTabCard />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTabCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketPage;
