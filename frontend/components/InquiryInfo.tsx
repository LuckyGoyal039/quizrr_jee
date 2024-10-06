import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

function InquiryInfo() {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-2 max-w-5xl" id="institute">
        <div className="">
          <div className="">
            <h1 className="text-[44px] font-semibold leading-[52px]">
              Need the{" "}
              <span className="text-blue-500"> Most Relevant & Advanced</span>{" "}
              test series for your Institute?
            </h1>
            <p>
              Now use Quizrr Testing Platform - which is popular among students
              nationwide for its relevant & comprehensive content along with the
              <span className="text-blue-500">
                {" "}
                Most Detailed Analytical Platform
              </span>
              .
            </p>
          </div>
          <div className="">
            <Button>
              Fill the Inquiry Form{" "}
              <span className="ml-4">
                <ArrowRight color="#ffffff" />
              </span>
            </Button>
          </div>
        </div>
        <div className="">
          <Image
            width={624}
            height={413}
            alt="coolaborate"
            src={
              "https://www.mathongo.com/public/lk/assets/img/illustrations/illustration-2.png"
            }
          />
        </div>
      </div>
    </div>
  );
}
export default InquiryInfo;
