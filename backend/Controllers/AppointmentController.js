const Appointment = require("../Model/AppointmentModel");

exports.createAppointment = async (req, res) => {
  try {
    const { customerId, dateTime, status } = req.body;

    const newAppointment = new Appointment({
      customerId,
      dateTime,
      status,
    });

    await newAppointment.save();
    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dateTime, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { dateTime, status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res
      .status(200)
      .json({ message: "Appointment updated successfully", appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
