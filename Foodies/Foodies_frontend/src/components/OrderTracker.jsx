import { Check, ChefHat, Truck, Package } from "lucide-react";

const OrderTracker = ({ status }) => {
  // Status levels: PENDING -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED
  const steps = [
    { id: "PENDING", label: "Placed", icon: Package },
    { id: "PREPARING", label: "Cooking", icon: ChefHat },
    { id: "OUT_FOR_DELIVERY", label: "On Way", icon: Truck },
    { id: "DELIVERED", label: "Delivered", icon: Check },
  ];

  // Helper to find current step index
  const getCurrentStep = () => {
    return steps.findIndex(s => s.id === status);
  };

  const currentStepIndex = getCurrentStep();

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between items-center">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 z-0"></div>
        <div 
            className="absolute top-1/2 left-0 h-1 bg-green-600 transition-all duration-500 z-0" 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 bg-zinc-950 px-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted ? "bg-green-600 border-green-600 text-white" : "bg-zinc-900 border-zinc-700 text-zinc-500"}
                    ${isCurrent ? "ring-4 ring-green-500/20 scale-110" : ""}
                `}
              >
                <step.icon size={18} />
              </div>
              <span className={`text-xs font-bold ${isCompleted ? "text-green-400" : "text-zinc-600"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;