import { useEffect, useState } from "react";
import { getMyOrders } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion as Motion } from "framer-motion";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        // Sort by newest first
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500 text-black";
      case "PREPARING":
        return "bg-blue-500 text-white";
      case "DELIVERED":
        return "bg-green-500 text-white";
      default:
        return "bg-zinc-500";
    }
  };

  if (loading)
    return <div className="p-20 text-center text-white">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-zinc-500">You haven't ordered anything yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <Motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id}
                      </CardTitle>
                      <span className="text-xs text-zinc-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <p className="text-sm font-bold text-purple-400">
                        Restaurant: {order.restaurant.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        To: {order.deliveryAddress}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm text-zinc-300"
                        >
                          <span>
                            {item.quantity}x {item.foodItem.title}
                          </span>
                          <span>${item.foodItem.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-zinc-800 mt-4 pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
