import Image from "next/image"
import { Badge } from "./ui/badge"

function TestSeriesCard({avatar, }) {
  return (
    <div className="flex flex-col items-center shadow-md border-t-red-400 p-8 m-5 w-80">
      {/* <div className=""> */}
        <Image width={48} height={48} alt="exam" src={'https://cdn.quizrr.in/web-assets/icons/exams/wbjee.png'}/> 
      {/* </div> */}
      <h1 className="font-bold my-2">WBJEE 2025</h1>
      <Badge variant="secondary" className="w-fit ">Coming Soon</Badge>
    </div>
  )
}
export default TestSeriesCard