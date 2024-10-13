"use client";

import SmallLoader from "@/components/loader/SmallLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // if (regex.test(email)) {
  //   console.log("Valid email");
  // } else {
  //   console.log("Invalid email");
  // }

  const handleSubmit = async () => {
    try {
      console.log("login", mail, password);
      setLoading(true);
      if (!mail || !regex.test(mail) || !password || password.length < 8) {
        toast({
          variant: "destructive",
          title:
            "Email should be proper or password must be at least 8 characters",

          // description: "There was a problem with your request.",
        });
        return;
      }

      const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
      const userRes = await axios.post(`${SERVER_BASE_URL}/user/login`, {
        email: mail,
        password: password,
      });

      const user = userRes.data;
      //   setUser(user); // Set the fetched country user
      console.log("USER ", user);
      localStorage.setItem("token", user.token);

      // const userProf = await axios.get(`http://localhost:3000/user/profile`, {
      //   headers: {
      //     // Authorization: `Bearer ${userToken}`, // Set the Bearer token in the Authorization header
      //     Authorization: `Bearer ${user.token}`, // Set the Bearer token in the Authorization header
      //     // Accept: "application/json", // Optional, depending on the API
      //   },
      // });

      // const userVal = userProf.data;
      // console.log("prof ", userVal);

      if (!user.profile.onboarding.Bool) {
        router.push("/onboarding?step=1");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-lvh bg-[#f9fbfd]">
      <div className="w-96 bg-[#fff] px-8 py-8 rounded-md">
        <div className="">
          <h1 className="w-full text-center text-3xl underline">Sign in</h1>
        </div>
        <div className="flex flex-col gap-5 my-5">
          <div className="flex flex-col gap-1">
            <p>Email Address</p>
            <Input
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              type="email"
              placeholder="name@address.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p>Password</p>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              {loading ? <SmallLoader size={20} /> : "Submit"}
            </Button>
          </div>

          <p className="text-center text-sm">
            New User{" "}
            <Link href="/auth/register" className="text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Page;