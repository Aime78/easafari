import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import OrdersTabCard from "../components/tabs/OrdersTabCard";
import StoresTabCard2 from "../components/tabs/livedb/StoresTabCard2";
import CategoriesTabCard2 from "../components/tabs/livedb/CategoriesTabCard2";
import ProductsTabCard2 from "../components/tabs/livedb/ProductsTabCard2";

const MarketPage = () => {
  const [activeTab, setActiveTab] = useState("stores");

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="font-bold text-2xl">Market Management</h1>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="stores">
          <StoresTabCard2 />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTabCard2 />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTabCard2 />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTabCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketPage;
