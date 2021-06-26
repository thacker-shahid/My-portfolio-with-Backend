require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
// const contact_form_table = require('./models/contactForm');


// Creating express server.
const app = express();

// It tells express server that our view engine is "ejs"
app.set("view engine", "ejs");

// When the app.post routes bring data from html/ejs 
// file then this actually Parses that data to use it.   
app.use(bodyParser.urlencoded({ extended: true }));

// This tells express server to use public folder 
// to render public files like CSS, JavaScript, Images.
app.use(express.static('public'));

// Connecting Nodejs Application to database called contactFormDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// This is just a collection/Table schema/structure.
const contactFormSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  number: {
    type: Number,
    required: true,
    trim: true
  },
  text: String
});


// This will create new collection inside contactFormDB database.
const contact_form_table = mongoose.model("contactFormTable", contactFormSchema);


app.get('/', (req, res) => {
  res.render("index");
});

app.post('/', (req, res) => {
  
  let formData = new contact_form_table({
    name: req.body.formName,
    email: req.body.formEmail,
    number: req.body.formNumber,
    text: req.body.formText
  });


    contact_form_table.create(formData, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("Successfully inserted new row into table !!")

      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.USER_MAIL, 
          pass: process.env.USER_PASS 
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let receivers = ["tauheedshahid@gmail.com", req.body.formEmail]; 
      receivers.forEach((receiver) => {
        let mailOptions = {
          from: req.body.formEmail,
          to: receiver, 
          subject: 'Contact form submitted successfully',
          text: "Hello, " + req.body.formName + "Your Contact Form Details are: \n\n" + "Username: " + req.body.formName + "\nE-mail: " + req.body.formEmail + "\nPhone: " + req.body.formNumber + "\nMessage: " + req.body.formText
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });

      }); 

      res.redirect('/');
    }
  });
});


const PORT = process.env.PORT || 3000 || "www.tauheedshahid.in" || "tauheedshahid.in";

app.listen(PORT, () => {
  console.log("Server started at port 3000");
});