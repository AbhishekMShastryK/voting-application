import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ElectionDetails from './ElectionDetails'; 

const VoterHomePage = () => {

  const [electionData, setElectionData] = useState([]);
  const location = useLocation();
  const userZipcode = location.state.zipcode;
  const [selectedElection, setSelectedElection] = useState(null);
  const navigate = useNavigate();

  const handleElectionClick = (election) => {
    setSelectedElection(election);
    navigate('/election-details', { state: { electionDetails: election } });
  };

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
  // Filter election data based on userZipcode and precinct zipcode
  const filteredElections = electionData.filter(election => {
    return election.precincts.some(precinct => precinct.zipcodeplus.includes(userZipcode));
  });

  return (
    <div id='voterHome'>
      <h1>Welcome Home!</h1>
      <h2>Upcoming Elections:</h2>
      {filteredElections.length === 0 ? (
            <p>No upcoming elections</p>
            ) : (
              filteredElections.map((election, index) => (
              <div key={index} onClick={() => handleElectionClick(election)}>
                    <p>
                            {election.title}
                        </p>
                      {selectedElection && <ElectionDetails election={selectedElection} />}
                    </div>
                ))
                )}
    </div>
  );
}

export default VoterHomePage;