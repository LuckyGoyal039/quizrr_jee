import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <div className="flex flex-col items-center my-16 w-full overflow-hidden">
      <Image
        width={80}
        height={32}
        alt="Quizrr"
        src="https://www.mathongo.com/public/brand/quizrr/logo-dark.svg"
      />
      <p className="mt-2 ">Powered by MathonGo</p>
      <p>&copy; Scoremarks Technologies Private Limited</p>
      <Link href={"/"} className="text-blue-500">Refund and Cancellation Policy</Link>
    </div>
  );
}
export default Footer;
