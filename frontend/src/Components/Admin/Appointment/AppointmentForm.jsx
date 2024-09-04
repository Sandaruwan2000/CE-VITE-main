import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';


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

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null); // State to hold data for the modal

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateTimeSlot = (time) => {
    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9]) (AM|PM) to ([01]?[0-9]|2[0-3]):([0-5][0-9]) (AM|PM)$/;
    return timePattern.test(time);
  };

  const validatePhone = (phone) => {
    const phonePattern = /^0\d{9}$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateTimeSlot(formData.time)) {
      setErrors({
        ...errors,
        time: 'Time slot must be in the format "2:00 PM to 4:00 PM"',
      });
      return;
    }

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
        setModalData(formData); // Store form data for the modal
        setOpenModal(true);
        // Reset form data
        setFormData({
          email: 'saman@gmail.com',
          subject: '',
          phone: '',
          date: '',
          time: '',
          note: '',
        });
        setErrors({ time: '', phone: '' });
      } else {
        alert('Error adding appointment!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container maxWidth="sm">
      <div className='background' style={{
        backgroundImage: `url("https://images.pexels.com/photos/3768588/pexels-photo-3768588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`
      }}></div>


      <div className="overlay"></div>
      <style>
        {`
        .background{
        position: fixed; 
        top: 0;
       left: 0;
       right: 0;
      bottom: 0;
       background-size: cover;
        background-position: center;
        filter: blur(10px); 
       z-index: -1;
        }
 
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.6); 
  z-index: 0;
}
`
        }
      </style>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          marginTop: 4,
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#1976d2',
            marginBottom: 4,
            fontSize: '1.8rem',
          }}
        >
          Add Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                InputProps={{ sx: { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                type="text"
                name="phone"
                placeholder="0123456789"
                value={formData.phone}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{ sx: { borderRadius: '8px' } }}
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
                InputProps={{ sx: { borderRadius: '8px' } }}
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
                InputProps={{ sx: { borderRadius: '8px' } }}
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
                InputProps={{ sx: { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                }}
              >
                Add Appointment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            width: '400px',
            textAlign: 'center',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#4caf50',
            marginBottom: 2,
          }}
        >
          <CheckCircleOutline sx={{ fontSize: '2rem', marginRight: '8px' }} />
          Appointment Added Successfully!
        </DialogTitle>
        <DialogContent sx={{ padding: '0 16px', lineHeight: 1.75 }}>
          <Typography variant="body1" sx={{ marginBottom: '16px' }}>
            Your appointment has been scheduled.
          </Typography>
          {modalData && (
            <>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                <strong>Subject:</strong> {modalData.subject}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                <strong>Phone:</strong> {modalData.phone}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                <strong>Date:</strong> {modalData.date}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                <strong>Time Slot:</strong> {modalData.time}
              </Typography>
              {modalData.note && (
                <Typography variant="body2">
                  <strong>Notes:</strong> {modalData.note}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentForm;
