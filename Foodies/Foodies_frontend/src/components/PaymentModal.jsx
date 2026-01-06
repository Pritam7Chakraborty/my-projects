import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreditCard, Loader2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
  // ✅ FIX: Removed unused 'loading' state. We use 'step' instead.
  const [step, setStep] = useState("input"); // 'input' | 'processing' | 'success'

  const handleFakePayment = async () => {
    setStep("processing");

    // 1. Simulate Network Delay (2 seconds)
    setTimeout(() => {
      setStep("success");

      // 2. Generate Fake Transaction ID
      const fakeTxnId = "pay_fake_" + Math.random().toString(36).substr(2, 9);

      // 3. Complete the Order after showing success briefly
      setTimeout(() => {
        onPaymentSuccess(fakeTxnId);
        onClose();
        setStep("input"); // Reset for next time
      }, 1500);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Secure Payment</DialogTitle>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4 py-4">
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-400">Total Amount</p>
                <h2 className="text-2xl font-bold">₹{totalAmount}</h2>
              </div>
              <CreditCard className="text-purple-500" size={32} />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400">
                Card Number (Test)
              </label>
              <Input
                placeholder="4111 1111 1111 1111"
                className="bg-zinc-800 border-zinc-700"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="MM/YY"
                  className="bg-zinc-800 border-zinc-700"
                />
                <Input
                  placeholder="CVV"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            <Button
              onClick={handleFakePayment}
              className="w-full bg-green-600 hover:bg-green-700 h-12 font-bold mt-2"
            >
              Pay Now
            </Button>
          </div>
        )}

        {step === "processing" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 size={48} className="animate-spin text-purple-500" />
            <p className="text-lg font-medium">Processing Payment...</p>
            <p className="text-sm text-zinc-500">
              Please do not close this window.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <CheckCircle size={48} className="text-green-500" />
            <h3 className="text-xl font-bold text-green-500">
              Payment Successful!
            </h3>
            <p className="text-zinc-400">Redirecting to orders...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
