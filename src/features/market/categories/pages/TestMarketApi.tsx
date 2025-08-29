import { useState, useEffect } from "react";
import { marketApi } from "../services/marketApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const defaultProduct = {
  name: "",
  description: "",
  price: "0",
  sub_category_id: "1",
  rating: "4",
  quantity: "30",
  discount: "0",
};

const TestMarketApi = () => {
  const [myCategories, setMyCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [mySubCategories, setMySubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    category_id: "1",
  });

  const [newProduct, setNewProduct] = useState(defaultProduct);

  useEffect(() => {
    async function fetchMyCategories() {
      const categories = await marketApi.getMyCategories();
      setMyCategories(categories);
    }

    fetchMyCategories();
  }, []);

  useEffect(() => {
    async function fetchMySubcategories() {
      const subCategories = await marketApi.getMySubCategories();
      setMySubCategories(subCategories);
    }

    fetchMySubcategories();
  }, []);

  const createCategory = async () => {
    if (newCategory.trim() === "") return;

    const formData = new FormData();

    formData.append("name", newCategory);

    const response = await marketApi.createCategory(formData);

    console.log("api response after creating cat: ", response);

    setNewCategory("");
  };

  const createSubCategory = async () => {
    const formData = new FormData();
    formData.append("name", newSubCategory.name);
    formData.append("category_id", newSubCategory.category_id);

    const response = await marketApi.createSubCategories(formData);
    console.log(response, "added");

    setNewSubCategory({
      name: "",
      category_id: "1",
    });
  };

  const createProduct = async () => {
    if (newProduct.name === "" || newProduct.description === "") {
      return;
    }

    const formData = new FormData();

    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("sub_category_id", newProduct.sub_category_id);
    formData.append("rating", newProduct.rating);
    formData.append("quantity", newProduct.quantity);
    formData.append("discount", newProduct.discount);

    //const response = await marketApi.createProduct(formData);
    console.log(
      "the add end point is dead. and all the rest from there. so first use the working ones"
    );

    setNewProduct(defaultProduct);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl text-bold">Testing Market Api</h1>
          <div>
            <h2>Get My Categories</h2>
            <ul>
              RESULT:
              {myCategories?.length > 0
                ? myCategories.map((cat) => <li>{cat.name}</li>)
                : `empty array`}
            </ul>
          </div>
          <div className="border-2 border-b-blue-400 w-full"></div>
          <div>
            <h2>Create Category</h2>

            <input
              type="text"
              placeholder="new category"
              className="bg-amber-100 p-2"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button variant="outline" onClick={createCategory}>
              Add
            </Button>
          </div>
          <div className="border-2 border-b-blue-400 w-full"></div>
          <div>
            <h2>Get My Sub Categories</h2>
            RESULT:
            <ul>
              {mySubCategories?.length > 0
                ? mySubCategories.map((cat) => <li>{cat.name}</li>)
                : `empty subcats`}
            </ul>
          </div>
          <div className="border-2 border-b-blue-400 w-full"></div>

          <div>
            {" "}
            <h2>Create Sub Category</h2>
            <input
              type="text"
              placeholder="+ new subcat"
              className="bg-amber-100 p-2"
              value={newSubCategory.name}
              onChange={(e) =>
                setNewSubCategory((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <Button variant="outline" onClick={createSubCategory}>
              Add
            </Button>
          </div>

          <div className="border-2 border-b-blue-400 w-full"></div>
          <div>
            {" "}
            <h2>Create Product: endpoint not working 404</h2>
            <input
              type="text"
              placeholder="new prod name"
              className="bg-amber-100 p-2"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="description"
              className="bg-amber-100 p-2"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <Button variant="outline" onClick={createProduct}>
              Add
            </Button>
          </div>
          <div>all other endpoints are down</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestMarketApi;
