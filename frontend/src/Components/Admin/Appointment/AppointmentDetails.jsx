import React, { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AppointmentDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:4000/appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Convert search term to lowercase
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/appointments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted appointment from the state
        setAppointments(appointments.filter((appointment) => appointment._id !== id));
      } else {
        console.error("Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/appointments/${id}`, {
        method: 'PUT', // Use PATCH for partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Completed' }), // Set the new status
      });
  
      if (response.ok) {
        // Update the status locally
        setAppointments(appointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: 'Completed' }
            : appointment
        ));
      } else {
        console.error("Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const emailMatch = appointment.email.toLowerCase().includes(searchTerm);
    const phoneMatch = appointment.phone.toString().includes(searchTerm);
    return emailMatch || phoneMatch;
  });

  const handleDownload = () => {
    const doc = new jsPDF();
    const marginLeft = 55;

    doc.setDrawColor(0);
    doc.setLineWidth(2);
    doc.roundedRect(10, 20, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 40, 10, 10, 'D');

    doc.setFontSize(15);
    doc.text('Appointments Report', 90, 35);

    const headers = [['Email', 'Phone', 'Subject', 'Date', 'Time', 'Notes', 'Status']];
    const data = filteredAppointments.map((item) => [
      item.email,
      item.phone,
      item.subject,
      new Date(item.date).toLocaleDateString(),
      item.time,
      item.note,
      item.status
    ]);

    const columnStyles = {
      0: { columnWidth: 35 },
      1: { columnWidth: 25 },
      2: { columnWidth: 30 },
      3: { columnWidth: 30 },
      4: { columnWidth: 12 },
      5: { columnWidth: 30 },
      6: { columnWidth: 20 }
    };

    const end = "<<< This is an auto-generated report. All rights reserved. >>>";

    doc.autoTable({
      startY: 50,
      head: headers,
      body: data,
      columnStyles: columnStyles,
    });

    doc.setFontSize(10);
    doc.text(end, marginLeft, doc.internal.pageSize.height - 10);

    doc.save('Appointments_Report.pdf');
  };

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
          width: 100px;
          text-align: center;
        }

        .status.scheduled {
          background-color: #e6f4ea;
          color: #34a853;
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

        .complete-button {
          background-color: #4285f4;
          color: #fff;
          border: none;
          padding: 5px 10px;
          margin-right: 5px;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by email or phone"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button className="add-button" onClick={handleDownload}>
          Download PDF
        </button>
      </div>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Phone</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Time</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.email}</td>
              <td>{appointment.phone}</td>
              <td>{appointment.subject}</td>
              <td>{new Date(appointment.date).toLocaleDateString()}</td>
              <td>{appointment.time}</td>
              <td>{appointment.note}</td>
              <td>
                <span className={`status ${appointment.status.toLowerCase()}`}>
                  {appointment.status}
                </span>
              </td>
              <td>
                <button 
                  className="delete-button" 
                  onClick={() => handleDelete(appointment._id)}
                >
                  Delete
                </button>
                <button
                  className="complete-button"
                  onClick={() => handleComplete(appointment._id)}
                >
                  Complete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentDetails;
