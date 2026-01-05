import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Lock } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
// 1. IMPORT THE REVIEWS COMPONENT
import ReviewsSection from "@/components/ReviewsSection";

const RestaurantMenu = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const { addToCart, removeFromCart, cartItems } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/restaurants/${id}`);
        setMenu(response.data.foodItems || []);
        setRestaurantName(response.data.title || `Restaurant #${id}`);
        setIsOpen(response.data.open);
      } catch (error) {
        console.error("Failed to load menu", error);
      }
    };
    fetchData();
  }, [id]);

  const getQuantity = (itemId) => {
    const item = cartItems.find((i) => i.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 px-4 md:px-8">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Menu for {restaurantName}</h1>
          <p className="text-zinc-400">Delicious items waiting for you.</p>
        </div>

        {isOpen ? (
          <span className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500 rounded-full font-bold text-sm animate-pulse">
            ● Open Now
          </span>
        ) : (
          <span className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500 rounded-full font-bold text-sm flex items-center gap-2">
            <Lock size={14} /> Closed
          </span>
        )}
      </div>

      {/* MENU GRID */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-3 space-y-6">
          {menu.map((item, index) => {
            const quantity = getQuantity(item.id);

            return (
              <Motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`bg-zinc-900 border-zinc-800 transition-all flex flex-row overflow-hidden h-32 md:h-40 ${
                    !isOpen || !item.available
                      ? "opacity-60"
                      : "hover:border-zinc-700"
                  }`}
                >
                  <div className="w-1/3 bg-zinc-800">
                    <img
                      src={item.imageUrl || "https://placehold.co/200"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {item.title}
                        {!item.available && isOpen && (
                          <span className="text-[10px] bg-red-500/20 text-red-500 border border-red-500/50 px-2 py-0.5 rounded">
                            Out of Stock
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-purple-400 font-bold">
                        ${item.price}
                      </span>

                      {/* BUTTON LOGIC */}
                      {!isOpen ? (
                        <Button
                          size="sm"
                          disabled
                          className="bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                        >
                          Shop Closed
                        </Button>
                      ) : !item.available ? (
                        <Button
                          size="sm"
                          disabled
                          className="bg-red-950/30 text-red-500 cursor-not-allowed border border-red-900/50"
                        >
                          Unavailable
                        </Button>
                      ) : quantity > 0 ? (
                        <div className="flex items-center gap-3 bg-zinc-800 rounded-full px-2 py-1">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:text-red-500"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold text-sm">{quantity}</span>
                          <button
                            onClick={() =>
                              addToCart({ ...item, restaurantId: parseInt(id) })
                            }
                            className="p-1 hover:text-green-500"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() =>
                            addToCart({ ...item, restaurantId: parseInt(id) })
                          }
                          className="bg-white text-black hover:bg-zinc-200"
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. ADD REVIEWS SECTION AT THE BOTTOM */}
      <div className="max-w-5xl mx-auto border-t border-zinc-800 mt-16 pt-8 pb-20">
        <ReviewsSection restaurantId={id} />
      </div>
    </div>
  );
};

export default RestaurantMenu;
