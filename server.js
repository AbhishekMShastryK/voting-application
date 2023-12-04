const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
require("dotenv").config()
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;
const nodemailer = require('nodemailer');

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'voting_application',
});

app.post('/register', (req,res) => {
  const sql = "INSERT INTO user_registrations (`name`,`emailid`,`password`,`confirmpwd`,`mobilenumber`,`age`,`address`,`zipcode`,`drivingLicense`,`passportNumber`,`status`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.emailid,
    req.body.password,
    req.body.confirmpwd,
    req.body.mobilenumber,
    req.body.age,
    req.body.address,
    req.body.zipcode,
    req.body.drivingLicense,
    req.body.passportNumber,
    req.body.status,

  ]
  db.query(sql,[values],(err,data) => {
    if(err) {
      return res.json("Error");
    }
    return res.json(data);
  })
})

app.post('/login', (req, res) => {
  const sql = "SELECT * FROM approved_users WHERE `voterid` = ? AND `password` = ?";
  const { voterId, password } = req.body;
  db.query(sql, [voterId, password], (err, data) => {
    if(err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json("Success")
    }
    else {
      return res.json("Failure")
    }
  })

});

app.get('/user_registrations', (req, res) => {
  const { status } = req.query;
  const sql = "SELECT * FROM user_registrations WHERE `status` = ?";
  db.query(sql, [status], (err, data) => {
    if(err) {
      console.error('Error fetching pending user registrations:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(data);
    }
  });
});

app.post('/approved_user_table', (req,res) => {
  const sql = "INSERT INTO approved_users (`voterid`,`name`,`password`,`emailid`,`mobilenumber`,`age`,`fulladdress`,`drivingLicense`,`passportNumber`) VALUES (?)";
  const values = [
    req.body.voterid,
    req.body.name,
    req.body.password,
    req.body.emailid,
    req.body.mobilenumber,
    req.body.age,
    req.body.fulladdress,
    req.body.drivingLicense,
    req.body.passportNumber,
  ]
  db.query(sql,[values],(err,data) => {
    if(err) {
      return res.json("Error");
    }
    return res.json(data);
  })
})

app.post('/update_user_status', (req,res) => {
  const sql = "UPDATE user_registrations SET `status` = ? WHERE `drivingLicense` = ?";
  const { status, drivingLicense} = req.query;
  db.query(sql,[status, drivingLicense],(err,data) => {
    if(err) {
      return res.json("Error");
    }
    return res.json(data);
  })
})

app.get('/search_pending_users', (req, res) => {
  const searchTerm = req.query.searchTerm;
  const sql = "SELECT * FROM user_registrations WHERE `name` LIKE ? OR `zipcode` = ?";
  db.query(sql, [`%${searchTerm}%`, searchTerm], (err, data) => {
    if (err) {
      console.error('Error searching pending users:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(data);
    }
  });
});

app.post('/election_setup', (req, res) => {
  const formData = req.body;
  fs.readFile(path.join(__dirname, 'electionData.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ message: 'Error reading data from the file' });
    } else {
      let jsonArray = data ? JSON.parse(data) : [];
      jsonArray.push(formData);
      fs.writeFile(path.join(__dirname, 'electionData.json'), JSON.stringify(jsonArray, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
          res.status(500).json({ message: 'Error storing data in the file' });
        } else {
          console.log('Form data stored in file');
          res.status(200).json({ message: 'Form data stored successfully' });
        }
      });
    }
  });
});

app.get('/get_election_data', (req, res) => {
  try {
    const electionDataPath = path.join(__dirname, 'electionData.json');
    const data = fs.readFileSync(electionDataPath, 'utf8');
    const jsonData = JSON.parse(data);
    return res.json(jsonData);
  } catch (error) {
    console.error('Error reading election data file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/sendmail', cors(), async (req,res) => {
  const { userEmail, voterId, userstatus} = req.query;
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '093f0fead8d0ae',
      pass: '8dbe22d12d1ce1'
    }
  });

  // Email content
  let mailOptions;
  if (userstatus == 'approved') {
    mailOptions = {
      from: 'votifynow.usa@gmail.com',
      to: userEmail,
      subject: 'Your Registration Status',
      text: `Congratulations! Your registration has been approved. Your voter ID is: ${voterId}`
    };
  } else {
    mailOptions = {
      from: 'votifynow.usa@gmail.com',
      to: userEmail,
      subject: 'Your Registration Status',
      text: `Your registration has been rejected.`
    };
  }

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
      return res.json(info.response);
    }
  });

})

db.connect((err) => {
  if (err) {
    console.error('Database connection error: ' + err.message);
  } else {
    console.log('Connected to the database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
