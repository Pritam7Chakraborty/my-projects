import { useEffect, useState } from "react";
import api, {
  createRestaurant,
  addFoodItem,
  getAllOrders,
  updateOrderStatus,
} from "@/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);

  // Forms State
  const [newRestaurant, setNewRestaurant] = useState({
    title: "",
    description: "",
    address: "",
    imageUrl: "",
    open: true,
  });
  const [newFood, setNewFood] = useState({
    restaurantId: "",
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  // --- SHARED DATA FETCHER ---
  const refreshData = async () => {
    try {
      const resData = await api.get("/api/restaurants");
      setRestaurants(resData.data);

      const orderData = await getAllOrders();
      if (orderData.data) {
        // Sort orders: Newest first
        setOrders(
          orderData.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }
    } catch (e) {
      console.error("Failed to load admin data", e);
    }
  };

  // --- INITIAL LOAD ---
  useEffect(() => {
    // THE FIX: setTimeout forces this to run AFTER the component paints.
    // This silences the "Synchronous setState" error.
    setTimeout(() => {
      refreshData();
    }, 0);
  }, []);

  // --- HANDLERS ---

  const handleCreateRestaurant = async () => {
    try {
      await createRestaurant(newRestaurant);
      alert("Restaurant Created!");
      setNewRestaurant({
        title: "",
        description: "",
        address: "",
        imageUrl: "",
        open: true,
      });
      refreshData();
    } catch (e) {
      console.error(e);
      alert("Error creating restaurant");
    }
  };

  const handleAddFood = async () => {
    if (!newFood.restaurantId) return alert("Select a restaurant first!");
    try {
      await addFoodItem(newFood.restaurantId, {
        title: newFood.title,
        description: newFood.description,
        price: parseFloat(newFood.price),
        imageUrl: newFood.imageUrl,
      });
      alert("Food Item Added!");
      setNewFood({ ...newFood, title: "", description: "", price: "" });
    } catch (e) {
      console.error(e);
      alert("Error adding food");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      refreshData();
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-24 pb-40 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-purple-500">
          Admin Dashboard
        </h1>
        <p className="text-zinc-400 mb-8">Manage your food empire.</p>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="orders">Manage Orders</TabsTrigger>
            <TabsTrigger value="restaurants">Add Restaurant</TabsTrigger>
            <TabsTrigger value="food">Add Food Menu</TabsTrigger>
          </TabsList>

          {/* TAB 1: MANAGE ORDERS */}
          <TabsContent value="orders" className="mt-6 space-y-4">
            {orders.length === 0 && (
              <p className="text-zinc-500">No orders found.</p>
            )}
            {orders.map((order) => (
              <Card key={order.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription>
                      To: {order.deliveryAddress}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="text-white border-zinc-700"
                    >
                      {order.status}
                    </Badge>

                    {/* Status Changer */}
                    <Select
                      onValueChange={(val) => handleStatusUpdate(order.id, val)}
                    >
                      <SelectTrigger className="w-35 bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PREPARING">Preparing</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-zinc-400">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.foodItem.title}
                        </span>
                        <span>${item.foodItem.price}</span>
                      </div>
                    ))}
                    <div className="mt-2 font-bold text-white text-right">
                      Total: ${order.totalAmount}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* TAB 2: CREATE RESTAURANT */}
          <TabsContent value="restaurants" className="mt-6">
            <Card className="bg-zinc-900 border-zinc-800 max-w-2xl">
              <CardHeader>
                <CardTitle>Create New Restaurant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Restaurant Name</Label>
                  <Input
                    className="bg-zinc-800 border-zinc-700"
                    value={newRestaurant.title}
                    onChange={(e) =>
                      setNewRestaurant({
                        ...newRestaurant,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    className="bg-zinc-800 border-zinc-700"
                    value={newRestaurant.address}
                    onChange={(e) =>
                      setNewRestaurant({
                        ...newRestaurant,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="https://..."
                    value={newRestaurant.imageUrl}
                    onChange={(e) =>
                      setNewRestaurant({
                        ...newRestaurant,
                        imageUrl: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    className="bg-zinc-800 border-zinc-700"
                    value={newRestaurant.description}
                    onChange={(e) =>
                      setNewRestaurant({
                        ...newRestaurant,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={handleCreateRestaurant}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Create Restaurant
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: ADD FOOD */}
          <TabsContent value="food" className="mt-6">
            <Card className="bg-zinc-900 border-zinc-800 max-w-2xl">
              <CardHeader>
                <CardTitle>Add Food Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Select Restaurant */}
                <div>
                  <Label>Select Restaurant</Label>
                  <Select
                    onValueChange={(val) =>
                      setNewFood({ ...newFood, restaurantId: val })
                    }
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select a Restaurant" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      {restaurants.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Food Name</Label>
                  <Input
                    className="bg-zinc-800 border-zinc-700"
                    value={newFood.title}
                    onChange={(e) =>
                      setNewFood({ ...newFood, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    className="bg-zinc-800 border-zinc-700"
                    value={newFood.price}
                    onChange={(e) =>
                      setNewFood({ ...newFood, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    className="bg-zinc-800 border-zinc-700"
                    placeholder="https://..."
                    value={newFood.imageUrl}
                    onChange={(e) =>
                      setNewFood({ ...newFood, imageUrl: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    className="bg-zinc-800 border-zinc-700"
                    value={newFood.description}
                    onChange={(e) =>
                      setNewFood({ ...newFood, description: e.target.value })
                    }
                  />
                </div>

                <Button
                  onClick={handleAddFood}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  Add Food Item
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
