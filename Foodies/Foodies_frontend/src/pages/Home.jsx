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
import {
  MapPin,
  ArrowRight,
  Search,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import Hero3D from "@/components/Hero3D";
import { Input } from "@/components/ui/input";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // --- 1. PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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

  // Reset page to 1 whenever search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  // --- FILTER LOGIC ---
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (activeFilter === "Open Now") matchesFilter = restaurant.open === true;
    else if (activeFilter !== "All") {
      const type = activeFilter.toLowerCase();
      matchesFilter =
        restaurant.title.toLowerCase().includes(type) ||
        restaurant.description.toLowerCase().includes(type);
    }

    return matchesSearch && matchesFilter;
  });

  // --- 2. PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const filters = ["All", "Open Now", "Pizza", "Burger", "Chinese", "Biryani"];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white animate-pulse">
        Loading amazing food...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* HERO SECTION */}
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

      {/* SEARCH BAR */}
      <div className="px-8 max-w-2xl mx-auto -mt-8 mb-12 relative z-20">
        <div className="relative group mb-4">
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
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                activeFilter === filter
                  ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* RESTAURANT GRID */}
      <div className="px-8 pb-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-2">
          <h2 className="text-2xl font-bold text-zinc-200">
            {activeFilter === "All"
              ? "Top Restaurants"
              : `${activeFilter} Places`}
          </h2>
          <span className="text-zinc-500 text-sm">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredRestaurants.length)} of{" "}
            {filteredRestaurants.length} results
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* ✅ MAP CURRENT PAGE ITEMS ONLY */}
          {currentRestaurants.map((restaurant, index) => (
            <Motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, ease: "easeOut" }}
            >
              <Card className="bg-zinc-900 border-zinc-800 text-white overflow-hidden hover:border-purple-500 transition-colors duration-300 h-full flex flex-col">
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
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md flex items-center gap-1 text-xs font-bold text-yellow-400">
                    <Star size={12} fill="currentColor" /> 4.5
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
                <CardContent className="grow">
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

          {filteredRestaurants.length === 0 && (
            <div className="col-span-full text-center text-zinc-500 py-12 flex flex-col items-center">
              <Filter size={48} className="mb-4 opacity-50" />
              <p className="text-lg">
                No restaurants found matching "{searchTerm}"
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setActiveFilter("All");
                  setSearchTerm("");
                }}
                className="text-purple-400"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* --- 3. PAGINATION CONTROLS --- */}
        {filteredRestaurants.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="border-zinc-700 hover:bg-zinc-800 text-white"
            >
              <ChevronLeft size={16} className="mr-2" /> Previous
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-md font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="border-zinc-700 hover:bg-zinc-800 text-white"
            >
              Next <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
