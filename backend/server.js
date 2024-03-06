const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const config = require('./config');
const axios = require('axios')

const app = express();
const port = 3000;
try {
    mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database connection established...');
} catch (error) {
    console.log(`cannot connect to Mongoose ${error.message}`);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.static('frontend'));
app.set('view engine', 'ejs');
app.use(express.json());
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html')
});
app.use('/style.css', express.static(__dirname + '/frontend/css/style.css'));

const carModificationSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerPhoneNumber: { type: String, required: true },
    customerEmail: { type: String, required: false },
    carModel: { type: String, required: true },
    carNumber: { type: String, required: true },
    suggestions:{ type: String, required: false},
    modifications: { type: String, required: true },
});

const CarModification = mongoose.model('CarModification', carModificationSchema);

app.use(bodyParser.json());

app.post('/api/submit-modification', async (req, res) => {
    try {

        const existingModification = await CarModification.findOne({ carNumber: req.body.carNumber });

        if (existingModification) {
            return res.status(400).json({ message: 'Car with the provided number already exists.' });
        }
        const newModification = new CarModification({
            customerName: req.body.customerName,
            customerPhoneNumber: req.body.customerPhoneNumber,
            customerEmail: req.body.customerEmail,
            carModel: req.body.carModeltext,
            carNumber: req.body.carNumber,
            suggestions: req.body.suggestions,
            modifications: req.body.modifications,
        });

        await newModification.save();

        const phoneNumber = req.body.customerPhoneNumber;
        const suggestions = req.body.suggestions;
        const modifications = req.body.modifications;
        await sendSMS(phoneNumber, suggestions, modifications);

        res.status(201).json({ message: 'Car modification submitted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/api/get-modifications', async (req, res) => {
  try {
      const allModifications = await CarModification.find();
      res.status(200).json(allModifications);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/check-authentication', async (req, res) => {
  try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (user && user.password === password) {
          res.status(200).json({ message: 'Authentication successful.' });
      } else {
          res.status(401).json({ message: 'Authentication failed.' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});

const sendSMS = async (phoneNumber, modifications, suggestions) => {
    try {
         const totalAmount = Math.ceil(Math.random() * 9000) + 1000;

         const currentDate = new Date();
         const dateAfter3Days = new Date(currentDate);
         dateAfter3Days.setDate(dateAfter3Days.getDate() + 3);
 
         const suggestionsArray = Array.isArray(suggestions) ? suggestions : [suggestions];
         const modificationsArray = Array.isArray(modifications) ? modifications : [modifications];

         const message = `Thank you for submitting the car modification details. Your services will be processed.\n
Services added: ${suggestionsArray.join(', ')}, ${modificationsArray.join(', ')}\n
Total Amount: ${totalAmount} INR\n
Date after 3 days: ${dateAfter3Days.toDateString()}`;
         console.log(message)
        const response = await axios.post(
            'https://www.fast2sms.com/dev/bulkV2',
            {
                route: 'q',
                message: message,
                language: 'english',
                flash: 0,
                numbers: phoneNumber,
            },
            {
                headers: {
                    authorization: '1TYD4PWytQQiPTEikImlKgrl8vigGcyxpOmpRGgStpXoQ0hN9P4mYXYiHaIu',
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('SMS sent successfully:', response);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
