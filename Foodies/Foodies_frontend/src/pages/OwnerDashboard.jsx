import { useEffect, useState } from "react";
import api, {
  toggleRestaurantStatus,
  deleteFoodItem,
  toggleFoodAvailability,
} from "@/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Power,
  MapPin,
  Loader2,
  ChevronDown,
  ChevronUp,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const OwnerDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(null); // Stores ID of loading item
  const [expandedRestaurant, setExpandedRestaurant] = useState(null); // Which menu is open?

  const fetchMyRestaurants = async () => {
    try {
      const res = await api.get("/api/restaurants");
      setRestaurants(res.data);
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
    }
  };

  useEffect(() => {
    fetchMyRestaurants();
  }, []);

  // --- ACTIONS ---

  const handleRestaurantToggle = async (restaurant) => {
    setLoading(restaurant.id);
    try {
      await toggleRestaurantStatus(restaurant.id);
      // Update UI locally
      setRestaurants(
        restaurants.map((r) =>
          r.id === restaurant.id ? { ...r, open: !r.open } : r
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleFoodToggle = async (foodId, restaurantId) => {
    // Optimistic update: Find the restaurant and toggle the food item in UI immediately
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          return {
            ...r,
            foodItems: r.foodItems.map((f) =>
              f.id === foodId ? { ...f, available: !f.available } : f
            ),
          };
        }
        return r;
      })
    );

    try {
      await toggleFoodAvailability(foodId);
    } catch (error) {
      console.error("Failed to toggle food", error);
      // Revert if failed (optional, but good practice)
      fetchMyRestaurants();
    }
  };

  const handleDeleteFood = async (foodId, restaurantId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteFoodItem(foodId);
      // Remove from UI
      setRestaurants((prev) =>
        prev.map((r) => {
          if (r.id === restaurantId) {
            return {
              ...r,
              foodItems: r.foodItems.filter((f) => f.id !== foodId),
            };
          }
          return r;
        })
      );
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
        <p className="text-zinc-400 mb-8">
          Control your restaurants and menus.
        </p>

        <div className="grid gap-6">
          {restaurants.map((restaurant) => (
            <Motion.div
              layout
              key={restaurant.id}
              className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800"
            >
              {/* RESTAURANT HEADER CARD */}
              <div
                className={`p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 ${
                  restaurant.open ? "border-l-green-500" : "border-l-red-500"
                }`}
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div
                    className={`h-14 w-14 rounded-lg flex items-center justify-center text-xl font-bold ${
                      restaurant.open
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {restaurant.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {restaurant.title}
                      {restaurant.open ? (
                        <span className="text-[10px] bg-green-500 text-black px-2 py-0.5 rounded-full">
                          LIVE
                        </span>
                      ) : (
                        <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">
                          CLOSED
                        </span>
                      )}
                    </h3>
                    <p className="text-zinc-400 text-sm flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {restaurant.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  {/* Toggle Shop Open/Close */}
                  <Button
                    onClick={() => handleRestaurantToggle(restaurant)}
                    disabled={loading === restaurant.id}
                    variant="outline"
                    className={`flex-1 md:flex-none border-zinc-700 hover:bg-zinc-800 text-white ${
                      restaurant.open
                        ? "hover:text-red-400"
                        : "hover:text-green-400"
                    }`}
                  >
                    {loading === restaurant.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Power size={16} />
                    )}
                    <span className="ml-2">
                      {restaurant.open ? "Close Shop" : "Open Shop"}
                    </span>
                  </Button>

                  {/* Expand Menu Button */}
                  <Button
                    onClick={() =>
                      setExpandedRestaurant(
                        expandedRestaurant === restaurant.id
                          ? null
                          : restaurant.id
                      )
                    }
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {expandedRestaurant === restaurant.id
                      ? "Hide Menu"
                      : "Manage Menu"}
                    {expandedRestaurant === restaurant.id ? (
                      <ChevronUp size={16} className="ml-2" />
                    ) : (
                      <ChevronDown size={16} className="ml-2" />
                    )}
                  </Button>
                </div>
              </div>

              {/* EXPANDABLE MENU SECTION */}
              <AnimatePresence>
                {expandedRestaurant === restaurant.id && (
                  <Motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-zinc-950/50 border-t border-zinc-800"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {restaurant.foodItems &&
                      restaurant.foodItems.length > 0 ? (
                        restaurant.foodItems.map((food) => (
                          <div
                            key={food.id}
                            className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={food.imageUrl || "https://placehold.co/50"}
                                className="w-10 h-10 rounded object-cover bg-zinc-800"
                                alt={food.title}
                              />
                              <div>
                                <p
                                  className={`font-medium ${
                                    !food.available &&
                                    "text-zinc-500 line-through"
                                  }`}
                                >
                                  {food.title}
                                </p>
                                <p className="text-xs text-zinc-400">
                                  ${food.price}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {/* Toggle Availability */}
                              <button
                                onClick={() =>
                                  handleFoodToggle(food.id, restaurant.id)
                                }
                                title={
                                  food.available
                                    ? "Mark as Out of Stock"
                                    : "Mark as Available"
                                }
                                className={`p-2 rounded-md transition ${
                                  food.available
                                    ? "text-green-400 hover:bg-green-400/10"
                                    : "text-zinc-500 hover:text-green-400"
                                }`}
                              >
                                {food.available ? (
                                  <CheckCircle size={18} />
                                ) : (
                                  <Ban size={18} />
                                )}
                              </button>

                              {/* Delete Item */}
                              <button
                                onClick={() =>
                                  handleDeleteFood(food.id, restaurant.id)
                                }
                                title="Delete Item"
                                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-500 text-sm col-span-2 text-center py-4">
                          No food items yet.
                        </p>
                      )}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
