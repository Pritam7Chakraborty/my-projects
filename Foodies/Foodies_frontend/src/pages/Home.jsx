import { useEffect, useState } from "react";
import api from "@/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Search } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import Hero3D from "@/components/Hero3D";
import { Input } from "@/components/ui/input";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get("/api/restaurants");
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white animate-pulse">
        Loading amazing food...
      </div>
    );
  }

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* --- HERO SECTION --- */}
      <div className="pt-28 pb-12 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2 text-center md:text-left z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-600 mb-6 leading-tight">
            Cravings, <br /> Solved.
          </h1>
          <p className="text-zinc-400 text-xl mb-8 max-w-lg mx-auto md:mx-0">
            Order from the best restaurants in town with just a click. Fresh,
            fast, and futuristic.
          </p>
          <Button className="bg-white text-black text-lg px-8 py-6 rounded-full font-bold hover:bg-zinc-200 hover:scale-105 transition-all">
            Explore Food
          </Button>
        </div>

        <div className="md:w-1/2 w-full h-100">
          <Hero3D />
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="px-8 max-w-2xl mx-auto -mt-8 mb-12 relative z-20">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-500 transition-colors"
            size={20}
          />
          <Input
            className="bg-zinc-900/90 backdrop-blur-md border-zinc-700 pl-12 h-14 rounded-full text-lg shadow-xl focus:ring-2 focus:ring-purple-500 transition-all"
            placeholder="Search for burgers, pizza, or sushi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- RESTAURANT GRID --- */}
      <div className="px-8 pb-20 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-zinc-200 border-b border-zinc-800 pb-2">
          Top Restaurants
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Map through items */}
          {filteredRestaurants.map((restaurant, index) => (
            <Motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, ease: "easeOut" }}
            >
              <Card className="bg-zinc-900 border-zinc-800 text-white overflow-hidden hover:border-purple-500 transition-colors duration-300">
                <div className="h-48 w-full bg-zinc-800 overflow-hidden relative">
                  <img
                    src={restaurant.imageUrl || "https://placehold.co/600x400"}
                    alt={restaurant.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold ${
                      restaurant.open
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {restaurant.open ? "OPEN" : "CLOSED"}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    {restaurant.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-zinc-400 mt-1">
                    <MapPin size={16} /> {restaurant.address}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-zinc-300 line-clamp-2">
                    {restaurant.description}
                  </p>
                </CardContent>

                <CardFooter>
                  <Link
                    to={`/restaurant/${restaurant.id}`}
                    state={{ name: restaurant.title }}
                    className="w-full"
                  >
                    <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white group border border-zinc-700">
                      View Menu{" "}
                      <ArrowRight
                        size={16}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                      />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </Motion.div>
          ))}

          {/* 2. Check for empty results OUTSIDE the map */}
          {filteredRestaurants.length === 0 && (
            <div className="col-span-full text-center text-zinc-500 py-12">
              <p>No restaurants found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
