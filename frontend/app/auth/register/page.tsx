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
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (
        !name ||
        !mail ||
        !regex.test(mail) ||
        !password ||
        password.length < 8
      ) {
        toast({
          variant: "destructive",
          title:
            "Fill all fields properly and password must be at least 8 characters",
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Password does not match",
        });
        return;
      }
      const SERVER_BASE_URL=process.env.NEXT_PUBLIC_SERVER_BASE_URL;
      const userRes = await axios.post(`${SERVER_BASE_URL}/user/register`, {
        username: name,
        email: mail,
        password: password,
      });

      const user = userRes.data;
      //   setUser(user); // Set the fetched country user
      console.log("USER ", user);




      router.push('/auth/login');
    } catch (error) {
      console.log("first error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-lvh bg-[#f9fbfd]">
        <div className="w-96 bg-[#fff] px-8 py-8 rounded-md">
          <div className="">
            <h1 className="w-full text-center text-3xl underline">Sign Up</h1>
          </div>
          <div className="flex flex-col gap-5 my-5">
            <div className="flex flex-col gap-1">
              <p>Name</p>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Your Name"
              />
            </div>
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
            <div className="flex flex-col gap-1">
              <p>Confirm Password</p>
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Enter your password again"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmit}>{loading ? <SmallLoader />  : "Submit"}</Button>
            </div>

            <p className="text-center text-sm">Already have account? <Link href="/auth/login" className="text-blue-500">Login</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
export default Page;