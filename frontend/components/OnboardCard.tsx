"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input, InputProps } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { Input } from "./ui/input";
import { CountrySelect, PhoneInput } from "./PhoneInput";
import { ScrollArea } from "./ui/scroll-area";
import { SelectArea } from "./SelectArea";
import { getHeapSpaceStatistics } from "v8";
import Loader from "./loader";
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2t5QGdtYWlsLmNvbSIsImV4cCI6MTcyODU2MzgwMywiaWQiOjEsInVzZXJuYW1lIjoiTHVja3kgR295YWwifQ.2Gwz97zdrfTTi_4kpze8LTUxR3Y3zcj2SHRJLKaTwuM

const boards = [
  "Indian School Certificate (ISC)",
  "Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)",
  "West Bengal Board of Secondary Education (WBBSE)",
  "Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP)",
  "Board of School Education, Haryana (HBSE)",
  "Assam Higher Secondary Education Council (AHSEC)",
  "Goa Board of Secondary and Higher Secondary Education (GBSHSE)",
  "Himachal Pradesh Board of School Education (HPBOSE)",
  "Central Board of Secondary Education (CBSE)",
  "Gujarat Secondary Education Board (GSEB)",
  "Kerala Board of Public Examinations (KBPE)",
  "Telangana Board of Secondary Education(TBSE)",
  "Mizoram Board of School Education (MBSE)",
  "Bihar School Examination Board (BSEB)",
  "Punjab School Education Board (PSEB)",
  "Jharkhand Academic Council (JAC)",
  "National Institute of Open Schooling (NIOS)",
  "Karnataka Secondary Education Examination Board (KSEEB)",
  "Tamil Nadu State Board (TNSB)",
  "Chhatisgarh Board Of Secondary Education (CGBSE)",
  "Council of Higher Secondary Education, Odisha (CHSE)",
  "Andhra Pradesh Board of Education (APBSE)",
  "Rajasthan Board of Secondary Education (RBSE)",
  "Madhya Pradesh Board of Secondary Education (MPBSE)",
  "Board of Secondary Education, Manipur (BSEM)",
  "Meghalaya Board of School Education (MBOSE)",
  "Jammu and Kashmir Board of School Education (JKBOSE)",
  "Others",
];

const SelectStandard = ({ setVal }: { setVal: Function }) => {
  const [select, setSelect] = useState();

  return (
    <div className="flex justify-center gap-4">
      <Input
        value={"Class 11"}
        readOnly
        className="hover:border-black "
        onClick={(e) => setVal(e.target.value)}
      />
      <Input
        value={"Class 12"}
        readOnly
        className="hover:border-black"
        onClick={(e) => setVal(e.target.value)}
      />
      <Input
        value={"First Time Dropper"}
        readOnly
        className="hover:border-black"
        onClick={(e) => setVal(e.target.value)}
      />
      <Input
        value={"Second Time Dropper"}
        readOnly
        className="hover:border-black"
        onClick={(e) => setVal(e.target.value)}
      />
    </div>
  );
};

function OnboardCard() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(Number(params.get("step")));

  const [val, setVal] = useState("");

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ4aWxvbmE0MTAwQHJvd3BsYW50LmNvbSIsImFwaV90b2tlbiI6IlVTc1BfOGoySWRfTmRfVUpMZXl4U3hJcjdib3RNMENZWTh4anc0b2NDVkpzUGdMSlo4UEtRZnhhMFdZaV9meUhxYWcifSwiZXhwIjoxNzI4NDY5MTcwfQ.UchwJoO5jo0OID7-1691_q1U88Pyb87NmtaWL8p-XsQ";
  const email = "test@example.com";
  // /user/my-notes
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [user, setUser] = useState({});
  // const [userToken, setUserToken] = useState("");

  const userKeys = [
    "displayname",
    "phone_no",
    "country",
    "state",
    "city",
    "pincode",
    "standard",
    "board",
  ];

  const fetchCountry = async () => {
    try {
      setLoading(true);
      const countryRes = await axios.get(
        "https://www.universal-tutorial.com/api/countries/",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
            Accept: "application/json", // Optional, depending on the API
          },
        }
      );

      const countryData = countryRes.data;
      setCountry(countryData); // Set the fetched country countryData
      console.log(countryData);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched or an error occurs
    }
  };
  const fetchState = async (state) => {
    try {
      setLoading(true);
      const stateRes = await axios.get(
        `https://www.universal-tutorial.com/api/states/${state}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
            Accept: "application/json", // Optional, depending on the API
          },
        }
      );

      const stateData = stateRes.data;
      setState(stateData); // Set the fetched country stateData
      console.log(stateData);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched or an error occurs
    }
  };
  const fetchCity = async (city) => {
    try {
      setLoading(true);
      const cityRes = await axios.get(
        `https://www.universal-tutorial.com/api/cities/${city}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
            Accept: "application/json", // Optional, depending on the API
          },
        }
      );

      const cityData = cityRes.data;
      setCity(cityData); // Set the fetched country cityData
      console.log(cityData);
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched or an error occurs
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      const userRes = await axios.get(`${SERVER_BASE_URL}/user/profile`, {
        headers: {
          // Authorization: `Bearer ${userToken}`, // Set the Bearer token in the Authorization header
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Set the Bearer token in the Authorization header
          // Accept: "application/json", // Optional, depending on the API
        },
      });

      const userVal = userRes.data;
      setUser(userVal); // Set the fetched country userVal
      console.log("USER ", userVal);

      if (step === 4) {
        fetchState(
          typeof userVal.country === "string"
            ? userVal.country
            : userVal.country.String
        );
      }
      if (step === 5) {
        fetchCity(userVal.state);
      }

      if (
        userVal?.displayname === "" &&
        window.location.href !== window.location.origin + "/onboarding?step=1" && step > 1
      ) {
        window.location.href = "/onboarding?step=1";
      } else if (
        userVal?.phone_no === "" &&
        window.location.href !== window.location.origin + "/onboarding?step=2" && step > 2
      ) {
        window.location.href = "/onboarding?step=2";
      } else if (
        userVal?.country === "" &&
        window.location.href !== window.location.origin + "/onboarding?step=3" && step > 3
      ) {
        window.location.href = "/onboarding?step=3";
      } else if (
        userVal?.state === "" &&
        window.location.href !== window.location.origin + "/onboarding?step=4" && step > 4
      ) {
        window.location.href = "/onboarding?step=4";
      } else if (
        userVal?.city === "" &&
        window.location.href !== window.location.origin + "/onboarding?step=5" && step > 5
      ) {
        window.location.href = "/onboarding?step=5";
      } else if (
        userVal?.pincode === "" &&
        window.location.href !== window.location.origin + "/onboarding?step=6" && step > 6
      ) {
        window.location.href = "/onboarding?step=6";
      } else if (
        userVal?.standard === "" &&
        window.location.href !== window.location.origin + "/onboarding?step=7" && step > 7
      ) {
        window.location.href = "/onboarding?step=7";
      } else if (
        userVal?.board === "" &&
        window.location.href !== window.location.origin + "/onboarding?step=8" && step > 8
      ) {
        window.location.href = "/onboarding?step=8";
      }
      // return userData;
    } catch (error) {
      console.error("Error fetching Users:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched or an error occurs
    }
  };
  // f7fcfc color

  useEffect(() => {
    const utoken = localStorage.getItem("token");
    if (!utoken) {
      router.push("/auth/login");
      return;
    }
    // setUserToken(utoken);
    fetchCountry();

    const user = fetchUser();

    //   {
    //     "display_name": "",
    //     "phone_no": "1234567890",
    //     "country": "india",
    //     "state": "Bihar",
    //     "city": "new delhi",
    //     "pin_code": "djdjdj",
    //     "standard": "12",
    //     "board": "cbse",
    //     "email": "lucky@gmail.com",
    //     "user_id": 1,
    //     "username": "Lucky Goyal"
    // }
  }, []);

  // useEffect(() => {
  //   if (user?.country) fetchState(user.country);
  // }, [user]);

  // useEffect(() => {
  //   if (user?.state) fetchCity(user.state);
  // }, [user]);

  const [selin, setSelin] = useState([
    {
      title: "Hey, champ! What's your name?",
      subtitle: "Don't worry. You can change it later.",
      comp: () => (
        <Input
          type="text"
          onChange={(e) => setVal(e.target.value)}
          placeholder="Name"
        />
      ),
    },
    {
      title: "What's your mobile number?",
      subtitle:
        "We won't spam you. You will receive only your test related information.",
      comp: () => <PhoneInput onChange={setVal} />,
    },
    {
      title: "Please select your country",
      subtitle: "",
      comp: (data) => (
        <SelectArea
          name="Country"
          areas={data}
          keyname="country_name"
          setVal={setVal}
        />
      ),
    },
    {
      title: "Please select your state",
      subtitle: "",
      comp: (data) =>
        country && (
          <SelectArea
            name="State"
            areas={data}
            keyname="state_name"
            setVal={setVal}
          />
        ),
    },
    {
      title: "Please select your city",
      subtitle: "",
      comp: (data) => (
        <SelectArea
          name="City"
          areas={data}
          keyname="city_name"
          setVal={setVal}
        />
      ),
    },
    {
      title: "Enter your PIN code",
      subtitle: "",
      comp: () => (
        <Input
          type="number"
          onChange={(e) => setVal(e.target.value)}
          placeholder="Pin Code"
        />
      ),
    },
    {
      title: "In which class are you currently in?",
      subtitle: "",
      comp: () => <SelectStandard setVal={setVal} />,
    },
    {
      title: "Please select your Class 12th Board",
      subtitle: "",
      comp: (setVal) => (
        <Select onValueChange={setVal}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Board" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {boards.map((board) => (
                <SelectItem value={board}>{board}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
    },
  ]);

  const handleClick = async () => {
    if (val === "") {
      toast({
        variant: "destructive",
        title: "Value cannot be empty",
      });
      return;
    }
    setStep(step + 1);
    console.log("vvvval", val, country, state, city);

    // if (step === 4) {
    //   fetchState(country);
    // }
    // if (step === 5) {
    //   fetchCity(state);
    // }
    // if (step === 6) {
    // }
    // const data = new URLSearchParams();
    // data.append(userKeys[step - 1], val);
    // console.log("avvv", data.toString(), { [userKeys[step - 1]]: val });
    const data = new URLSearchParams({ [userKeys[step - 1]]: val });
    const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL
    const userRes = await axios.patch(
      `${SERVER_BASE_URL}/user/profile`,
      // { [userKeys[step - 1]]: val },
      data,
      // new URLSearchParams().append(userKeys[step-1], val),
      {
        headers: {
          // "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const user = userRes.data;
    setUser(user); // Set the fetched country user
    console.log("USERzzz ", user);
    console.log("val", val);

    if (step + 1 > 8) {
      const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL
      await axios.patch(
        `${SERVER_BASE_URL}/user/profile`,
        { onboarding: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      router.push(`/dashboard`);
      return;
    }

    window.location.href = `/onboarding?step=${step + 1}`;
  };

  return (
    <div className="flex flex-col items-center border relative p-6 w-[50%]">
      <div className="-mt-16">
        <div className="bg-[#bf360c] w-fit py-4 px-7 rounded-[100%]">
          <h1 className="text-white text-5xl">{email[0].toUpperCase()}</h1>
        </div>
      </div>
      <div className="flex flex-col items-center mt-4">
        {loading ? (
          <div>
            <Loader />
          </div>
        ) : (
          <>
            {selin?.[step - 1] && <h1 className="text-xl pb-2">{selin[step - 1].title}</h1>}
            {selin?.[step - 1] && <p>{selin[step - 1].subtitle}</p>}
            <div className="mt-3 w-full">
              {selin?.[step - 1] &&

                selin[step - 1].comp(
                  step === 3
                    ? country
                    : step === 4
                      ? state
                      : step === 5
                        ? city
                        : step === 8
                          ? setVal
                          : undefined
                )}
            </div>
          </>
        )}
      </div>
      <div className="mt-4">
        <Button onClick={handleClick}>Save & Next</Button>
      </div>
    </div>
  );
}

export default OnboardCard;

// xilona4100@rowplant.com
// 1509|oioLTjRTG8GFPJXjy37027HjJiEPRuPE8PoHSStR

// USsP_8j2Id_Nd_UJLeyxSxIr7botM0CYY8xjw4ocCVJsPgLJZ8PKQfxa0WYi_fyHqag
// {
// "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ4aWxvbmE0MTAwQHJvd3BsYW50LmNvbSIsImFwaV90b2tlbiI6IlVTc1BfOGoySWRfTmRfVUpMZXl4U3hJcjdib3RNMENZWTh4anc0b2NDVkpzUGdMSlo4UEtRZnhhMFdZaV9meUhxYWcifSwiZXhwIjoxNzI4MzcxNzQ4fQ.kJ-LLVR4sg78Rkr89r3TDudTx8PvpEus2zuKuxvw1Dw"
// }
