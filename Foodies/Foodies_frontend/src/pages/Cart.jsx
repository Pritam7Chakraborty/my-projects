import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PaymentModal from "@/components/PaymentModal";
import api, { getUserProfile } from "@/api";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  // Fetch address on load
  useEffect(() => {
    getUserProfile()
      .then((res) => setUserAddress(res.data.address || ""))
      .catch((err) => console.error("Could not fetch address", err));
  }, []);

  // --- HANDLE ORDER SUBMISSION ---
  const handlePaymentSuccess = async () => {
    // 1. Check if Address Exists
    if (!userAddress) {
      alert("Please update your address in Profile page first!");
      navigate("/profile");
      return;
    }

    try {
      if (cartItems.length === 0) return;

      const orderData = {
        restaurantId: cartItems[0].restaurantId,
        address: userAddress, // <--- 2. Use Dynamic Address
        items: cartItems.map((item) => ({
          foodId: item.id,
          quantity: item.quantity,
        })),
      };

      // Call your Backend API
      await api.post("/api/orders", orderData);

      clearCart(); // Wipe the cart
      navigate("/orders"); // Send them to Order History
    } catch (error) {
      console.error("Order Failed", error);
      alert("Failed to place order via Backend.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white space-y-4">
        <h2 className="text-2xl font-bold">Your Cart is Empty 🍔</h2>
        <p className="text-zinc-400">Go add some tasty food!</p>
        <Button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Browse Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-zinc-400 hover:text-white pl-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Your Basket</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT: CART ITEMS */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-purple-400">${item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-zinc-800 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* RIGHT: BILLING SUMMARY */}
          <div className="md:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold border-b border-zinc-800 pb-4">
                  Bill Details
                </h3>
                <div className="flex justify-between text-zinc-400">
                  <span>Item Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Fee</span>
                  <span>$2.50</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Platform Fee</span>
                  <span>$1.00</span>
                </div>
                <div className="border-t border-zinc-800 pt-4 flex justify-between font-bold text-lg text-white">
                  <span>To Pay</span>
                  <span>${(cartTotal + 3.5).toFixed(2)}</span>
                </div>

                <Button
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold mt-4"
                >
                  Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* --- INTEGRATE PAYMENT MODAL --- */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={(cartTotal + 3.5).toFixed(2)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Cart;
