import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaHourglassHalf, FaEdit, FaTrashAlt, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CustomerAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:4000/appointments");
        const data = await response.json();
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments by search term
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = appointments.filter((appointment) =>
      appointment.subject.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  // Sort appointments
  const handleSort = (field) => {
    setSortField(field);
    const sorted = [...filteredAppointments].sort((a, b) => {
      if (field === "date") {
        return new Date(a.date) - new Date(b.date);
      } else {
        return a[field].localeCompare(b[field]);
      }
    });
    setFilteredAppointments(sorted);
  };

  // Action buttons (Reschedule, Cancel)
  const handleReschedule = async (id) => {
    const newDate = prompt("Enter the new date (YYYY-MM-DD):");
    const newTime = prompt("Enter the new time (HH:MM):");

    if (!newDate || !newTime) {
      alert("Reschedule canceled: Date or time was not provided.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: newDate, time: newTime }),
      });

      if (!response.ok) {
        throw new Error("Failed to reschedule appointment.");
      }

      const updatedAppointments = appointments.map((appointment) =>
        appointment._id === id ? { ...appointment, date: newDate, time: newTime } : appointment
      );
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);

      alert("Appointment rescheduled successfully.");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("Error rescheduling appointment.");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/appointments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment.");
      }

      const updatedAppointments = appointments.filter((appointment) => appointment._id !== id);
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);

      alert("Appointment canceled successfully.");
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Error canceling appointment.");
    }
  };

  // Download appointments as PDF
  const downloadPDF = () => {
    const input = document.getElementById('pdf-content');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210; // PDF page width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save("appointments.pdf");
    });
  };

  return (
    <div className="container">
      <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          color: #333;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin-bottom: 20px;
        }

        .search-bar {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .search-bar input {
          padding: 8px;
          width: 200px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .appointments-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
        }

        .appointments-table thead {
          background-color: #4caf50;
          color: white;
        }

        .appointments-table th,
        .appointments-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
          transition: background-color 0.3s ease;
        }

        .appointments-table th {
          font-weight: 600;
        }

        .appointments-table tbody tr:hover {
          background-color: #f1f1f1;
        }

        .status {
          padding: 8px 15px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          font-size: 0.9rem;
          font-weight: bold;
          gap: 5px;
        }

        .status.scheduled {
          background-color: #ffeb3b;
          color: #856404;
        }

        .status.completed {
          background-color: #28a745;
          color: white;
        }

        .status.pending {
          background-color: #ffc107;
          color: #856404;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .action-buttons button {
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .action-buttons .reschedule {
          background-color: #007bff;
          color: white;
        }

        .action-buttons .cancel {
          background-color: #dc3545;
          color: white;
        }

        @media (max-width: 768px) {
          .appointments-table th,
          .appointments-table td {
            padding: 10px;
          }

          h2 {
            font-size: 1.5rem;
          }



          .buttons-group {
    display: flex;
    gap: 15px;
  }

  .custom-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4CAF50; /* Green background */
    color: white; /* White text */
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 0.9rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  .custom-button:hover {
    background-color: #45a049; /* Slightly darker green */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Add shadow effect */
  }

  .custom-button:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Focus shadow */
  }

  .pdf-button {
    background-color: #007bff; /* Blue background */
  }

  .pdf-button:hover {
    background-color: #0069d9; /* Darker blue on hover */
  }

  .button-icon {
    margin-right: 8px;
  }

  .search-bar input {
    padding: 8px;
    width: 200px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 20px;
  }
        }
      `}</style>

      <h2>Customer Appointments</h2>
      <div className="search-bar">
  <input
    type="text"
    placeholder="Search by Subject"
    value={searchTerm}
    onChange={handleSearch}
  />
  <div className="buttons-group">
    <button className="custom-button" onClick={() => handleSort("date")}>
      <FaClock className="button-icon" /> Sort by Date
    </button>
    <button className="custom-button" onClick={() => handleSort("subject")}>
      <FaEdit className="button-icon" /> Sort by Subject
    </button>
    <button className="custom-button pdf-button" onClick={downloadPDF}>
      <FaDownload className="button-icon" /> Download PDF
    </button>
  </div>
</div>
      <div id="pdf-content">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.subject}</td>
                <td>{appointment.phone}</td>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.time}</td>
                <td>
                  <span className={`status ${appointment.status.toLowerCase()}`}>
                    {appointment.status === "Completed" && <FaCheckCircle />}
                    {appointment.status === "Scheduled" && <FaClock />}
                    {appointment.status === "Pending" && <FaHourglassHalf />}
                    {appointment.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="reschedule" onClick={() => handleReschedule(appointment._id)}>
                    <FaEdit /> Reschedule
                  </button>
                  <button className="cancel" onClick={() => handleCancel(appointment._id)}>
                    <FaTrashAlt /> Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerAppointments;
