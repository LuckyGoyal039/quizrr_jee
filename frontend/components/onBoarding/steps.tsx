import { Input } from "../ui/input";
import { PhoneInput } from "../PhoneInput";
import { SelectArea } from "../SelectArea";

interface Step1Props {
    value: string;
    onChange: (value: string) => void;
}

export const Step1 = ({ value, onChange }: Step1Props) => {
    return (
        <div className="flex flex-col items-center mt-4">
            <h1 className="text-xl pb-2">Hey, champ! What's your name?</h1>
            <p>Don't worry. You can change it later.</p>
            <div className="mt-3 w-full flex justify-center">
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Name"
                />
            </div>
        </div>
    );
};

interface Step2Props {
    value: string;
    onChange: (value: string) => void;
}

export const Step2 = ({ value, onChange }: Step2Props) => {
    return (
        <div className="flex flex-col items-center mt-4">
            <h1 className="text-xl pb-2">What's your mobile number?</h1>
            <p>We won't spam you. You will receive only your test related information.</p>
            <div className="mt-3 w-full flex justify-center">
                <PhoneInput onChange={onChange} />
            </div>
        </div>
    );
};

interface Area {
    country_name: string;
    state_name: string;
    city_name: string;
}

interface Step3Props {
    value: string;
    onChange: (value: string) => void;
    countries: Area[];
}

export const Step3 = ({ value, onChange, countries }: Step3Props) => {
    return (
        <div className="flex flex-col items-center mt-4">
            <h1 className="text-xl pb-2">Please select your country</h1>
            <div className="mt-3 w-full flex justify-center">
                <SelectArea
                    name="Country"
                    areas={countries}
                    keyname="country_name"
                    setVal={onChange}
                />
            </div>
        </div>
    );
};

interface Area {
    country_name: string;
    state_name: string;
    city_name: string;
}

interface Step4Props {
    value: string;
    onChange: (value: string) => void;
    states: Area[];
}

export const Step4 = ({ value, onChange, states }: Step4Props) => {
    return (
        <div className="flex flex-col items-center mt-4">
            <h1 className="text-xl pb-2">Please select your state</h1>
            <div className="mt-3 w-full flex justify-center">
                <SelectArea
                    name="State"
                    areas={states}
                    keyname="state_name"
                    setVal={onChange}
                />
            </div>
        </div>
    );
};

interface Area {
    country_name: string;
    state_name: string;
    city_name: string;
}

interface Step5Props {
    value: string;
    onChange: (value: string) => void;
    cities: Area[];
}

export const Step5 = ({ value, onChange, cities }: Step5Props) => {
    return (
        <div className="flex flex-col items-center mt-4">
            <h1 className="text-xl pb-2">Please select your city</h1>
            <div className="mt-3 w-full flex justify-center">
                <SelectArea
                    name="City"
                    areas={cities}
                    keyname="city_name"
                    setVal={onChange}
                />
            </div>
        </div>
    );
};

interface Step6Props {
    value: string;
    onChange: (value: string) => void;
}

export const Step6 = ({ value, onChange }: Step6Props) => {
    return (
        <div className="flex flex-col items-center mt-4">
            <h1 className="text-xl pb-2">Enter your PIN code</h1>
            <div className="mt-3 w-full flex justify-center">
                <Input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Pin Code"
                />
            </div>
        </div>
    );
};


interface Step7Props {
    value: string;
    onChange: (value: string) => void;
}

const SelectStandard = ({ setVal }: { setVal: (value: string) => void }) => {
    return (
        <div className="flex justify-center gap-4">
            <Input
                value="Class 11"
                readOnly
                className="hover:border-black"
                onClick={(e) => setVal((e.target as HTMLInputElement).value)}
            />
            <Input
                value="Class 12"
                readOnly
                className="hover:border-black"
                onClick={(e) => setVal((e.target as HTMLInputElement).value)}
            />
            <Input
                value="First Time Dropper"
                readOnly
                className="hover:border-black"
                onClick={(e) => setVal((e.target as HTMLInputElement).value)}
            />
            <Input
                value="Second Time Dropper"
                readOnly
                className="hover:border-black"
                onClick={(e) => setVal((e.target as HTMLInputElement).value)}
            />
        </div>
    );
};

export const Step7 = ({ value, onChange }: Step7Props) => {
    return (
        <div className="flex flex-col items-center mt-4">
            <h1 className="text-xl pb-2">In which class are you currently in?</h1>
            <div className="mt-3 w-full flex justify-center">
                <SelectStandard setVal={onChange} />
            </div>
        </div>
    );
};

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface Step8Props {
    value: string;
    onChange: (value: string) => void;
}

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

export const Step8 = ({ value, onChange }: Step8Props) => {
    return (
        <div className="flex flex-col items-center mt-4">
            <h1 className="text-xl pb-2">Please select your Class 12th Board</h1>
            <div className="mt-3 w-full flex justify-center">
                <Select onValueChange={onChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Board" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {boards.map((board, index) => (
                                <SelectItem value={board} key={index}>
                                    {board}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};