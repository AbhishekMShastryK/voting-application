import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminHomePage() {

    const [pendingUsers, setPendingUsers] = useState([]);

    useEffect(() => {
        const fetchPendingUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/user_registrations?status=pending');
            setPendingUsers(response.data);
        } catch (error) {
            console.error('Error fetching pending users:', error);
        }
        };

        fetchPendingUsers();
    }, []);

    const handleApprove = async (user) => {
      // Logic to generate 6-digit system-generated voter number
      const voterNumber = Math.floor(100000000 + Math.random() * 900000000);
  
      // Logic to make a POST call to create table with user details and voter number
      try {
          const zipcodeResponse = await axios.get(`https://api.zippopotam.us/us/${user.zipcode}`);
          let stateName = '';
          if (zipcodeResponse && zipcodeResponse.data && zipcodeResponse.data.places && zipcodeResponse.data.places[0]) {
            stateName = zipcodeResponse.data.places[0].state;
          }

          // Append state code to voter number
          const voterNumberWithStateCode = `V${voterNumber}`;

          // Append address with zipcode
          console.log(stateName)
          let addressWithZipcode = `${user.address}, ${user.zipcode}`;
          if (stateName) {
            addressWithZipcode = `${user.address}, ${stateName}, ${user.zipcode}`;
          }

          console.log(addressWithZipcode);

          await axios.post('http://localhost:3001/approved_user_table', {
            voterid:voterNumberWithStateCode,
            name:user.name,
            password: user.password,
            emailid:user.emailid,
            mobilenumber:user.mobilenumber,
            age:user.age,
            fulladdress:addressWithZipcode,
            drivingLicense:user.drivingLicense,
            passportNumber:user.passportNumber,
          })
          .then(response => {
            console.log('Response:', response.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });

          // Make a POST call to update status in user_registration table
          await axios.post(`http://localhost:3001/update_user_status?status=approved&drivingLicense=${user.drivingLicense}`)
          .then(updateResponse => {
            console.log('Response:', updateResponse.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
          
          // Remove the approved user from the pendingUsers state
          setPendingUsers(prevUsers => prevUsers.filter(u => u.drivingLicense !== user.drivingLicense));
      } catch (error) {
          console.error('Error creating user table:', error);
      }
   };

    const handleDeny = (userId) => {
    // Logic to deny the user with userId
    console.log('Denying user with ID:', userId);
    };

    return (
        <div id='adminhome'>
        <h1>Welcome to Admin Home!</h1>
      <h2>Pending User Registrations:</h2>
      {pendingUsers.length === 0 ? (
            <p>No user to review</p>
      ) : (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Age</th>
            <th>Address</th>
            <th>Driving License</th>
            <th>Passport Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.map(user => (
            <tr key={user.drivingLicense}>
              <td>{user.name}</td>
              <td>{user.emailid}</td>
              <td>{user.mobilenumber}</td>
              <td>{user.age}</td>
              <td>{user.address}</td>
              <td>{user.drivingLicense}</td>
              <td>{user.passportNumber}</td>
              <td>
                <button className="approve" onClick={() => handleApprove(user)}>Approve</button>
                <button className="deny" onClick={() => handleDeny(user.drivingLicense)}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
        </div>
    );
}

export default AdminHomePage;