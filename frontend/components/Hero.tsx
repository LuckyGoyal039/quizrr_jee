"use client";

// import { Span } from "next/dist/trace";
import { Button } from "./ui/button";
import { Typewriter } from "react-simple-typewriter";
import Link from "next/link";

function Hero() {
  return (
    <div className="flex justify-center w-full overflow-hidden">
      {/* <div className="flex justify-start w-[200vw] rounded-b-[50%]"> */}
      <div className="flex justify-start w-full bg-[#f9fbfd]">
        {/* <div className=" w-[100vw] bg-no-repeat bg-[url('https://www.mathongo.com/public/brand/quizrr/assets/home-hero.jpg')] py-48"> */}
        <div className="flex justify-center bg-no-repeat bg-cover bg-[url('https://www.mathongo.com/public/brand/quizrr/assets/home-hero.jpg')] py-48 w-full">
          <div className="w-full px-10 lg:px-[17rem]">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold text-white md:w-[653px] md:text-5xl">
                Prepare with India&apos;s Most Trusted Test Series for
                <span className="block text-yellow-300">
                  <Typewriter
                    words={[
                      "JEE Main",
                      "JEE Advanced",
                      "BITSAT",
                      "and other exams",
                    ]}
                    cursor
                    loop={false}
                    cursorStyle={<span className="text-white">|</span>}
                  />
                </span>
              </h1>
              <p className="text-white md:w-[700px]">
                Crack upcoming IIT JEE Main & Advanced and other competitive
                exams with test series designed according to latest pattern of
                exams!
              </p>
              <Link href={"/auth/login"}>
                <Button className="bg-blue-500 py-6 md:py-7 md:text-xl">Explore Test Series</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Hero;