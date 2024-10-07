import Image from "next/image"

function ExamBadge({src, title='JEE Advanced'}: {src: string, title: string}) {
  return (
    <div className="flex flex-col items-center px-5">
        <div>
            <Image width={48} height={48} alt={title} src={src || "https://cdn.quizrr.in/web-assets/icons/exams/jee-main.png"} />
        </div>
        <p className="my-2">{title}</p>
    </div>
  )
}
export default ExamBadge