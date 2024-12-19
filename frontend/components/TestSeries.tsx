import Link from "next/link";
import TestSeriesCard from "./TestSeriesCard";
import { Badge } from "./ui/badge";

function TestSeries() {
  return (
    <div id="testseries" className="w-full overflow-hidden lg:px-48">
      <div className="flex flex-col items-center my-8">
        <Badge className="text-[#df4759] bg-[rgb(223,71,89,0.1)] uppercase font-extrabold py-0 px-3 mb-2">
          Our Packs
        </Badge>
        <h1 className="text-3xl lg:text-6xl font-bold">Our Test Series</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center items-center gap-4">
        <Link href={"/"}>
          <TestSeriesCard
            avatar={"https://cdn.quizrr.in/web-assets/icons/exams/jee-main.png"}
            label={"October Batch"}
            title={"JEE Main 2025"}
            titleColor={"text-[#294bbb]"}
            labelColor={"text-[#df4759]"}
            borderColor={"border-t-[#df4759]"}
            labelBg={"bg-[rgb(223,71,89,0.1)]"}
          />
        </Link>
        <Link href={"/"}>
          <TestSeriesCard
            avatar={
              "https://cdn.quizrr.in/web-assets/icons/exams/jee-advanced.png"
            }
            label={"Just Launched"}
            title={"JEE Advanced 2025"}
            titleColor={"text-[#294bbb]"}
            labelColor={"text-[#42ba96]"}
            borderColor={"border-t-[#42ba96]"}
            labelBg={"bg-[rgba(66,186,150,0.1)]"}
          />
        </Link>
        <TestSeriesCard
          avatar={"https://cdn.quizrr.in/web-assets/icons/exams/bitsat.png"}
          title={"BITSAT 2025"}
        />
        <TestSeriesCard
          avatar={"	https://cdn.quizrr.in/web-assets/icons/exams/viteee.png"}
          title={"VITEEE Manipal SRM 2025"}
        />
        <TestSeriesCard
          avatar={
            "	https://cdn-assets.getmarks.app/app_assets/img/exams/ic_content_exam_ap_eamcet.png"
          }
          title={"AP & TS EAMCET 2025"}
        />
        <TestSeriesCard
          avatar={"https://cdn.quizrr.in/web-assets/icons/exams/wbjee.png"}
          title={"WBJEE 2025"}
        />
        <TestSeriesCard
          avatar={"https://cdn.quizrr.in/web-assets/icons/exams/ugee.png"}
          title={"UGEE 2025"}
        />
        <TestSeriesCard
          avatar={"	https://cdn.quizrr.in/web-assets/icons/exams/comedk.png"}
          title={"COMEDK & KCET 2025"}
        />
        <TestSeriesCard
          avatar={"https://cdn.quizrr.in/web-assets/icons/exams/mht-cet.png"}
          title={"MHT CET 2025"}
        />
      </div>
    </div>
  );
}
export default TestSeries;