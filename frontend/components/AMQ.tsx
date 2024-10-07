import { Button } from "./ui/button";

function AMQ() {
  return (
    <div className="flex flex-col items-center">
      <h1>Any More Questions?</h1>
      <p>You can contact us through email or chat with us.</p>
      <Button variant="destructive" className="">Email Us (support@mathongo.com)</Button>
    </div>
  );
}
export default AMQ;
