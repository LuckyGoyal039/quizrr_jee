"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function page() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // if (regex.test(email)) {
  //   console.log("Valid email");
  // } else {
  //   console.log("Invalid email");
  // }

  const handleSubmit = async () => {
    try {
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
          // description: "There was a problem with your request.",
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Password does not match",
          // description: "There was a problem with your request.",
        });
        return;
      }

      const userRes = await axios.post(`http://localhost:3000/user/register`, {
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
    }
  };

  return (
    <div>
      <div className="">
        <h1>Sign Up</h1>
        <p>Create a new Quizrr account</p>
      </div>
      <div className="">
        <div className="">
          <p>Name</p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your Name"
          />
        </div>
        <div className="">
          <p>Email Address</p>
          <Input
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            type="email"
            placeholder="name@address.com"
          />
        </div>

        <div className="">
          <p>Password</p>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <div className="">
          <p>Confirm Password</p>
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Enter your password again"
          />
        </div>
        <div className="">
          <Button onClick={handleSubmit}>Sign in</Button>
        </div>
        <div className="">
            <Link href={'/auth/login'} >Login?</Link>
        </div>
      </div>
    </div>
  );
}
export default page;
