const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
const uri = "mongodb+srv://rajeshgupta01457:EWPGPv3PxmWN4JWv@cluster0.jru8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Connect to MongoDB
mongoose.connect(uri);

// Define user schema and model
const userEmailVerification = new mongoose.Schema({
  email: { type: String, unique: true },
  emailVerified: { type: Boolean, default: false },
  emailToken: String
});



const userDetailsSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: {
    type: String,
    minlength: 8,
    maxlength: 20,
    match: /^[a-zA-Z0-9]+$/, // must not contain any special characters or spaces
  },
  password: {
    type: String,
    minlength: 8,
    validate: [
      {
        validator: function (v) {
          return /(?=.*\d)(?=.*[A-Z])(?!.*(.)\1{2,})/.test(v);
        },
        message: props => `${props.value} must contain at least 1 number and 1 UPPER case letter and not contain sequences or repeated characters!`
      },
      {
        validator: function (v) {
          return !/(.)\1{3,}|(0123|1234|2345|3456|4567|5678|6789|7890|0987|9876|8765|7654|6543|5432|4321|3210|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|zyxw|yxwv|xwvu|wvut|vuts|utsr|tsrq|srqp|rqpo|qpon|ponm|onml|nmlk|mlkj|lkji|kji|jihg|ihgf|hgfe|gfed|fedc|edcb|dcba|dcbb|ccba|bbab|baba|aa)/
            .test(v);
        },
        message: props => `${props.value} contains sequences or repeated characters!`
      }
    ]
  }
});

const emailVerification = mongoose.model('emailVerification', userEmailVerification);
const UserDetails = mongoose.model('userDetails', userDetailsSchema);


// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error verifying transporter:', error);
  } else {
    console.log('Server is ready to send emails.');
  }
});

// Helper function to generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Email registration route
app.post('/register-email', async (req, res) => {
  const { email } = req.body;
  const emailToken = generateOtp();

  // Log the request body to check if it contains the correct data
  console.log('Register Email Request Body:', req.body);

  if (!email) {
    return res.status(400).send('Email is required.');
  }

  try {
    // Update or create the email verification document
    const user = await emailVerification.findOneAndUpdate(
      { email },
      { email, emailToken, emailVerified: false },
      { upsert: true, new: true }
    );

    // Log the user document to ensure it has been created/updated correctly
    console.log('Email Verification Document:', user);

    // Update or create the user details document with the email
    const document3 = await UserDetails.findOneAndUpdate(
      { email },
      { $set: { email } }, // Ensure the email is set using $set
      { upsert: true, new: true }
    );

    // Log the updated document
    console.log('Updated Document3 after email registration:', document3);

    // Send email verification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is ${emailToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).send('Error sending email verification.');
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).json({ email });
      }
    });
  } catch (err) {
    console.error('Error registering email:', err);
    res.status(500).send('Error registering email.');
  }
});






/// Email verification route
app.post('/verify-email', async (req, res) => {
  const { emailToken } = req.body;
  try {
    const user = await emailVerification.findOne({ emailToken });

    if (!user) {
      return res.status(400).send('Invalid verification code.');
    }

    // Update email verification status
    user.emailVerified = true;
    user.emailToken = null; // Clear the token once it is used
    await user.save();



    // Delete document1
    await emailVerification.findByIdAndDelete(user._id);

    res.send('Email verified successfully.');
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).send('Error verifying email.');
  }
});





// Set login details route
app.post('/set-login-details', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Append username and password to document3
    const updatedUser = await UserDetails.findOneAndUpdate(
      { email },
      { $set: { username, password } }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found. Please verify email and phone first.' });
    }

    res.json({ message: 'Login details saved successfully' });
  } catch (error) {
    console.error('Error creating login details:', error);
    res.status(500).json({ message: 'Error creating login details. Please try again.' });
  }
});

// Resend OTP for email route
app.post('/resend-email-otp', async (req, res) => {
  const { email } = req.body;
  const emailToken = generateOtp();

  try {
    const user = await emailVerification.findOneAndUpdate(
      { email },
      { emailToken }
    );


    if (!user) {
      return res.status(404).json({ message: 'Email not registered.' });
    }

    // Resend email verification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is ${emailToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error resending email:', error);
        return res.status(500).send('Error resending email verification.');
      } else {
        console.log('Email resent:', info.response);
        console.log('Email Verification Document:', user);
        return res.status(200).json({ email });
      }
    });
  } catch (err) {
    console.error('Error resending email OTP:', err);
    res.status(500).send('Error resending email OTP.');
  }
});



// Server listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
