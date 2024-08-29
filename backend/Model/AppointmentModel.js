const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  dateTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
