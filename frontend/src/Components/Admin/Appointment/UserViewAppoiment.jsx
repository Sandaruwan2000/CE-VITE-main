
const UserViewAppoiment = () => {
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
      setSearchTerm(event.target.value);
    };
  
    const filteredAppointments = appointments.filter((appointment) =>
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.toString().includes(searchTerm)
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
        `}</style>
  
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by email or phone"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {/* <button className="add-button">+ Add Appointment</button> */}
        </div>
        <table className="appointments-table">
          <thead>
            <tr>
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
  
  export default UserViewAppoiment;