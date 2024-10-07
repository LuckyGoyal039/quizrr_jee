import TestSeriesCard from "./TestSeriesCard"
import { Badge } from "./ui/badge"

function TestSeries() {
  return (
    <div>
        <div className="flex flex-col items-center my-8">
            <Badge className="text-[#df4759] bg-[rgb(223,71,89,0.1)] uppercase font-extrabold py-0 px-3 mb-2" >Our Packs</Badge>
            <h1 className="text-6xl font-bold">Our Test Series</h1>
        </div>
        <div className="grid grid-cols-3">
            <TestSeriesCard />
            <TestSeriesCard />
            <TestSeriesCard />
            <TestSeriesCard />
            <TestSeriesCard />
            <TestSeriesCard />
            <TestSeriesCard />
            <TestSeriesCard />
            <TestSeriesCard />
        </div>
    </div>
  )
}
export default TestSeries