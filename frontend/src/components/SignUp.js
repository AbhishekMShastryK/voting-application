import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function SignUp() {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = data => console.log(data);
    const [mobileNumberPlaceholder, setMobileNumberPlaceholder] = useState('Mobile number');
    const validateMobileNumber = (value) => {
        const isValid = /^[0-9]{10}$/.test(value);
        if (!isValid) {
          return "Invalid mobile number";
        }
      };

    // console.log(watch('username'));
    
  return (
    <section>
        <div className="register">
            <div className="col-1">  
                <h2>Sign Up</h2>

                <form id='signup' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-container flex">
                        <input type="text" {...register("name", { required: true })} placeholder='Name' />
                        {errors.name && <p className="error">Name is required!</p>}
                    </div>

                    <div className="input-container flex">
                        <input type="text" {...register("emailid", { required: true })} placeholder='Email id' />
                        {errors.name && <p className="error">Email id is required!</p>}
                    </div>

                    <div className="input-container flex">
                        <input type="text" {...register("password")} placeholder='Password' />
                        
                    </div>
                    <div className="input-container flex">
                        <input type="text" {...register("confirmpwd")} placeholder='Confirm password' />
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
                </form>

            </div>
            {/* <div className="col-2">
                <img src={bgImg} alt="" />
            </div> */}
        </div>
    </section>
  )
}