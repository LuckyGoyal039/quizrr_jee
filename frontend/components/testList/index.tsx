'use client';

import { useState } from "react";
import TestCard from "./testCard"; // Ensure the correct case for imports

export default function TestList() {
  const [testList, setTestList] = useState([{
    batch: "September Batch",
    target: "Target 99+ Percentile",
    title: "JEE Main 2025 Test Series (Droppers)",
    tests: [
      '30 Full Tests',
      '12 Quizrr Part Tests',
      '471 Chapter-wise Tests & 2024 - 2020 PYQs as Mocks',
    ],
    buttonText: "Buy Now",
    viewPacksText: "View Packs"
  },
  {
    batch: "September Batch",
    target: "Target 99+ Percentile",
    title: "JEE Main 2025 Test Series (Droppers)",
    tests: [
      '30 Full Tests',
      '12 Quizrr Part Tests',
      '471 Chapter-wise Tests & 2024 - 2020 PYQs as Mocks',
    ],
    buttonText: "Buy Now",
    viewPacksText: "View Packs"
  },
  {
    batch: "September Batch",
    target: "Target 99+ Percentile",
    title: "JEE Main 2025 Test Series (Droppers)",
    tests: [
      '30 Full Tests',
      '12 Quizrr Part Tests',
      '471 Chapter-wise Tests & 2024 - 2020 PYQs as Mocks',
    ],
    buttonText: "Buy Now",
    viewPacksText: "View Packs"
  },
  {
    batch: "September Batch",
    target: "Target 99+ Percentile",
    title: "JEE Main 2025 Test Series (Droppers)",
    tests: [
      '30 Full Tests',
      '12 Quizrr Part Tests',
      '471 Chapter-wise Tests & 2024 - 2020 PYQs as Mocks',
    ],
    buttonText: "Buy Now",
    viewPacksText: "View Packs"
  },
  {
    batch: "September Batch",
    target: "Target 99+ Percentile",
    title: "JEE Main 2025 Test Series (Droppers)",
    tests: [
      '30 Full Tests',
      '12 Quizrr Part Tests',
      '471 Chapter-wise Tests & 2024 - 2020 PYQs as Mocks',
    ],
    buttonText: "Buy Now",
    viewPacksText: "View Packs"
  }]);

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          testList.map((ele, index) => (
            <li key={index}>
              <TestCard
                batch={ele.batch}
                target={ele.target}
                title={ele.title}
                tests={ele.tests}
                buttonText={ele.buttonText}
                viewPacksText={ele.viewPacksText}
              />
            </li>
          ))
        }
      </ul>
    </>
  );
}
