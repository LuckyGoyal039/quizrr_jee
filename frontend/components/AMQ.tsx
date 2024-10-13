import Link from "next/link";
import { Button } from "./ui/button";

function AMQ() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[44px] font-bold mb-4">Any More Questions?</h1>
      <p className="text-lg text-[#869ab8] font-normal mb-6">
        You can contact us through email or chat with us.
      </p>
      <Link
        href={"mailto:luckgoyalconnect@gmail.com"}
        className="py-2 px-6 hover:text-blue-500"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="px-5 py-6 bg-[#df4759] transition-all hover:bg-[#be3c4c] hover:-translate-y-2">
          Email Us (luckgoyalconnect@gmail.com)
        </Button>
      </Link>
    </div>
  );
}
export default AMQ;