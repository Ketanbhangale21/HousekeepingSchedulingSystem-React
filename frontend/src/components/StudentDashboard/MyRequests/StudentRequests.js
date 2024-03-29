import React, { useEffect, useState } from "react";
import "./studentreq.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const StudentRequest = () => {
  const [errors, setErrors] = useState("");
  const [stdid, setStdid] = useState("");
  const [studentEmail, setstudentEmail] = useState("");

  const [requestDetails, setRequestDetails] = useState({
    date: new Date(), // Initial date value
    selectedTime: "",
    requestTypes: [],
  });
  useEffect(() => {
    setstudentEmail(sessionStorage.getItem("UserEmail"));
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3005/api/students");
        const userData = response.data.filter(
          (user) => user.email === studentEmail
        );
        if (userData.length > 0) {
          // Get all request IDs associated with the user
          setStdid(userData[0].stdid);
          // console.log(stdid);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [stdid, studentEmail]);
  const generateUniqueID = async () => {
    return "RQ" + Math.floor(100000 + Math.random() * 900000);
  };
  const handleChange = async (e) => {
    const { name, value, checked } = e.target;
    if (name === "requestType") {
      const updatedRequestTypes = checked
        ? [...requestDetails.requestTypes, value]
        : requestDetails.requestTypes.filter((type) => type !== value);
      setTimeout(() => {
        setRequestDetails({
          ...requestDetails,
          requestTypes: updatedRequestTypes,
        });
      }, 0);
    } else if (name === "selectAll") {
      const allOptions = checked ? requestOptions : [];
      setTimeout(() => {
        setRequestDetails({ ...requestDetails, requestTypes: allOptions });
      }, 0);
    } else {
      setRequestDetails({ ...requestDetails, [name]: value });
    }
  };
  const handleDateChange = (date) => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    setRequestDetails({ ...requestDetails, date: formattedDate });
    // console.log(formattedDate);
  };

  const handleTimeClick = (selectedTime) => {
    setRequestDetails({ ...requestDetails, time: selectedTime, selectedTime });
  };
  const generateTimeCells = () => {
    const timeSlots = [];
    const startTime = 9;
    const endTime = 17;

    for (let hour = startTime; hour <= endTime; hour++) {
      for (let minute of ["00", "30"]) {
        const period = hour >= 12 ? "PM" : "AM";
        const fh = hour % 12 || 12;
        const timeSlot = `${fh}:${minute} ${period}`;
        timeSlots.push(
          <div
            key={timeSlot}
            className={`cell py-1 ${
              requestDetails.selectedTime === timeSlot ? "selected" : ""
            }`}
            onClick={(e) => {
              handleTimeClick(timeSlot);
              setErrors("");
            }}
          >
            <span>&nbsp;</span>
            {timeSlot}
          </div>
        );
      }
    }

    return <div className="time-slots">{timeSlots}</div>;
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    // console.log(requestDetails.date);
    // console.log(requestDetails.time);
    // console.log(requestDetails.requestTypes);
    if (
      !requestDetails.date ||
      !requestDetails.time ||
      !requestDetails.requestTypes
    ) {
      setErrors("Please Select Date,Time and Requests from above");
      return false;
    }
    try {
      const newID = await generateUniqueID();
      let dataObj = {};
      dataObj.reqid = newID;
      dataObj.date = requestDetails.date;
      dataObj.timings = requestDetails.time;
      dataObj.reqs = requestDetails.requestTypes;
      dataObj.status = "Created";
      dataObj.stdid = stdid;
      // console.log(dataObj);
      await axios.post("http://localhost:3005/api/requests", dataObj);
      await axios.put(
        `http://localhost:3005/api/students/request/${stdid}`,
        dataObj
      );
      // console.log(dataObj);
      alert("Request created Successfully");
      clear();
    } catch {}
  };
  const clear = () => {
    setTimeout(() => {
      setRequestDetails({
        ...requestDetails,
        date: "",
        selectedTime: "",
        requestTypes: [],
      });
    }, 0);
  };
  const requestOptions = [
    "Mopping",
    "Dusting",
    "Cleaning",
    "Sweeping",
    "Bed Cleaning",
    "Washroom Cleaning",
  ];

  return (
    <div className="maincontainer">
      <div className="outercontainer">
        <div className="card-container">
          <form>
            <div className="card1">
              <label className="title">
                <h4 className="design">Date:</h4>

                <Calendar
                  onChange={(e) => {
                    handleDateChange(e);
                    setErrors("");
                  }}
                  value={requestDetails.date}
                  className="calendar"
                />
              </label>
            </div>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <div className="card1">
              <label className="title">
                <h4 className="design">Time:</h4>
                {generateTimeCells()}
              </label>
            </div>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <div className="card1">
              <div className="request">
                <h4 className="design">Request:</h4>
                <label
                  className="title text-left mt-5 "
                  style={{ marginLeft: "15px" }}
                >
                  <input
                    type="checkbox"
                    name="selectAll"
                    checked={
                      requestDetails.requestTypes.length ===
                      requestOptions.length
                    }
                    onChange={handleChange}
                  />
                  <span>&nbsp;&nbsp;</span>
                  Select All
                </label>
                {requestOptions.map((option) => (
                  <label
                    key={option}
                    className="title text-left"
                    style={{ marginLeft: "15px" }}
                  >
                    <input
                      type="checkbox"
                      name="requestType"
                      value={option}
                      checked={requestDetails.requestTypes.includes(option)}
                      onChange={(e) => {
                        handleChange(e);
                        setErrors("");
                      }}
                    />
                    <span>&nbsp;&nbsp;</span>
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <br />
            <button
              type="button"
              className="btn btn-primary create"
              onClick={handleCreate}
            >
              Create
            </button>
            {errors && <div className="errorMessage">{errors}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRequest;
