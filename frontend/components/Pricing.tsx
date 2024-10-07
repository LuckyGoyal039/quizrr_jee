import { IndianRupee } from "lucide-react";
import { Button } from "./ui/button";

function Pricing() {
  return (
    <div className="flex flex-col items-center">
      <h1>Pricing</h1>
      <div className="flex flex-col items-center shadow-md border-t border-t-red-600 p-8 rounded">
        <p className="flex line-through">
          <IndianRupee size={12} color="#000000" strokeWidth={1} />
          7,990
        </p>
        <div className="flex text-sm font-bold items-baseline space-x-1">
          <IndianRupee size={10} color="#000000" strokeWidth={1} />
          <h3 className="text-lg">2,990</h3>
          <h5>(5,000 off)</h5>
        </div>
        <Button variant={"destructive"}>JOIN NOW</Button>
      </div>
      <div className="">
        <div className="flex flex-col items-center">
          <h5 className="text-blue-600">100% Moneyback</h5>
          <p className="text-[rgb(134, 154, 184)]">
            If you get All India Rank under 1000
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h5 className="text-blue-600">50% Moneyback</h5>
          <p className="text-[rgb(134, 154, 184)]">
            If you get All India Rank under 2500
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h5 className="text-blue-600">30% Moneyback</h5>
          <p className="text-[rgb(134, 154, 184)]">
            If you get All India Rank under 5000
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h5 className="text-blue-600">10% Moneyback</h5>
          <p className="text-[rgb(134, 154, 184)]">
            If you get All India Rank under 10000
          </p>
        </div>
      </div>
      <div className="text-center">
        <h5>Are you ready to take the challenge? 💪</h5>
        <p>
          Note: (i) For verification, you will be required to share your JEE
          Advanced 2025 score/rank card and a video testimonial.
        </p>
        <p>
          (ii) The scholarship amount will be transferred after JEE Advanced
          2025 results are declared.
        </p>
        <p>
          (iii) The acceptance period for scholarship results extends until 60
          days following the declaration of said results. Requests made beyond
          this timeframe will not be entertained.
        </p>
      </div>
    </div>
  );
}
export default Pricing;
