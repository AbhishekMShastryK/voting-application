import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ElectionDetails = () => {
  const location = useLocation();
  const electionDetails = location.state.electionDetails;
  const [votedCandidate, setVotedCandidate] = useState(null);

  const handleVote = (candidateId, candidateName) => {
    // Add your logic for handling the vote for the selected candidate
    console.log(`Voted for candidate with ID: ${candidateId}`);
    setVotedCandidate(candidateName);
  };

  return (
    <div id='electiondetails'>
      <h2>{electionDetails.title}</h2>
      <p><strong>Start Time: </strong>{electionDetails.startTime}</p>
      <p><strong>End Time: </strong>{electionDetails.endTime}</p>
      <h3>Precincts:</h3>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {electionDetails.precincts.map((precinct, index) => (
          <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', textAlign:'left' }}>
            <p><strong>Precinct ID: </strong>{index + 1}</p>
            <p><strong>Name: </strong>{precinct.name}</p>
            <p><strong>Zip Code: </strong>{precinct.zipcodeplus}</p>
            <p><strong>Polling Location: </strong>{precinct.pollinglocation}</p>
            <p><strong>Polling Manager: </strong>{precinct.pollingmanager}</p>
            <p><strong>Office Contact: </strong>{precinct.officecontact}</p>
          </div>
        ))}
      </div>
      <h3>Races:</h3>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {electionDetails.races.map((race, index) => (
          <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', textAlign:'left' }}>
            <p><strong>Race ID: </strong>{index + 1}</p>
            <p><strong>Name: </strong>{race.name}</p>
            <p><strong>Term: </strong>{race.term}</p>
            <p><strong>Voting Precincts: </strong>{race.votingprecincts}</p>
          </div>
        ))}
      </div>
      <h3>Candidates:</h3>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {electionDetails.candidates.map((candidate, index) => (
          <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', textAlign:'left'}}>
            <p><strong>Candidate ID: </strong>{index + 1}</p>
            <p><strong>Name: </strong>{candidate.name}</p>
            <p><strong>Party: </strong>{candidate.party}</p>
            <p><strong>Bio: </strong>{candidate.bio}</p>
            <div style={{marginTop:'10px', textAlign:'center'}}>
                <button id='electionvote' onClick={() => handleVote(index + 1, candidate.name)}>Vote</button>
            </div>
          </div>
        ))}
      </div>
      {votedCandidate && <h3 style={{ color: '#800080' }}>Voted for: {votedCandidate}</h3>}
    </div>
  );
}

export default ElectionDetails;