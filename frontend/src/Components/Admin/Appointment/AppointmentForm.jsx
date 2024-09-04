import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Container,
} from '@mui/material';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    email: 'saman@gmail.com',
    subject: '',
    phone: '',
    date: '',
    time: '',
    note: '',
  });
  
  const [errors, setErrors] = useState({
    time: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateTimeSlot = (time) => {
    // Regular expression to match time format "2:00 PM to 4:00 PM"
    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9]) (AM|PM) to ([01]?[0-9]|2[0-3]):([0-5][0-9]) (AM|PM)$/;
    return timePattern.test(time);
  };

  const validatePhone = (phone) => {
    // Regular expression to match exactly 10 digits starting with 0
    const phonePattern = /^0\d{9}$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate time slot
    if (!validateTimeSlot(formData.time)) {
      setErrors({
        ...errors,
        time: 'Time slot must be in the format "2:00 PM to 4:00 PM"',
      });
      return;
    }

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      setErrors({
        ...errors,
        phone: 'Phone number must start with 0 and be exactly 10 digits long',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Appointment added successfully!');
        // Reset form data
        setFormData({
          subject: '',
          phone: '',
          date: '',
          time: '',
          note: '',
        });
        setErrors({ time: '', phone: '' }); // Clear errors
      } else {
        alert('Error adding appointment!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Add Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                type="text" // Changed from number to text to handle exact 10 digit input
                name="phone"
                placeholder='0123456789'
                value={formData.phone}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Time Slot"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="2:00 PM to 4:00 PM"
                required
                error={!!errors.time}
                helperText={errors.time}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="note"
                value={formData.note}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Add Appointment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AppointmentForm;
