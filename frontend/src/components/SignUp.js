import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {

    const { register, handleSubmit, formState: { errors }, watch } = useForm()
    // const onSubmit = data => console.log(data);
    const [mobileNumberPlaceholder, setMobileNumberPlaceholder] = useState('Mobile number');
    const password = watch('password');
    const navigate = useNavigate();
    const [redirectingTime, setRedirectingTime] = useState(10);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    useEffect(() => {
        if (registrationSuccess) {
          const timer = setInterval(() => {
            setRedirectingTime(prevTime => prevTime - 1);
          }, 1000); // Update every second
          setTimeout(() => {
            setRegistrationSuccess(false);
            clearInterval(timer);
            // Redirect to home page
            navigate('/login');
          }, 10000); // 10 seconds
          return () => clearTimeout(timer);
        }
      }, [registrationSuccess, navigate]);

    const validateMobileNumber = (value) => {
        const isValid = /^[0-9]{10}$/.test(value);
        if (!isValid) {
          return "Invalid mobile number";
        }
      };

      const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/register', data);
    
            console.log('User registered successfully:', response.data);
            setRegistrationSuccess(true);
            
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // console.log(watch('username'));
    
  return (
    <section>
        <div className="register">
            
            <div className="col-1">  
                <h2>Sign Up</h2>
                {registrationSuccess ? (
                <div>
                    <p>Registered successfully!</p>
                    <p>Redirecting to login page in {redirectingTime} seconds</p>
                </div>
                ) : (
                <form id='signup' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-container flex">
                        <input type="text" {...register("name", { required: true })} placeholder='Name' />
                        {errors.name && <p className="error">Name is required!</p>}
                    </div>

                    <div className="input-container flex">
                        <input type="text" {...register("emailid", { 
                                                                    required: true, 
                                                                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i 
                                                                })} placeholder='Email id' />
                        {errors.name && <p className="error">Email id is required!</p>}
                        {errors.emailid && errors.emailid.type === "pattern" && <p className="error">Invalid email id!</p>}
                    </div>

                    <div className="input-container flex">
                        <input type="text" {...register("password", { 
                                                                    required: true, 
                                                                    minLength: 8, 
                                                                    pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/ 
                                                                })} placeholder='Password' />
                        {errors.name && <p className="error">Password is required!</p>}
                        {errors.password && errors.password.type === "minLength" && <p className="error">Password should have at least 8 characters!</p>}
                        {errors.password && errors.password.type === "pattern" && <p className="error">Password should be alphanumeric!</p>}
                    </div>
                    <div className="input-container flex">
                        <input type="text" {...register("confirmpwd", { 
                                                                        validate: value => value === password || "The passwords do not match" 
                                                                    })} placeholder='Confirm password' />
                        {errors.confirmpwd && <p className="error">{errors.confirmpwd.message}</p>}
                    </div>

                    <div className="input-container flex">
                        <input
                            type="text"
                            {...register("mobilenumber", { required: true, pattern: /^[0-9]{10}$/, validate: validateMobileNumber})}
                            placeholder={mobileNumberPlaceholder}
                            onClick={() => setMobileNumberPlaceholder('+1')}/>
                        {errors.mobilenumber?.type === "required" && <p className="error">Mobile Number is required!</p>}
                        {errors.mobilenumber?.type === "pattern" && <p className="error">Invalid mobile number!</p>}
                    </div>

                    <div className="input-container flex">
                        <input type="number" {...register("age", { required: true })} placeholder='Age' />
                        {errors.age && <p className="error">Age is required!</p>}
                    </div>
    
                    <div className="input-container flex">
                        <input type="text" {...register("address", { required: true })} placeholder='Address' />
                        {errors.address && <p className="error">Address is required!</p>}
                    </div>
                    
                    <div className="input-container flex">
                        <input type="text" {...register("zipcode", { required: true })} placeholder='Zip code' />
                        {errors.zipcode && <p className="error">Zip code is required!</p>}
                    </div>

                    <div className="input-container flex">
                        <input type="text" {...register("drivingLicense", { required: true })} placeholder='Driving license' />
                        {errors.drivingLicense && <p className="error">Driving License is required!</p>}
                    </div>

                    <div className="input-container flex">
                        <input type="text" {...register("passportNumber", { required: true })} placeholder='Passport number' />
                        {errors.passportNumber && <p className="error">Passport Number is required!</p>}
                    </div>

                    <button className='btn'>Register</button>
                    <p>Already registered? <a href="/login">Login</a></p>
                </form>
                )}

            </div>
            {/* <div className="col-2">
                <img src={bgImg} alt="" />
            </div> */}
        </div>
    </section>
  )
}