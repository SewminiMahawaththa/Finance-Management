import React,{useState,useEffect, useRef} from "react";
import {Modal,Form,Input,Select, message, Table,DatePicker} from "antd";
import axios from 'axios';
import moment from "moment";
import Analytics from "../components/Analytics";
import { useReactToPrint } from "react-to-print";
import logo from "../Images/it21308598.jpg";

const { RangePicker } = DatePicker;

export default function Report() {

  const[loading,setLoading] = useState(false);
  const [allTransection , setAllTransection] = useState([]);
  const [frequency,setFrequency] = useState("30");
  const [selectedDate, setSelectedate] = useState([]);
  const [type,setType] = useState("all");
  const [viewData,setViewData] = useState("table");


      {/*table data */}
    
      const columns = [
        {
          title:"Date",
          dataIndex:"date",
          render : (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>,
        },
        {
          title:"Amount",
          dataIndex:"amount",
        },
        {
          title:"Type",
          dataIndex:"type",
        },
        {
          title:"Category",
          dataIndex:"category",
        },
        {
          title:"Reference",
          dataIndex:"reference",
        },
    ]
     //useEffect Hook
  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res= await axios.post("/transections/get-transection", {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setLoading(false);
        setAllTransection(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error("Fetch Issue With Transaction");
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type] );

  //Creating Printing Fnction
  const componentPDF = useRef();
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle:"Finance Report ",
    onAfterPrint:()=>alert("Saved in PDF")
  });



  return (
    <div className="container mt-5">

    <button className="custom-btn" 
          onClick={generatePDF}
          >
          Print Report
          </button>

          <div ref={componentPDF} style={{width:"100%"}}>
          <div className="container mt-2">
          <br></br>
          <img src={logo} style={{width:'10%', height:'10%'}}></img>
          <br></br>
          <br></br>
            <h5>Isuru Salon</h5>
            <br></br>
            <h6>  225/2J</h6>
            <h6>  High Level Road</h6>
            <h6>  Homagama</h6>
            <br></br>
            <center><h4>Monthly Finance Report</h4></center>
          </div>
    <div className="container mt-3 p3 mt-4 rounded-3">

    <div className="content">
        {viewData === "table" ? (
        <Table columns={columns} dataSource={allTransection} />
         ) : (
       <Analytics allTransection={allTransection} />
        )}
          
        </div>
       

        </div>
        </div>
    </div>
    
  
  )
}
