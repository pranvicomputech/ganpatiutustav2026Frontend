import React, { useState } from 'react';
import { API_URL } from '../API';
import './sparkcle.css';

function Registration({ onRegistered, onShowLogin }) {

    const [form, setForm] = useState({
        name: '',
        mobile: '',
        city: '',
        address: '',
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [celebrating, setCelebrating] = useState(false);


    // =========================================================
    // Handle input changes
    // =========================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(previousForm => ({
            ...previousForm,
            [name]: value,
        }));

        setErrors(previousErrors => ({
            ...previousErrors,
            [name]: '',
        }));

        setServerError('');
    };


    // =========================================================
    // Validate form
    // =========================================================

    const validate = () => {

        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = 'Please enter your name';
        }

        if (!form.mobile.trim()) {

            newErrors.mobile =
                'Please enter your mobile number';

        } else if (!/^[0-9]{10}$/.test(form.mobile)) {

            newErrors.mobile =
                'Please enter a valid 10-digit mobile number';
        }

        if (!form.city.trim()) {
            newErrors.city = 'Please enter your city';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    // =========================================================
    // Register
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setServerError('');

        if (!validate()) {
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/register`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        name: form.name.trim(),
                        mobile: form.mobile.trim(),
                        city: form.city.trim(),
                        address: form.address.trim(),
                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    'Registration failed. Please try again.'
                );
            }


            // =================================================
            // Save user in localStorage
            // =================================================

            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            );


            // =================================================
            // Start celebration
            // =================================================

            setCelebrating(true);


            // =================================================
            // Go to StoreList after celebration
            // =================================================

            setTimeout(() => {

                onRegistered(data.user);

            }, 1500);


        } catch (error) {

            console.error(
                'Registration error:',
                error
            );

            setServerError(
                error.message ||
                'Registration failed. Please try again.'
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="sparkle-page min-vh-100 d-flex align-items-center py-4">


            {/* =================================================
                Background Sparkles
            ================================================= */}

            <div
                className="sparkles"
                aria-hidden="true"
            >

                <span className="sparkle sparkle-1">✦</span>
                <span className="sparkle sparkle-2">✧</span>
                <span className="sparkle sparkle-3">✦</span>
                <span className="sparkle sparkle-4">✧</span>
                <span className="sparkle sparkle-5">✦</span>
                <span className="sparkle sparkle-6">✧</span>
                <span className="sparkle sparkle-7">✦</span>
                <span className="sparkle sparkle-8">✧</span>
                <span className="sparkle sparkle-9">✦</span>
                <span className="sparkle sparkle-10">✧</span>

            </div>


            {/* =================================================
                Celebration
            ================================================= */}

            {celebrating && (

                <div
                    className="celebration"
                    aria-hidden="true"
                >

                    {Array.from({ length: 20 }).map(
                        (_, index) => (

                            <span
                                key={index}
                                className="confetti"
                            />

                        )
                    )}


                    <span
                        className="celebration-star"
                        style={{
                            '--x': '-120px',
                            '--y': '-100px',
                            '--star-delay': '0s'
                        }}
                    >
                        ✦
                    </span>


                    <span
                        className="celebration-star"
                        style={{
                            '--x': '120px',
                            '--y': '-80px',
                            '--star-delay': '0.05s'
                        }}
                    >
                        ✨
                    </span>


                    <span
                        className="celebration-star"
                        style={{
                            '--x': '-150px',
                            '--y': '40px',
                            '--star-delay': '0.1s'
                        }}
                    >
                        ✧
                    </span>


                    <span
                        className="celebration-star"
                        style={{
                            '--x': '150px',
                            '--y': '50px',
                            '--star-delay': '0.15s'
                        }}
                    >
                        ✦
                    </span>


                    <span
                        className="celebration-star"
                        style={{
                            '--x': '0px',
                            '--y': '-150px',
                            '--star-delay': '0.05s'
                        }}
                    >
                        ⭐
                    </span>

                </div>
            )}


            {/* =================================================
                Registration Form
            ================================================= */}

            <div className="container position-relative">

                <div className="row justify-content-center">

                    <div className="col-12 col-sm-10 col-md-7 col-lg-5">

                        <div className="card registration-card border-0">

                            <div className="card-body p-4 p-md-5">


                                {/* Header */}

                                <div className="text-center mb-4">

                                    <div className="registration-icon mb-3">
                                        ✦
                                    </div>

                                    <h2 className="fw-bold text-white">
                                        Create Account
                                    </h2>

                                    <p className="text-secondary mb-0">
                                        Register to continue
                                    </p>

                                </div>


                                {/* Server Error */}

                                {serverError && (

                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {serverError}
                                    </div>

                                )}


                                <form onSubmit={handleSubmit}>


                                    {/* =================================================
                                        Name
                                    ================================================= */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="name"
                                            className="form-label text-light fw-semibold"
                                        >
                                            Name{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>


                                        <input
                                            type="text"
                                            className={`form-control form-control-lg dark-input ${errors.name
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            autoComplete="name"
                                            disabled={
                                                loading ||
                                                celebrating
                                            }
                                        />


                                        {errors.name && (

                                            <div className="invalid-feedback">
                                                {errors.name}
                                            </div>

                                        )}

                                    </div>


                                    {/* =================================================
                                        Mobile
                                    ================================================= */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="mobile"
                                            className="form-label text-light fw-semibold"
                                        >
                                            Mobile Number{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>


                                        <input
                                            type="tel"
                                            className={`form-control form-control-lg dark-input ${errors.mobile
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            id="mobile"
                                            name="mobile"
                                            value={form.mobile}
                                            onChange={handleChange}
                                            placeholder="10-digit mobile number"
                                            maxLength="10"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            disabled={
                                                loading ||
                                                celebrating
                                            }
                                        />


                                        {errors.mobile && (

                                            <div className="invalid-feedback">
                                                {errors.mobile}
                                            </div>

                                        )}

                                    </div>


                                    {/* =================================================
                                        City
                                    ================================================= */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="city"
                                            className="form-label text-light fw-semibold"
                                        >
                                            City{' '}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>


                                        <input
                                            type="text"
                                            className={`form-control form-control-lg dark-input ${errors.city
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            id="city"
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            placeholder="Enter your city"
                                            autoComplete="address-level2"
                                            disabled={
                                                loading ||
                                                celebrating
                                            }
                                        />


                                        {errors.city && (

                                            <div className="invalid-feedback">
                                                {errors.city}
                                            </div>

                                        )}

                                    </div>


                                    {/* =================================================
                                        Address
                                    ================================================= */}

                                    <div className="mb-4">

                                        <label
                                            htmlFor="address"
                                            className="form-label text-light fw-semibold"
                                        >
                                            Address

                                            <span className="text-secondary ms-2">
                                                (Optional)
                                            </span>
                                        </label>


                                        <textarea
                                            className="form-control dark-input"
                                            id="address"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="Enter your address"
                                            rows="3"
                                            autoComplete="street-address"
                                            disabled={
                                                loading ||
                                                celebrating
                                            }
                                        />

                                    </div>


                                    {/* =================================================
                                        Register Button
                                    ================================================= */}

                                    <button
                                        type="submit"
                                        className="btn btn-sparkle btn-lg w-100"
                                        disabled={
                                            loading ||
                                            celebrating
                                        }
                                    >

                                        {loading ? (

                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                />

                                                Registering...
                                            </>

                                        ) : celebrating ? (

                                            <>
                                                🎉 Registered!
                                            </>

                                        ) : (

                                            <>
                                                Register

                                                <span className="ms-2">
                                                    ✦
                                                </span>
                                            </>

                                        )}

                                    </button>

                                </form>


                                {/* =================================================
                                    Login
                                ================================================= */}

                                <div className="text-center mt-4">

                                    <span className="text-secondary">
                                        Already registered?
                                    </span>


                                    <button
                                        type="button"
                                        className="btn btn-link text-light text-decoration-none"
                                        onClick={onShowLogin}
                                        disabled={celebrating}
                                    >
                                        Login
                                    </button>

                                </div>

                            </div>

                        </div>


                        <p className="text-center text-secondary small mt-3">

                            Your information is securely registered
                            with the server.

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Registration;
