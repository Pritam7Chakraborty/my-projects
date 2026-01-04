import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import api, { createOrder } from "@/api"; // Import createOrder
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, ShoppingBag, MapPin } from "lucide-react"; // Added MapPin
import { motion as Motion } from "framer-motion";
import { Input } from "@/components/ui/input"; // Import Input for address

const RestaurantMenu = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // For redirecting after order

  const initialName = location.state?.name || `Restaurant #${id}`;
  const [restaurantName] = useState(initialName);

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [address, setAddress] = useState(""); // State for delivery address

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/food/${id}`);
        setMenu(response.data);
      } catch (error) {
        console.error("Failed to load menu", error);
      }
    };
    fetchData();
  }, [id]);

  // Cart Logic
  const addToCart = (foodId) => {
    setCart((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
  };

  const removeFromCart = (foodId) => {
    setCart((prev) => {
      const newCount = (prev[foodId] || 0) - 1;
      if (newCount <= 0) {
        const newCart = { ...prev };
        delete newCart[foodId];
        return newCart;
      }
      return { ...prev, [foodId]: newCount };
    });
  };

  const handleCheckout = async () => {
    if (!address) {
      alert("Please enter a delivery address!");
      return;
    }

    try {
      const orderItems = Object.keys(cart).map((foodId) => ({
        foodId: parseInt(foodId),
        quantity: cart[foodId],
      }));

      const payload = {
        restaurantId: parseInt(id),
        items: orderItems,
        address: address,
      };

      await createOrder(payload);

      alert("Order Placed Successfully! 🍕");
      navigate("/orders");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to place order. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2">Menu for {restaurantName}</h1>
        <p className="text-zinc-400">Delicious items waiting for you.</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Menu List */}
        <div className="md:col-span-2 space-y-6">
          {menu.map((item, index) => (
            <Motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all flex flex-row overflow-hidden h-32 md:h-40">
                <div className="w-1/3 bg-zinc-800">
                  <img
                    src={item.imageUrl || "https://placehold.co/200"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-purple-400 font-bold">
                      ${item.price}
                    </span>
                    {cart[item.id] ? (
                      <div className="flex items-center gap-3 bg-zinc-800 rounded-full px-2 py-1">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:text-red-500"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-sm">
                          {cart[item.id]}
                        </span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="p-1 hover:text-green-500"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addToCart(item.id)}
                        className="bg-white text-black hover:bg-zinc-200"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Motion.div>
          ))}
        </div>

        {/* Cart Summary (Updated with Checkout) */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="text-purple-500" /> Your Cart
                </h3>
                {Object.keys(cart).length === 0 ? (
                  <div className="text-center py-10 text-zinc-500">
                    <p>Cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.keys(cart).map((key) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span>
                          Item #{key} (x{cart[key]})
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-zinc-800 pt-4 mt-4">
                      <label className="text-xs text-zinc-400 mb-1 block">
                        Delivery Address
                      </label>
                      <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded px-2">
                        <MapPin size={14} className="text-zinc-500" />
                        <input
                          className="bg-transparent w-full text-sm py-2 focus:outline-none"
                          placeholder="e.g. Flat 4B, Park Street"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-linear-to-r from-purple-600 to-pink-600 mt-4"
                    >
                      Place Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RestaurantMenu;
