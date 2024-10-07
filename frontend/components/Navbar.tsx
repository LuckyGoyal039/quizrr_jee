"use client";

import Image from "next/image";
import Link from "next/link";
import {Link as LinkTag } from "react-scroll";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

function Navbar() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //    overflow: hidden;
  // width: 200vw;
  // display: flex;
  // border-bottom-left-radius: 50%;
  // justify-content: center;
  // margin-left: -50%;
  // border-bottom-right-radius: 50%;
  return (
         <div
          className={`flex justify-center fixed top-0 w-full ${
            scrollPosition < 5 ? "bg-transparent" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between py-5 max-w-5xl w-[1024px]">
            <div className="">
              {scrollPosition < 5 ? (
                <Image
                  width={95}
                  height={38}
                  alt="Quizrr Logo"
                  src={
                    "https://www.mathongo.com/public/brand/quizrr/logo-light.svg"
                  }
                />
              ) : (
                <Image
                  width={95}
                  height={38}
                  alt="Quizrr Logo"
                  src={
                    "https://www.mathongo.com/public/brand/quizrr/logo-dark.svg"
                  }
                />
              )}
            </div>
            <div className="flex gap">
              <Link href={"/"} className="py-2 px-6 hover:text-blue-500">
                Home
              </Link>
              <Link href={"/"} className="py-2 px-6 hover:text-blue-500">
                Test Series
              </Link>
              <LinkTag to={"institute"}  activeClass="active" 
      spy={true} 
      smooth={true} 
      offset={50} 
      duration={500}  className="py-2 px-6 hover:text-blue-500">
                For Institutes
              </LinkTag>
              <Link href={"/"} className="py-2 px-6 hover:text-blue-500">
                Contact Us
              </Link>
            </div>
            <div className="">
              <Link href={"/login"}>
                {/* change */}
                <Button className="bg-blue-500">Login</Button>
              </Link>
            </div>
          </div>
        </div>
    
  );
}
export default Navbar;
