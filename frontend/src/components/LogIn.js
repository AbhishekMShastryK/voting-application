import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogIn = () => {
  const navigate = useNavigate();
  const [name, setVoterId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selectedRole, setSelectedRole] = useState('voter'); // Default role is voter

  const handleLogIn = async (e) => {
    e.preventDefault();
    if (selectedRole === 'voter' && !name) {
      setNameError('Voter ID is required!');
      return;
    }
    if (selectedRole === 'admin' && !username) {
      setUsernameError('Username is required!');
      return;
    }
    if ((selectedRole === 'voter' || selectedRole === 'admin') && !password) {
      setPasswordError('Password is required!');
      return;
    }

    try {
      // Send a POST request to your backend API to validate the voter ID and password
      axios.post('http://localhost:3001/login', { name, password })
      .then(res => {
        if (username === 'admin' && password === 'admin123' && selectedRole === 'admin') {
          navigate('/adminhome');
        }
        else {
          setError('Invalid username or password');
        }
        if (selectedRole === "voter") {
          if (res.data === "Success") {
            // Redirect to the home page or dashboard
            navigate('/voterhome');
          } else {
            setError('Invalid voter ID or password');
          }
      }
      })
      
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.log(error);
    }
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="register">
        <div className="col-1">
            <h2>Login</h2>
            {error && 
            <p>{error}</p>
            }
            <form id='login' className='flex flex-col' onSubmit={handleLogIn}>
                <div className="input-container flex">
                  <select value={selectedRole} onChange={handleRoleChange}>
                    <option value="voter">Voter</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                
                {selectedRole === 'admin' || selectedRole === 'manager'? (
                <>
                <div className="input-container flex">
                  <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => {
                      if (username) {
                        setUsernameError('');
                      }
                    }}
                  />
                  {usernameError && <p className="error">{usernameError}</p>}
                  </div>
                </>
                ) : (
                  <div className="input-container flex">
                  <input
                    type="text"
                    id="name"
                    placeholder="Voter ID"
                    value={name}
                    onChange={(e) => setVoterId(e.target.value)}
                    onBlur={() => {
                      if (name) {
                        setNameError('');
                      }
                    }}
                  />
                  {nameError && <p className="error">{nameError}</p>}
                  </div>
                )}
                    
                
                <div className="input-container flex">
                    <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => {
                      if (password) {
                        setPasswordError('');
                      }
                    }}
                    />
                    {passwordError && <p className="error">{passwordError}</p>}
                </div>
                <button className='btn' type="submit">Log In</button>
                <p>Not registered? <a href="/signup">SignUp</a></p>
            </form>
        </div>
    </div>
  );
};

export default LogIn;