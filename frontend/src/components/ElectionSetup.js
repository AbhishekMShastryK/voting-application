import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ElectionSetup() {
    const navigate = useNavigate();
    const { register, control, handleSubmit, reset } = useForm({
        defaultValues: {
            title: '',
            startTime: '',
            endTime: '',
            precincts: [],
            races: [],
            candidates: []
        }
    });

    const { fields: precinctFields, append: appendPrecinct, remove: removePrecinct } = useFieldArray({
        control,
        name: 'precincts'
    });

    const { fields: raceFields, append: appendRace, remove: removeRace } = useFieldArray({
        control,
        name: 'races'
    });

    const { fields: candidateFields, append: appendCandidate, remove: removeCandidate } = useFieldArray({
        control,
        name: 'candidates'
    });

    const onSubmit = async (data) => {
        try {
            console.log(data)
            const response = await axios.post('http://localhost:3001/election_setup', data);
            console.log('Response:', response.data);
            reset();
            navigate('/adminhome');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form id="electionsetup" onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column',  gap: '10px', overflowY:'auto' }}>
            <h2>Election Setup</h2>
            <label>Title: <input {...register('title')} /></label>
            <label>Start Time: <input type="datetime-local" {...register('startTime')} /></label>
            <label>End Time: <input type="datetime-local" {...register('endTime')} /></label>

            {precinctFields.map((field, index) => (
                <div id="addinput" key={field.id}>
                    <label style={{ marginRight: '10px' }}>{index + 1}.</label>
                    <label style={{ marginRight: '10px' }}>Name: <input {...register(`precincts.${index}.name`)} /></label>
                    <label style={{ marginRight: '10px' }}>ZIP Plus 4: <input {...register(`precincts.${index}.zipcodeplus`)} /></label>
                    <label style={{ marginRight: '10px' }}>Polling location: <input {...register(`precincts.${index}.pollinglocation`)} /></label>
                    <label style={{ marginRight: '10px' }}>Polling manager: <input {...register(`precincts.${index}.pollingmanager`)} /></label>
                    <label style={{ marginRight: '10px' }}>office contact: <input {...register(`precincts.${index}.officecontact`)} /></label>
                    <button type="button" onClick={() => removePrecinct(index)}>Remove</button>
                </div>
            ))}
            <div id="electionsetupadd" style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="button" style={{ width: '150px' }} onClick={() => appendPrecinct({})}>Add Precinct</button>
            </div>

            {raceFields.map((field, index) => (
                <div id="addinput" key={field.id}>
                    <label style={{ marginRight: '10px' }}>Name: <input {...register(`races.${index}.name`)} /></label>
                    <label style={{ marginRight: '10px' }}>Term: <input {...register(`races.${index}.term`)} /></label>
                    <label style={{ marginRight: '10px' }}>Voting precincts: <input {...register(`races.${index}.votingprecincts`)} /></label>
                    <button type="button" onClick={() => removeRace(index)}>Remove</button>
                </div>
            ))}
            <div id="electionsetupadd" style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="button" style={{ width: '150px' }} onClick={() => appendRace({})}>Add Race</button>
            </div>

            {candidateFields.map((field, index) => (
                <div id="addinput" key={field.id}>
                    <label style={{ marginRight: '10px' }}>Name: <input {...register(`candidates.${index}.name`)} /></label>
                    <label style={{ marginRight: '10px' }}>Party: <input {...register(`candidates.${index}.party`)} /></label>
                    <label style={{ marginRight: '10px' }}>Bio: <input {...register(`candidates.${index}.bio`)} /></label>
                    <button type="button" onClick={() => removeCandidate(index)}>Remove</button>
                </div>
            ))}
            <div id="electionsetupadd" style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="button" style={{ width: '150px' }} onClick={() => appendCandidate({})}>Add Candidate</button>
            </div>
            <div id="electionsetupsubmit" style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="submit">Submit</button>
            </div>
        </form>
    );
}

export default ElectionSetup;