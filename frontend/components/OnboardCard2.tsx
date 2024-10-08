"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
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

function OnboardCard2() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState(Number(params.get("step")));

  const [val, setVal] = useState("");

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ4aWxvbmE0MTAwQHJvd3BsYW50LmNvbSIsImFwaV90b2tlbiI6IlVTc1BfOGoySWRfTmRfVUpMZXl4U3hJcjdib3RNMENZWTh4anc0b2NDVkpzUGdMSlo4UEtRZnhhMFdZaV9meUhxYWcifSwiZXhwIjoxNzI4MzcxNzQ4fQ.kJ-LLVR4sg78Rkr89r3TDudTx8PvpEus2zuKuxvw1Dw";
  const email = "test@example.com";

  const [country, setCountry] = useState([]);

  const fetchCountry = async () => {
    console.log("tok", token);
    fetch("https://www.universal-tutorial.com/api/countries/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Set the Bearer token in the Authorization header
        Accept: "application/json", // Optional, depending on the API
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json(); // Assuming the API returns JSON data
      })
      .then((data) => {
        setCountry(data);
        setSelin([...selin, selin[step].comp(data)]);
        console.log(data); // Handle the returned data
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  useEffect(() => {
    fetchCountry();
    // setSelin(selin)
  }, []);

  const [selin, setSelin] = useState([
    {
      title: "Hey, champ! What's your name?",
      subtitle: "Don't worry. You can change it later.",
      comp: (
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
      comp: <PhoneInput onChange={setVal} />,
    },
    {
      title: "Please select your country",
      subtitle: "",
      comp: (
        <SelectArea
          name="Country"
          areas={country}
          key="country_name"
          setVal={setVal}
        />
      ),
      // comp: <CountrySelect />,
    },
    {
      title: "Please select your state",
      subtitle: "",
      comp:(
        <SelectArea
          name="State"
          areas={country}
          key="state_name"
          setVal={setVal}
        />
      ),
    },
    {
      title: "Please select your city",
      subtitle: "",
      comp:  (
        <SelectArea
          name="City"
          areas={country}
          key="city_name"
          setVal={setVal}
        />
      ),
    },
    // { title: "Enter your PIN code", subtitle: "", comp: "" },
    // {
    //   title: "In which class are you currently in?",
    //   subtitle: "",
    //   comp: "",
    // },
    // {
    //   title: "Please select your Class 12th Board",
    //   subtitle: "",
    //   comp: "",
    // },
  ]);

  const handleClick = () => {
    setStep(step + 1);
    if (step + 1 > 8) {
      setStep(1);
      router.push(`/onboarding?step=${1}`);
      return;
    }
    console.log("val", val);
    router.push(`/onboarding?step=${step + 1}`);
  };

  const displayArr = [<StepOne />,<StepTwo />,<StepThree />]

  return(
    <div className="">
      {/* {displayArr[step-1]} */}
      {[<StepOne />,<StepTwo />,<StepThree />][step-1]}
    </div>
  )
  // switch (step) {
  //   case 1:
  //     return <StepOne />;
  //     break;
  //   case 2:
  //     return <StepTwo />;
  //     break;
  //   case 3:
  //     return <StepThree />;
  //     break;
  //   default:
  //     break;
  // }

  // return (
  //   <div className="flex flex-col items-center border relative p-6 mt-20">
  //     {/* <div className="absolute -top-10 left-[45%]"> */}
  //     <div className="-mt-16">
  //       <div className="bg-[#bf360c] w-fit py-4 px-7 rounded-[100%]">
  //         <h1 className="text-white text-5xl">{email[0].toUpperCase()}</h1>
  //       </div>
  //     </div>
  //     <div className="flex flex-col items-center mt-4">
  //       {JSON.stringify(val)}
  //       {selin?.[step - 1] && <h1>{selin[step - 1].title}</h1>}
  //       {selin?.[step - 1] && <p>{selin[step - 1].subtitle}</p>}
  //       {selin?.[step - 1] && selin[step - 1].comp()}
  //     </div>
  //     <div className="">
  //       <Button onClick={handleClick}>Save & Next</Button>
  //     </div>
  //   </div>
  // );
}
export default OnboardCard2;

const StepOne = () => {
  return (
    <div className="flex flex-col items-center border relative p-6 mt-20">
      {/* <div className="absolute -top-10 left-[45%]"> */}
      <div className="-mt-16">
        <div className="bg-[#bf360c] w-fit py-4 px-7 rounded-[100%]">
          <h1 className="text-white text-5xl">{email[0].toUpperCase()}</h1>
        </div>
      </div>
      <div className="flex flex-col items-center mt-4">
        {JSON.stringify(val)}
        {selin?.[step - 1] && <h1>{selin[step - 1].title}</h1>}
        {selin?.[step - 1] && <p>{selin[step - 1].subtitle}</p>}
        {selin?.[step - 1] && selin[step - 1].comp}
      </div>
      <div className="">
        <Button onClick={handleClick}>Save & Next</Button>
      </div>
    </div>
  );
};
const StepTwo = () => {
  return (
    <div className="flex flex-col items-center border relative p-6 mt-20">
      {/* <div className="absolute -top-10 left-[45%]"> */}
      <div className="-mt-16">
        <div className="bg-[#bf360c] w-fit py-4 px-7 rounded-[100%]">
          <h1 className="text-white text-5xl">{email[0].toUpperCase()}</h1>
        </div>
      </div>
      <div className="flex flex-col items-center mt-4">
        {JSON.stringify(val)}
        {selin?.[step - 1] && <h1>{selin[step - 1].title}</h1>}
        {selin?.[step - 1] && <p>{selin[step - 1].subtitle}</p>}
        {<PhoneInput onChange={setVal} />}
        {/* {selin?.[step - 1] && selin[step - 1].comp} */}
      </div>
      <div className="">
        <Button onClick={handleClick}>Save & Next</Button>
      </div>
    </div>
  );
};

const StepThree = ({selin}) => {
  return (
    <div className="flex flex-col items-center border relative p-6 mt-20">
      {/* <div className="absolute -top-10 left-[45%]"> */}
      <div className="-mt-16">
        <div className="bg-[#bf360c] w-fit py-4 px-7 rounded-[100%]">
          <h1 className="text-white text-5xl">{email[0].toUpperCase()}</h1>
        </div>
      </div>
      <div className="flex flex-col items-center mt-4">
        {JSON.stringify(val)}
        {selin?.[2] && <h1>{selin[2].title}</h1>}
        {selin?.[2] && <p>{selin[2].subtitle}</p>}
        {country && (
          <SelectArea
          name="Country"
          areas={country}
          key="country_name"
          setVal={setVal}
        />
        )}
      </div>
      <div className="">
        <Button onClick={handleClick}>Save & Next</Button>
      </div>
    </div>
  );
};

// xilona4100@rowplant.com
// 1509|oioLTjRTG8GFPJXjy37027HjJiEPRuPE8PoHSStR

// USsP_8j2Id_Nd_UJLeyxSxIr7botM0CYY8xjw4ocCVJsPgLJZ8PKQfxa0WYi_fyHqag
// {
// "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ4aWxvbmE0MTAwQHJvd3BsYW50LmNvbSIsImFwaV90b2tlbiI6IlVTc1BfOGoySWRfTmRfVUpMZXl4U3hJcjdib3RNMENZWTh4anc0b2NDVkpzUGdMSlo4UEtRZnhhMFdZaV9meUhxYWcifSwiZXhwIjoxNzI4MzcxNzQ4fQ.kJ-LLVR4sg78Rkr89r3TDudTx8PvpEus2zuKuxvw1Dw"
// }
