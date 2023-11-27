const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

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
