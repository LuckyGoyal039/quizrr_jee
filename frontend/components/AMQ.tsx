import { Button } from "./ui/button";

function AMQ() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[44px] font-bold mb-4">Any More Questions?</h1>
      <p className="text-lg text-[#869ab8] font-normal mb-6">You can contact us through email or chat with us.</p>
      <Button className="px-5 py-6 bg-[#df4759] transition-all hover:bg-[#be3c4c] hover:-translate-y-2">
        Email Us (support@mathongo.com)</Button>
    </div>
  );
}
export default AMQ;
