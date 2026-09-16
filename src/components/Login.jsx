import React, { useState } from 'react';
import { API_URL } from '../API';
import './sparkcle.css';

function Login({ onLoggedIn, onShowRegistration }) {

    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [celebrating, setCelebrating] = useState(false);


    // =========================================================
    // Handle Login
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');

        // Validate mobile
        if (!mobile.trim()) {

            setError(
                'Please enter your mobile number'
            );

            return;
        }

        if (!/^[0-9]{10}$/.test(mobile.trim())) {

            setError(
                'Please enter a valid 10-digit mobile number'
            );

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // Call backend directly
            // =================================================

            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        mobile: mobile.trim(),
                    }),
                }
            );


            const data = await response.json();


            // =================================================
            // Handle server error
            // =================================================

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    'Login failed. Please try again.'
                );
            }


            // =================================================
            // Make sure user exists in response
            // =================================================

            if (!data.user) {

                throw new Error(
                    'Invalid response from server.'
                );
            }


            // =================================================
            // Save logged-in user
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
            // Move to StoreList after celebration
            // =================================================

            setTimeout(() => {

                onLoggedIn(data.user);

            }, 1500);


        } catch (error) {

            console.error(
                'Login error:',
                error
            );

            setError(
                error.message ||
                'Login failed. Please try again.'
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

                    {/* Confetti */}

                    {Array.from({ length: 20 }).map(
                        (_, index) => (

                            <span
                                key={index}
                                className="confetti"
                            />

                        )
                    )}


                    {/* Celebration stars */}

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
                Login Form
            ================================================= */}

            <div className="container position-relative">

                <div className="row justify-content-center">

                    <div className="col-12 col-sm-10 col-md-7 col-lg-5">

                        <div className="card registration-card border-0">

                            <div className="card-body p-4 p-md-5">


                                {/* =================================================
                                    Header
                                ================================================= */}

                                <div className="text-center mb-4">

                                    <div className="registration-icon mb-3">
                                        ✦
                                    </div>

                                    <h2 className="fw-bold text-white">
                                        Welcome Back
                                    </h2>

                                    <p className="text-secondary mb-0">
                                        Login to continue
                                    </p>

                                </div>


                                {/* =================================================
                                    Error
                                ================================================= */}

                                {error && (

                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {error}
                                    </div>

                                )}


                                {/* =================================================
                                    Login Form
                                ================================================= */}

                                <form onSubmit={handleSubmit}>


                                    {/* Mobile */}

                                    <div className="mb-4">

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
                                            className={`form-control form-control-lg dark-input ${error
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            id="mobile"
                                            value={mobile}
                                            onChange={(e) => {

                                                setMobile(
                                                    e.target.value
                                                );

                                                setError('');

                                            }}
                                            placeholder="10-digit mobile number"
                                            maxLength="10"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            disabled={
                                                loading ||
                                                celebrating
                                            }
                                        />

                                    </div>


                                    {/* =================================================
                                        Login Button
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

                                                Logging in...
                                            </>

                                        ) : celebrating ? (

                                            <>
                                                🎉 Welcome!
                                            </>

                                        ) : (

                                            <>
                                                Login

                                                <span className="ms-2">
                                                    ✦
                                                </span>
                                            </>

                                        )}

                                    </button>

                                </form>


                                {/* =================================================
                                    Registration
                                ================================================= */}

                                <div className="text-center mt-4">

                                    <span className="text-secondary">
                                        Don't have an account?
                                    </span>


                                    <button
                                        type="button"
                                        className="btn btn-link text-light text-decoration-none"
                                        onClick={
                                            onShowRegistration
                                        }
                                        disabled={celebrating}
                                    >
                                        Register
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;