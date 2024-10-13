import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

function InquiryInfo() {
  return (
    <div className="flex justify-center py-20">
      <div className="grid grid-cols-2 max-w-5xl" id="institute">
        <div className="">
          <div className="space-y-4">
            <h1 className="text-[44px]  leading-[52px]">
              Need the{" "}
              <span className="text-blue-500"> Most Relevant & Advanced</span>{" "}
              test series for your Institute?
            </h1>
            <p className="text-xl leading-8">
              Now use Quizrr Testing Platform - which is popular among students
              nationwide for its relevant & comprehensive content along with the
              <span className="text-blue-500">
                {" "}
                Most Detailed Analytical Platform
              </span>
              .
            </p>
          </div>
          <div className="mt-12">
            <Link
              href={
                "https://docs.google.com/forms/d/e/1FAIpQLSdObdsWPP4CaB2yeax9aqmdwEeiIVixAiH7sh9KUdfUL90hHw/viewform"
              }
            >
              <Button className="py-7 px-4 bg-blue-500">
                Fill the Inquiry Form{" "}
                <span className="ml-4">
                  <ArrowRight color="#ffffff" />
                </span>
              </Button>
            </Link>
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