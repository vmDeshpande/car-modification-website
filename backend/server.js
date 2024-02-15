const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const config = require('./config');

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
    modifications: { type: String, required: true },
});

const CarModification = mongoose.model('CarModification', carModificationSchema);

app.use(bodyParser.json());

app.post('/api/submit-modification', async (req, res) => {
    try {
        const newModification = new CarModification({
            customerName: req.body.customerName,
            customerPhoneNumber: req.body.customerPhoneNumber,
            customerEmail: req.body.customerEmail,
            carModel: req.body.carModel,
            carNumber: req.body.carNumber,
            modifications: req.body.modifications,
        });

        await newModification.save();

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


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
