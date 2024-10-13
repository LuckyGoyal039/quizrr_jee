import { Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

function Syllabus() {
  return (
    <div>
      <div className="">
        <Badge>ALL DETAILS OF BATCH 2</Badge>
        <h1>Chapterwise & Full Syllabus</h1>
        <h1 className="text-red-600">JEE Advanced Test Series</h1>
      </div>
      <div className="grid grid-cols-2 space-x-8">
        <div className="">
          <h5>
            Why is our full syllabus test series better than any other available
            test series?
          </h5>
          <p>
            The most important reason is that it is the most relevant for JEE
            Advanced. The questions are extremely relevant and as per the
            difficulty of the questions asked at the exam. Other key features:
          </p>
          <div className="flex flex-col gap-y-6 py-6">
            <div className="flex space-x-2">
              <p className="bg-yellow-400 rounded-full w-fit h-fit p-1">
                <Star size={12} color="#000000" strokeWidth={1} />
              </p>
              <p>15 Page In-Depth Performance Analysis</p>
            </div>
            <div className="flex space-x-2">
              <p className="bg-yellow-400 rounded-full w-fit h-fit p-1">
                <Star size={12} color="#000000" strokeWidth={1} />
              </p>
              <p>
                10 (20 in Total) Full Syllabus Tests with Video & Textual
                Solutions
              </p>
            </div>
            <div className="flex space-x-2">
              <p className="bg-yellow-400 rounded-full w-fit h-fit p-1">
                <Star size={12} color="#000000" strokeWidth={1} />
              </p>
              <p>10 Part Tests with Video & Textual Solutions</p>
            </div>
            <div className="flex space-x-2">
              <p className="bg-yellow-400 rounded-full w-fit h-fit p-1">
                <Star size={12} color="#000000" strokeWidth={1} />
              </p>
              <p>JEE Advanced 2024 - 2007 Previous Year Papers as Mocks</p>
            </div>
          </div>
          <div className="mt-8">
            <Button>Download Schedule</Button>
          </div>
        </div>
        <div className="">
          <h5>
            Why is the chapterwise test series very important for JEE Advanced?
          </h5>
          <p>
            Tests are integral part of a student&apos;s preparation and we don&apos;t give
            enough importance to them. That is where the chapter wise test
            series is very important. Prepare a chapter & test yourself with
            different pattern of questions.
          </p>
          <div className="flex flex-col gap-y-6 py-6">
            <div className="flex space-x-2">
              <p className="bg-yellow-400 rounded-full w-fit h-fit p-1">
                <Star size={12} color="#000000" strokeWidth={1} />
              </p>
              <p>70 Chapter-wise Tests</p>
            </div>
            <div className="flex space-x-2">
              <p className="bg-yellow-400 rounded-full w-fit h-fit p-1">
                <Star size={12} color="#000000" strokeWidth={1} />
              </p>
              <p>Covers Different Type of Qs asked at JEE Advanced</p>
            </div>
            <div className="flex space-x-2">
              <p className="bg-yellow-400 rounded-full w-fit h-fit p-1">
                <Star size={12} color="#000000" strokeWidth={1} />
              </p>
              <p>All Tests with Textual Solutions</p>
            </div>
            <div className="flex space-x-2">
              <p className="bg-yellow-400 rounded-full w-fit h-fit p-1">
                <Star size={12} color="#000000" strokeWidth={1} />
              </p>
              <p>15 Page In-Depth Performance Analysis</p>
            </div>
            <div className="flex space-x-2">
              <p className="bg-yellow-400 rounded-full w-fit h-fit p-1">
                <Star size={12} color="#000000" strokeWidth={1} />
              </p>
              <p>1800+ Highly Selective Questions for Practice</p>
            </div>
          </div>
          <div className="mt-8">
            <Button>Download Schedule</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Syllabus;
