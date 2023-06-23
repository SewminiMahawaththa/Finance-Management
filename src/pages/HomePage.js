import React,{useState,useEffect} from "react";
import {Modal,Form,Input,Select, message, Table,DatePicker} from "antd";
import {UnorderedListOutlined, AreaChartOutlined,EditOutlined,DeleteOutlined} from "@ant-design/icons"; 
import Layout from "../components/Layout/Layout";
import axios from 'axios';
import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal,setShowModal] = useState(false);
  const[loading,setLoading] = useState(false);
  const [allTransection , setAllTransection] = useState([]);
  const [frequency,setFrequency] = useState("365");
  const [selectedDate, setSelectedate] = useState([]);
  const [type,setType] = useState("all");
  const [viewData,setViewData] = useState("table");
  const [editable,setEditable] = useState(null);
  
  const navigate =useNavigate();

  //table data
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
    {
      title:"Actions",
      render : (text, record) => (
        <div>
          <EditOutlined onClick={() => {
            setEditable(record);
            setShowModal(true);
          }} />
          <DeleteOutlined 
          className="mx-2" 
          onClick={() => {
            handleDelete(record);
          }} 
          />
        </div>
      ),
    },
  ];

  //getall transactions


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

//delete handler
const handleDelete = async (record) => {
  try {
    setLoading(true);
    await axios.post("/transections/delete-transection", {
      transacationId:record._id,
    });
    setLoading(false);
    message.success("Transaction Deleted!");
  } catch (error) {
    setLoading(false);
    console.log(error);
    message.error("Unable to delete");
  }
};

  //form handling
  const handleSubmit = async (values) => {
    try { 
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if(editable){
        await axios.post('/transections/edit-transection', {
         payload:{
            ...values,
            userId:user._id,
         },
         transacationId: editable._id,
        });
        setLoading(false);
        message.success('Transaction Updated Successfully');

      }else{
        await axios.post("/transections/add-transection", {
          ...values, 
          userid: user._id,
        });
        setLoading(false);
        message.success("Transaction Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error('Failed to add transaction');
    }
  };

  const [search, setSearch] =useState('');
  console.log(search);

  

  return (
    <Layout>
      {loading && <Spinner />}
        <div className="filters">
        <div>
        <div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Search here..." aria-label="Recipient's username" aria-describedby="button-addon2" 
  onChange={(e) => setSearch(e.target.value)}/>
  <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
</div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="365">LAST 1 Year</Select.Option>
            <Select.Option value="30">LAST 1 Month</Select.Option>
            <Select.Option value="7">LAST 1 Week</Select.Option>
            <Select.Option value="custom">custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker 
              value={selectedDate} 
              onChange={(values) => setSelectedate(values)}
          />
          )}
        </div>
      
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
            
          </Select>
        </div>
      
        <div className="switch-icons">
            <UnorderedListOutlined 
              className={`mx-2 ${
                viewData === "table" ? "active-icon" : "inactive-icon"
              }`} 
              onClick={() => setViewData("table")} 
            />
            <AreaChartOutlined 
            className={`mx-2 ${
              viewData === "analytics" ? "active-icon" : "inactive-icon"
            }`} 
            onClick={() => setViewData("analytics")}
          />
        </div>
          <button className="custom-btn" 
          onClick={() => setShowModal(true)}
          >
          Add Transaction
          </button>

          <button className="custom-btn" 
          onClick={() => navigate("/report")}
          >
          Generate Report
          </button>
        </div>
        <div>
        </div>
        <div className="content">
        
        {viewData === "table" ? (
        <Table columns={columns} dataSource={allTransection} />
         ) : (
           <Analytics allTransection={allTransection} />
        )}
          
        </div>
        <Modal title= {editable ? "Edit Transaction" : "Add Transection"}
        open={showModal} 
        onCancel={() => setShowModal(false)}
        footer={false}
        > 
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
       
          <Form.Item label="Amount" name="amount">
            <Input type="text" required/>
          </Form.Item>
          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="income" required>Income</Select.Option>
              <Select.Option value="expense" required>Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="stationery">Stationery</Select.Option>
              <Select.Option value="suppliercharges">Supplier charges</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="transport">Transport</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
              <Select.Option value="services">Services</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
         
            <Input type="date"  required/>
         
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" required/>
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" required/>
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="custom-btn">
            {" "}
            SAVE
            </button>
          </div>
        </Form>
        </Modal>
    </Layout>
  );
};

export default HomePage;