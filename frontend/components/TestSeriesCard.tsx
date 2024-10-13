import Image from "next/image";
import { Badge } from "./ui/badge";

function TestSeriesCard({
  avatar = "",
  label = "Coming Soon",
  title = "",
  titleColor = "",
  labelColor = "",
  borderColor = "border-t-[#161c2d]",
  labelBg = "",
}) {
  return (
    <div className={`flex flex-col items-center shadow-md border-t-2 ${borderColor} p-8 m-5 w-80 transition-all hover:-translate-y-2`}>
      <Image
        width={48}
        height={48}
        alt="exam"
        src={avatar}
      />
      <h1 className={`font-bold my-2 ${titleColor}`}>{title}</h1>
      <Badge variant="secondary" className={`w-fit font-bold ${labelColor} ${labelBg}`}>
        {label}
      </Badge>
    </div>
  );
}
export default TestSeriesCard;