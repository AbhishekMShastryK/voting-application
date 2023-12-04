import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ElectionSetup from './ElectionSetup';
import { Link } from 'react-router-dom';

function AdminHomePage() {

    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false); // Introduce a loading state
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [electionData, setElectionData] = useState([]);
    const [hoveredDetails, setHoveredDetails] = useState(null);
    

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

    // Load search results from localStorage on component mount
    useEffect(() => {
      const savedSearchResults = JSON.parse(localStorage.getItem('searchResults'));
      if (savedSearchResults) {
        setSearchResults(savedSearchResults);
      }
    }, []);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get('http://localhost:3001/get_election_data');
              setElectionData(response.data);
          } catch (error) {
              console.error('Error fetching election data:', error);
          }
      };

      fetchData();
  }, []);


    const handleApprove = async (user) => {
      const userstatus = 'approved';
      setLoading(true); // Set loading state to true before the approval process
      // Logic to generate 6-digit system-generated voter number
      const voterNumber = Math.floor(100000000 + Math.random() * 900000000);
  
      // Logic to make a POST call to create table with user details and voter number
      try {
          const zipcodeResponse = await axios.get(`https://api.zippopotam.us/us/${user.zipcode}`);
          let stateName = '';
          if (zipcodeResponse && zipcodeResponse.data && zipcodeResponse.data.places && zipcodeResponse.data.places[0]) {
            stateName = zipcodeResponse.data.places[0].state;
          }

          // Append 'V' to voter number
          const voterId = `V${voterNumber}`;

          // Append address with zipcode
          console.log(stateName)
          let addressWithZipcode = `${user.address}, ${user.zipcode}`;
          if (stateName) {
            addressWithZipcode = `${user.address}, ${stateName}, ${user.zipcode}`;
          }

          console.log(addressWithZipcode);

          await axios.post('http://localhost:3001/approved_user_table', {
            voterid:voterId,
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

          // Send approval email to the user
          await axios.post(`http://localhost:3001/sendmail?userEmail=${user.emailid}&voterId=${voterId}&userstatus=${userstatus}`)
          .then(mailResponse => {
            console.log('Response:', mailResponse.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
 
          // Remove the approved user from the pendingUsers state
          setPendingUsers(prevUsers => prevUsers.filter(u => u.drivingLicense !== user.drivingLicense));
          setLoading(false);
      } catch (error) {
          console.error('Error:', error);
          setLoading(false);
      }
   };

    const handleDeny = async (user) => {
      const userstatus = 'rejected';
      setLoading(true);
      try {
        // Make a POST call to update status in user_registration table
        await axios.post(`http://localhost:3001/update_user_status?status=rejected&drivingLicense=${user.drivingLicense}`)
        .then(updateResponse => {
          console.log('Response:', updateResponse.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });

        // Send rejection email to the user
        await axios.post(`http://localhost:3001/sendmail?userEmail=${user.emailid}&voterId=${null}&userstatus=${userstatus}`)
        .then(mailResponse => {
          console.log('Response:', mailResponse.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });

        // Remove the rejected user from the pendingUsers state
        setPendingUsers(prevUsers => prevUsers.filter(u => u.drivingLicense !== user.drivingLicense));
        setLoading(false);
      } catch (error) {
          console.error('Error:', error);
          setLoading(false);
      }
    };

    const handleSearch = async (e) => {
      if (e.key === 'Enter' || e.target.id === 'searchIcon') {
        if (searchTerm.trim() !== '') {
          try {
            const response = await axios.get(`http://localhost:3001/search_pending_users?searchTerm=${searchTerm}`);
            setSearchResults(response.data);
            // Save search results to localStorage
            localStorage.setItem('searchResults', JSON.stringify(response.data));
          } catch (error) {
            console.error('Error searching pending users:', error);
          }
        } else {
          setSearchResults([]); // Clear the search results if the search input is empty
          // Clear search results from localStorage
          localStorage.removeItem('searchResults');
        }
      }
    };

    return (
        <div id='adminhome'>
        <h1>Welcome to Admin Home!</h1>
        <div>
            <h2>Upcoming Elections:</h2>
            {electionData.length === 0 ? (
            <p>No upcoming elections</p>
            ) : (
            electionData.map((election, index) => (
              <div key={index}>
                    <p 
                            onMouseEnter={() => setHoveredDetails(election)} 
                            onMouseLeave={() => setHoveredDetails(null)}>
                            {election.title}
                        </p>
                    </div>
                ))
                )}
        </div>
        {hoveredDetails && (
                <div className="textbox">
                    <p>Title: {hoveredDetails.title}</p>
                    <p>Start Time: {hoveredDetails.startTime}</p>
                    <p>End Time: {hoveredDetails.endTime}</p>
                </div>
            )}
        <div style={{ marginBottom: '20px' }}>
        <Link to="/election-setup" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '10px', backgroundColor: '#800080', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '20px' }}>Setup Election</button>
            </Link>
        </div>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleSearch} placeholder="Search by name or zipcode" />
        <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginBottom:'50px' }}>
        {searchResults.map(user => (
          <div key={user.drivingLicense} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', width: '300px' }}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.emailid}</p>
            <p><strong>Mobile Number:</strong> {user.mobilenumber}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Zipcode:</strong> {user.zipcode}</p>
            <p><strong>Driving License:</strong> {user.drivingLicense}</p>
            <p><strong>Passport Number:</strong> {user.passportNumber}</p>
            <p><strong>Status:</strong> {user.status}</p>
          </div>
        ))}
      </div>
    </div>
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
                <button className="approve" onClick={() => handleApprove(user)} disabled={loading}>Approve</button>
                <button className="deny" onClick={() => handleDeny(user)} disabled={loading}>Deny</button>
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