"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Loader from "../loader/index";
import SmallLoader from "../loader/SmallLoader";
import { Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8 } from "./steps";
import countryData from "../../data/countries.json";
import statesData from "../../data/states.json";
import cityData from "../../data/cities.json";

export interface User {
    email: string;
    displayname?: string;
    phone_no?: string;
    country?: string | { String: string };
    state?: string;
    city?: string;
    pincode?: string;
    standard?: string;
    board?: string;
}
interface Area {
    country_name: string;
    state_name: string;
    city_name: string;
}

const countries = countryData;
const states = statesData as Record<string, { state_name: string }[]>;
const cities = cityData as Record<string, { city_name: string }[]>;

const OnboardCard = () => {
    const router = useRouter();
    const params = useSearchParams();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [val, setVal] = useState("");
    const [user, setUser] = useState<User>();
    const userEmail = useRef<string>("");
    const [nextStepLoading, setNextStepLoading] = useState(false);

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
    const [filteredStates, setFilteredStates] = useState<Area[]>([]);
    const [filteredCities, setFilteredCities] = useState<Area[]>([]);
    console.log(filteredCities, filteredStates)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        const fetchUser = async () => {
            try {
                setLoading(true);
                const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
                const userRes = await axios.get(`${SERVER_BASE_URL}/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = userRes.data;
                setUser(userData);
                userEmail.current = userData.email;

                // Redirect for incomplete steps
                const redirectStep = userKeys.findIndex((key) => !userData[key]) + 1;
                if (redirectStep > 0 && redirectStep < step) {
                    router.push(`/onboarding?step=${redirectStep}`);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                toast({ variant: "destructive", title: "Failed to fetch user data" });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [params]);

    useEffect(() => {
        const currentStep = Number(params.get("step")) || 1;
        setStep(currentStep);

        if (currentStep === 3) fetchCountry();
        if (user?.country && currentStep === 4) {
            const selectedCountry =
                typeof user.country === "string" ? user.country : user.country.String;
            fetchState(selectedCountry);
        }
        if (user?.state && currentStep === 5) {
            fetchCity(user.state);
        }
    }, [params, user]);

    const fetchCountry = async () => {
        setNextStepLoading(true);
        // Country fetching logic if external API needed
        setNextStepLoading(false);
    };

    const fetchState = async (selectedCountry: string) => {
        setNextStepLoading(true);
        try {
            if (states.hasOwnProperty(selectedCountry)) {
                const filtered = states[selectedCountry].map((state) => ({
                    country_name: selectedCountry,
                    state_name: state.state_name,
                    city_name: "",
                }));
                setFilteredStates(filtered);
            } else {
                setFilteredStates([]);
            }
        } catch (error) {
            console.error("Error fetching states:", error);
        } finally {
            setNextStepLoading(false);
        }
    };

    const fetchCity = async (selectedState: string) => {
        setNextStepLoading(true);
        try {
            const country = user?.country && typeof user.country === "string" ? user.country : "";
            if (cities.hasOwnProperty(selectedState)) {
                const filtered = cities[selectedState].map((city) => ({
                    country_name: country,
                    state_name: selectedState,
                    city_name: city.city_name,
                }));
                setFilteredCities(filtered);
            } else {
                setFilteredCities([]);
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setNextStepLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!val) {
            toast({ variant: "destructive", title: "Value cannot be empty" });
            return;
        }

        try {
            setNextStepLoading(true);
            const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
            const data = new URLSearchParams({ [userKeys[step - 1]]: val });
            console.log('userval', val, data)

            await axios.patch(`${SERVER_BASE_URL}/user/profile`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (step === 8) {
                await axios.patch(
                    `${SERVER_BASE_URL}/user/profile`,
                    { onboarding: true },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                router.push(`/dashboard`);
                return;
            }
            router.push(`/onboarding?step=${step + 1}`);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({ variant: "destructive", title: "Failed to update profile" });
        } finally {
            setNextStepLoading(false);
        }
    };

    const renderStep = () => {
        const mappedStates = states[user?.country as string] || [];
        const mappedCities = cities[user?.state as string] || [];
        console.log('user', user, mappedStates, mappedCities);
        switch (step) {
            case 1:
                return <Step1 value={val} onChange={setVal} />;
            case 2:
                return <Step2 value={val} onChange={setVal} />;
            case 3:
                return <Step3 value={val} onChange={setVal} countries={countries} />;
            case 4:
                return <Step4 value={val} onChange={setVal} states={mappedStates} />;
            case 5:
                return <Step5 value={val} onChange={setVal} cities={mappedCities} />;
            case 6:
                return <Step6 value={val} onChange={setVal} />;
            case 7:
                return <Step7 value={val} onChange={setVal} />;
            case 8:
                return <Step8 value={val} onChange={setVal} />;
            default:
                return null;
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="flex flex-col items-center border relative p-6 w-[50%] max-sm:w-[80%]">
            <div className="-mt-16">
                <div className="bg-[#bf360c] w-fit py-4 px-7 rounded-[100%]">
                    <h1 className="text-white text-5xl">
                        {userEmail.current[0]?.toUpperCase()}
                    </h1>
                </div>
            </div>
            {renderStep()}
            <div className="mt-4">
                <Button onClick={handleSubmit} className="w-24">
                    {nextStepLoading ? <SmallLoader /> : "Save & Next"}
                </Button>
            </div>
        </div>
    );
};

export default OnboardCard;
