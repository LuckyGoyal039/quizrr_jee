"use client"

import { useState } from "react"
import { Input } from "./ui/input"

function Notebook() {
  const [value, setValue] = useState('')
  // const [notes, setNotes] = useState([])
  return (
    <div>
      <div className="">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <div className="">
        <div className=""></div>
        <div className=""></div>
      </div>
    </div>
  )
}
export default Notebook