const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

const accountSid = "AC776024a223120f3168e55cbcf651a80e";
const authToken = "c880d1956f1daf8ba5ac5431b9b2e3fc";
const twilioPhoneNumber = "+12542764753";

const otpStorage = {};
app.post('/register', (req, res) => {
    const userData = req.body.user_data;
    const otp = generateOtp();
    otpStorage[userData] = otp;
  
    // Send OTP via SMS using Twilio
    const client = twilio(accountSid, authToken);
    client.messages
      .create({
        body: `Your OTP is: ${otp}`,
        from: twilioPhoneNumber,
        to: userData,
      })
      .then(() => {
        res.send('OTP has been sent to your registered contact information.');
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Failed to send OTP.');
      });
  });
  
  app.post('/verify', (req, res) => {
    const userData = req.body.user_data;
    const userOtp = req.body.otp;
  
    if (userData in otpStorage && otpStorage[userData] === userOtp) {
      delete otpStorage[userData];
      res.send('Verification successful. Access granted.');
    } else {
      res.send('Verification failed. Invalid OTP.');
    }
  });
  
  function generateOtp() {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });