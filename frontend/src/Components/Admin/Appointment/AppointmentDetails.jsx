
import React, { useState } from "react";

const Appointment = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const appointments = [
  ];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.phone.includes(searchTerm)
  );

  return (
    <div className="container">

      <style>{`
  .container {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
  }

  .search-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .search-input {
    width: 60%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .add-button {
    background-color: #6c63ff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  .appointments-table {
    width: 100%;
    border-collapse: collapse;
  }

  .appointments-table th,
  .appointments-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }

  .appointments-table th {
    background-color: #f4f4f4;
  }

  .status {
    padding: 5px 10px;
    border-radius: 5px;
    display: inline-block;
    width: 100px; /* Fixed width */
    text-align: center; /* Center the text */
  }

  .status.open {
    background-color: #e6f4ea;
    color: #34a853;
  }

  .status.completed {
    background-color: #fce8e6;
    color: #ea4335;
  }

  .edit-button,
  .delete-button,
  .view-button {
    background-color: #34a853;
    color: #fff;
    border: none;
    padding: 5px 10px;
    margin-right: 5px;
    border-radius: 5px;
    cursor: pointer;
  }

  .delete-button {
    background-color: #ea4335;
  }

  .view-button {
    background-color: #4285f4;
  }
`}</style>


      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button className="add-button">+ Add Appointment</button>
      </div>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Appointment Date & Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment, index) => (
            <tr key={index}>
              <td>{appointment.firstName}</td>
              <td>{appointment.lastName}</td>
              <td>{appointment.phone}</td>
              <td>{appointment.dateTime}</td>
              <td>
                <span className={`status ${appointment.status === "Open" ? "open" : "completed"}`}>
                  {appointment.status}
                </span>
              </td>
              <td>
                <button className="edit-button">Edit</button>
                <button className="delete-button">Delete</button>
                <button className="view-button">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointment;
