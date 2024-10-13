"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface IProfile {
  board: string;
  city: string;
  country: string;
  displayname: string;
  email: string;
  phone_no: string;
  pincode: string;
  standard: string;
  state: string;
  user_id: number;
  username: string;
}

const Page: React.FC = () => {
  const [profile, setProfile] = useState<IProfile>();

  const fetchProfile = async () => {
    const userProf = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/user/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const userData = userProf.data;
    console.log("user", userData);
    setProfile(userData);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:ml-48 overflow-y-auto">
        <div className="grid place-items-center h-full">
          {profile && (
            <div className="w-[700px] mx-auto bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="w-24 h-24 rounded-full bg-red-600 text-white flex items-center justify-center text-5xl font-bold">
                    {profile.email[0].toUpperCase()}
                  </div>
                  <div className="ml-6 gap-6">
                    <h2 className="text-xl font-bold">{profile.displayname}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                    <p className="text-gray-500">{profile.phone_no}</p>
                    <p className="text-gray-500">{`${profile.city}, ${profile.state}, ${profile.country}, ${profile.pincode}.`}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link href={"/onboarding?step=1"}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    Edit Profile
                  </Button>
                </Link>
              </div>

              <div className="p-6 border-t">
                {/* <div className="flex justify-between py-2">
                  <span className="text-gray-500">Current Status</span>
                  <span className="text-gray-500">{profile.standard}</span>
                </div> */}
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 mr-4">Board</span>
                  <span className="text-gray-800 font-medium">
                    {profile.board}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 mr-4">Class</span>
                  <span className="text-gray-800 font-medium">
                    {profile.standard}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;