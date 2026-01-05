import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, CreditCard } from "lucide-react";
import { motion as Motion } from "framer-motion";

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay (2 seconds)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Close modal after showing success animation
      setTimeout(() => {
        onPaymentSuccess(); // Clear cart and redirect
        setSuccess(false); 
        onClose();
      }, 2000);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="text-purple-500" /> Secure Payment
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <Motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 space-y-4"
          >
            <CheckCircle className="w-20 h-20 text-green-500" />
            <h2 className="text-2xl font-bold text-green-400">Payment Successful!</h2>
            <p className="text-zinc-400">Your order has been placed.</p>
          </Motion.div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4 mt-4">
            <div className="bg-zinc-800 p-4 rounded-lg mb-4 text-center">
              <p className="text-zinc-400 text-sm">Total Amount to Pay</p>
              <h1 className="text-3xl font-bold text-white">${totalAmount}</h1>
            </div>

            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input 
                placeholder="4242 4242 4242 4242" 
                className="bg-zinc-950 border-zinc-700 font-mono"
                required
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input placeholder="MM/YY" className="bg-zinc-950 border-zinc-700" required maxLength={5} />
              </div>
              <div className="space-y-2">
                <Label>CVV</Label>
                <Input placeholder="123" type="password" className="bg-zinc-950 border-zinc-700" required maxLength={3} />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-semibold mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;