import { useEffect, useState } from "react";

interface resData {
  remaining: number;
  rec_lmt: number;
  rec_usage: number;
}
interface RequestBody {
  c_limit: {
    cl: string;
  };
}

export const RecordUsage = () => {
  const [currentRecordUsage, setCurrentRecordUsage] = useState<number | null>(
    0
  );
  const [totalRecordsLimit, setTotalRecordsLimit] = useState<number | null>(0);
  const [remainingRecordCount, setRemainingRecordCount] = useState<
    number | null
  >(0);

  const requestBody: RequestBody = { c_limit: { cl: "ammu_gifts" } };
  useEffect(() => {
    const fetchRecord = async () => {
      const response = await fetch("http://localhost:3000/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data: resData = await response.json();
      console.log(data);
      setCurrentRecordUsage(data.rec_usage);
      setTotalRecordsLimit(data.rec_lmt);
      setRemainingRecordCount(data.remaining);
    };
    fetchRecord();
  }, []);
  return (
    <>
      <h1>Usage</h1>
      <table>
        <tbody>
          <tr>
            <th>Record usage</th>
            <th>Record Remaing</th>
          </tr>
          <tr>
            <td>
              <p>
                {currentRecordUsage
                  ? `${currentRecordUsage}/${totalRecordsLimit}`
                  : "Loading..."}
              </p>
            </td>
            <td>
              <p>{remainingRecordCount}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
