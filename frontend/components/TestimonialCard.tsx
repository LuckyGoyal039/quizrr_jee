import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

function TestimonialCard({ name, percentile, text, video }) {
  const regex = /\/embed\/([a-zA-Z0-9_-]+)/;
  const val = video.match(regex)[1];
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
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                width="100%"
                height="100%"
                // width="560"
                // height="315"
                src={video}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-2">
        <p className="text-[#869ab8] tracking-wide text-lg">
          {text}
        </p>
      </div>
      <Separator className="my-6 opacity-50" />
      <div className="flex justify-between">
        <div className="">
          <h1 className="text-lg font-bold tracking-wide">{name}</h1>
          <div className="flex gap-1">
            <p>Found it </p>
            <p className="text-[#df4759] relative after:content-[''] after:absolute after:-bottom-[7px] after:left-0 after:w-full after:h-[16px] after:bg-no-repeat after:bg-contain after:bg-[url('https://www.mathongo.com/public/brand/quizrr/assets/img/underline_red.svg')]">
              Most Relevant
            </p>
          </div>
        </div>
        <div className="">
          <p className="text-[#df4759] uppercase font-bold tracking-widest">
            {percentile}{' '} percentile
          </p>
        </div>
      </div>
    </div>
  );
}
export default TestimonialCard;
