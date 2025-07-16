import React, { useEffect, useState } from "react";

interface resData {
  rec_count:number;
  remaining: number;
  rec_lmt: number;
  rec_usage: number;
}
interface RequestBody {
  c_limit: {
    cl: string;
  };
}

interface FormData{
  name:string;
  email:string;
  message:string;
}

interface TableItem {
  id: number;
  created_at: string;
  form_type: string;
  body: string;
}

export const RecordUsage = () => {
  const [currentRecordUsage, setCurrentRecordUsage] = useState<number | null>(0);
  const [totalRecordsLimit, setTotalRecordsLimit] = useState<number | null>(0);
  const [remainingRecordCount, setRemainingRecordCount] = useState<number | null>(0);
  const [currentRecordCount,setCurrentRecordCount]= useState<number |null>(0)
  const [formData,setFormData] = useState<FormData>({name:'',email:'',message:''})
  const [tableData, setTableData] = useState<TableItem[]>([]);




  const requestBody: RequestBody = { c_limit: { cl: "ammu_gifts" } };
  useEffect(() => {
    const fetchRecord = async () => {
      // try {
        console.log("Try-success")
        const response = await fetch('http://localhost:3000/check', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        console.log("response",response)
        if (!response.ok) throw new Error("Request failed");
        const data: resData = await response.json();
        console.log("data",data)

        setCurrentRecordUsage(data.rec_usage);
        setTotalRecordsLimit(data.rec_lmt);
        setRemainingRecordCount(data.remaining);
        setCurrentRecordCount(data.rec_count)
      // } catch (error) {
      //   console.error("Error fetching data:", error);
      // }
    };
    fetchRecord();
  }, []);


  useEffect(() => {
    const fetchTableData = async () => {
      const response = await fetch("http://localhost:3000/get-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ c_limit: { cl: "ammu_gifts" } }),
      });

      const result = await response.json();
        setTableData(result.data);

    };
    console.log(tableData)
    fetchTableData();
  }, []);

  const handleFormDataChange = (event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
    const {name,value} = event.target;
    setFormData(prev=>({...prev,[name]:value}))
  }
  console.log("formData",formData)

  interface FormDataBody{
    c_limit:{
      cl:string;
    },
    c_body:{
      form_type :string;
      created_at:string;
      body:FormData
    }
  }
  const formDataBody :FormDataBody= { c_limit: { cl: "ammu_gifts" },c_body:{form_type:"testForm",created_at:new Date().toISOString(),body:formData} }
  const handleSubmit = async ()=>{
    const FormDataRequest = await fetch('http://localhost:3000/add-client',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(formDataBody)
    })
    const FormDataResponse = await FormDataRequest.json()
    console.log("FormDataResponse",FormDataResponse)
    setFormData({name:'',email:'',message:''})
  }
  return (
    <>

<div className="flex flex-col space-y-4">
  <div className="flex items-center">
    <label className="w-20 text-right mr-4">Name</label>
    <input 
      type="text" 
      name="name"
      value={formData.name} 
      onChange={handleFormDataChange}
      className="border rounded px-3 py-2 flex-1"
    />
  </div>
  
  <div className="flex items-center">
    <label className="w-20 text-right mr-4">Email</label>
    <input 
      type="email" 
      name="email"
      value={formData.email} 
      onChange={handleFormDataChange}
      className="border rounded px-3 py-2 flex-1"
    />
  </div>
  
  <div className="flex items-center">
    <label className="w-20 text-right mr-4">Message</label>
  <textarea
  name="msg"
  value={formData.message}
  onChange={handleFormDataChange}
  className="border rounded px-3 py-2 flex-1"
  rows={3}
/>
  </div>
  <button onClick={handleSubmit}>Submit</button>
</div>
      <h1>Usage</h1>
      <table>
        <tbody>
          <tr>
            <th>Record usage</th>
            <th>Record Remaing</th>
            <th>Email </th>
          </tr>
          <tr>
            <td>
              <p>
                {currentRecordUsage
                  ? `${currentRecordCount}/${totalRecordsLimit}`
                  : "Loading..."}
              </p>
            </td>
            <td>
              <p>{remainingRecordCount}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <h1>Report</h1>
        <table className="border mt-2 w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>Form Type</th>
            <th>Name (From Body)</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((item) => {
              let parsedBody: any = {};
              try {
                parsedBody = JSON.parse(item.body);
              } catch (err) {
                parsedBody = {};
              }
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.created_at}</td>
                  <td>{item.form_type}</td>
                  <td>{parsedBody.name || "-"}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4}>Loading data...</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};