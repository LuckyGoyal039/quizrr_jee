import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

function TestimonialCard({ name, percentile, text, video }: { name: string, percentile: string, text: string, video: string }) {
  const regex = /\/embed\/([a-zA-Z0-9_-]+)/;
  const val = video.match(regex)?.[1];
  return (
    <div className="p-8 border-t-[#335eea] rounded">
      {/* <div className=""><Image /></div> */}
      <div className="flex justify-center items-center ">
        {/* Card */}
        <Dialog>
          <DialogTrigger asChild>
            {/* <div className="card cursor-pointer border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"> */}
            <Image
              src={`https://img.youtube.com/vi/${val}/hqdefault.jpg`}
              alt="Thumbnail"
              className="rounded-lg w-full h-auto cursor-pointer"
              width={480}
              height={360}
            />
            {/* </div> */}
          </DialogTrigger>

          {/* Popup Modal for YouTube Video */}
          <DialogContent className="p-0 max-w-2xl">
            <div className="h-96 w-full">
              <iframe
                width="100%"
                height="100%"
                // width="560"
                // height="315"
                src={video}
                title="YouTube video player"

                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-2">
        <p className="text-[#869ab8] tracking-wide">
          {text}
        </p>
      </div>
      <Separator className="my-6 opacity-50" />
      <div className="flex justify-between flex-col lg:flex-row lg:justify-between w-full">
        <div className="w-full flex text-sm lg:text-lg justify-between lg:justify-start lg:gap-4">
          <h1 className="font-bold tracking-wide overflow-ellipsis line-clamp-1 w-36">{name}</h1>
          <p className="text-[#df4759] uppercase font-bold text-[12px] md:text-lg">
            {percentile}{' '} percentile
          </p>

        </div>
        <div className="flex gap-5 w-full">
          <p className="">Found it </p>
          <p className="text-red-500 relative after:content-[''] after:absolute after:-bottom-[6px] after:left-0 after:w-full after:h-[16px] after:bg-no-repeat after:bg-contain after:bg-[url('https://www.mathongo.com/public/brand/quizrr/assets/img/underline_red.svg')] text-[12px] lg:text-lg">
            Most Relevant
          </p>
        </div>
      </div>
    </div>
  );
}
export default TestimonialCard;