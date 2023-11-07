const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

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
  const sql = "INSERT INTO user_registrations (`name`,`emailid`,`password`,`confirmpwd`,`mobilenumber`,`age`,`address`,`zipcode`,`drivingLicense`,`passportNumber`) VALUES (?)";
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

  ]
  db.query(sql,[values],(err,data) => {
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
