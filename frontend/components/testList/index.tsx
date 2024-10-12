'use client';

import { useEffect, useState } from "react";
import TestCard from "./testCard"; // Ensure the correct case for imports
import axios from "axios";

export default function TestList() {
  const [testList, setTestList] = useState([]);

  async function getTestList() {
    const token = localStorage.getItem("token");
    const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

    try {
      const resp = await axios.get(`${SERVER_BASE_URL}/user/test-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const respData = resp.data;
      console.log(respData);

      // Transforming the response data into the desired format
      const formattedData = respData.map(item => ({
        batch: item.batch,
        target: item.target,
        title: item.name,  // Use 'name' as 'title'
        tests: item.description.split('$*'),  // Split description to get tests array
        buttonText: "Buy Now",
        viewPacksText: "View Packs",
      }));

      // Set the transformed data to the state
      setTestList(formattedData);
    } catch (error) {
      console.error("Error fetching test list:", error);
    }
  }
  useEffect(() => {
    getTestList();
  }, [])

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
