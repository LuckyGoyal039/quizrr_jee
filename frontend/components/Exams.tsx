import Image from "next/image";

function Exams() {
  const exams = [
    { title: "JEE Main", src: "https://cdn.quizrr.in/web-assets/icons/exams/jee-main.png" },
    { title: "JEE Advanced", src: "https://cdn.quizrr.in/web-assets/icons/exams/jee-advanced.png" },
    { title: "BITSAT", src: "https://cdn.quizrr.in/web-assets/icons/exams/bitsat.png" },
    { title: "UGEE", src: "https://cdn.quizrr.in/web-assets/icons/exams/ugee.png" },
    { title: "COMEDK", src: "https://cdn.quizrr.in/web-assets/icons/exams/comedk.png" },
    { title: "KCET", src: "https://cdn.quizrr.in/web-assets/icons/exams/kcet.png" },
    { title: "AP EAMCET", src: "https://cdn-assets.getmarks.app/app_assets/img/exams/ic_content_exam_ap_eamcet.png" },
    { title: "TS EAMCET", src: "https://cdn-assets.getmarks.app/app_assets/img/exams/ic_content_exam_ts_eamcet.png" },
    { title: "WBJEE", src: "https://cdn.quizrr.in/web-assets/icons/exams/wbjee.png" },
    { title: "MHT CET", src: "https://cdn.quizrr.in/web-assets/icons/exams/mht-cet.png" },
    { title: "VITEEE", src: "https://cdn.quizrr.in/web-assets/icons/exams/viteee.png" },
    { title: "Manipal (MET)", src: "https://cdn.quizrr.in/web-assets/icons/exams/manipal.png" },
    { title: "SRMJEEE", src: "https://cdn.quizrr.in/web-assets/icons/exams/srmjeee.png" },
  ];

  return (
    <div className="flex justify-center w-full bg-[#f9fbfd] overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-4 py-8 w-full max-w-[1024px]">
        {exams.map(({ title, src }) => (
          <div key={title} className="flex flex-col items-center px-2">
            <Image
              width={48}
              height={48}
              alt={title}
              src={src}
              className="w-12 h-12 sm:w-16 sm:h-16"
              layout="intrinsic"
            />
            <p className="my-2 text-center text-sm">{title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exams;
