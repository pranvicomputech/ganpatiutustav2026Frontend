import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../API';
import './sparkcle.css';

function RateStore() {

  const { slug } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [celebrating, setCelebrating] = useState(false);


  // =========================================================
  // Load User From LocalStorage
  // =========================================================

  useEffect(() => {

    try {

      const savedUser =
        localStorage.getItem('user');

      if (!savedUser) {

        setError(
          'Please login or register before rating a store.'
        );

        setLoadingUser(false);

        return;
      }


      const parsedUser =
        JSON.parse(savedUser);


      if (
        !parsedUser.name ||
        !parsedUser.mobile
      ) {

        setError(
          'Your login information is incomplete. Please login again.'
        );

        setLoadingUser(false);

        return;
      }


      setUser(parsedUser);

    } catch (error) {

      console.error(
        'Error reading user:',
        error
      );

      setError(
        'Unable to read your login information.'
      );

    } finally {

      setLoadingUser(false);

    }

  }, []);


  // =========================================================
  // Check LocalStorage For Existing Rating
  // =========================================================

  useEffect(() => {

    const ratedStores =
      JSON.parse(
        localStorage.getItem(
          'ratedStores'
        ) || '[]'
      );


    if (
      ratedStores.includes(slug)
    ) {

      setError(
        'You have already rated this store.'
      );

    }

  }, [slug]);


  // =========================================================
  // Select Rating
  // =========================================================

  const selectRating = (value) => {

    setRating(value);
    setError('');

  };


  // =========================================================
  // Submit Rating
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');


    // Check user

    if (!user) {

      setError(
        'Please login or register first.'
      );

      return;
    }


    // Check rating

    if (
      rating < 1 ||
      rating > 5
    ) {

      setError(
        'Please select a rating from 1 to 5.'
      );

      return;
    }


    // Check localStorage

    const ratedStores =
      JSON.parse(
        localStorage.getItem(
          'ratedStores'
        ) || '[]'
      );


    if (
      ratedStores.includes(slug)
    ) {

      setError(
        'You have already rated this store.'
      );

      return;
    }


    try {

      setLoading(true);


      // =================================================
      // IMPORTANT:
      // Name and mobile are taken from localStorage.
      // User does NOT enter them again.
      // =================================================

      const response =
        await axios.post(
          `${API_URL}/store/${slug}/rate`,
          {
            userName:
              user.name,

            userMobile:
              user.mobile,

            rating:
              rating
          }
        );


      console.log(
        'Rating response:',
        response.data
      );


      // =================================================
      // Save Rated Store
      // =================================================

      if (
        !ratedStores.includes(slug)
      ) {

        ratedStores.push(slug);

        localStorage.setItem(
          'ratedStores',
          JSON.stringify(
            ratedStores
          )
        );

      }


      // Celebration

      setCelebrating(true);
      setSuccess(true);


      // Go back after celebration

      setTimeout(() => {

        navigate('/');

      }, 1800);


    } catch (error) {

      console.error(
        'Rating error:',
        error
      );


      // Backend says already rated

      if (
        error.response &&
        error.response.status === 403
      ) {

        // Also save locally

        const ratedStores =
          JSON.parse(
            localStorage.getItem(
              'ratedStores'
            ) || '[]'
          );


        if (
          !ratedStores.includes(slug)
        ) {

          ratedStores.push(slug);

          localStorage.setItem(
            'ratedStores',
            JSON.stringify(
              ratedStores
            )
          );

        }


        setError(
          'You have already rated this store.'
        );

      } else {

        setError(
          error.response?.data?.error ||
          'Failed to submit rating. Please try again.'
        );

      }

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // Loading User
  // =========================================================

  if (loadingUser) {

    return (

      <div
        className="sparkle-page min-vh-100 d-flex align-items-center justify-content-center"
      >

        <div className="text-center text-white">

          <div
            className="spinner-border text-warning"
            role="status"
          />

          <div className="mt-3">
            Loading...
          </div>

        </div>

      </div>

    );

  }


  // =========================================================
  // Render
  // =========================================================

  return (

    <div
      className="sparkle-page min-vh-100 py-4"
      style={{
        position:
          'relative',
        overflow:
          'hidden'
      }}
    >


      {/* =================================================
                Background Sparkles
            ================================================= */}

      <div
        className="sparkles"
        aria-hidden="true"
      >

        <span className="sparkle sparkle-1">
          ✦
        </span>

        <span className="sparkle sparkle-2">
          ✧
        </span>

        <span className="sparkle sparkle-3">
          ✦
        </span>

        <span className="sparkle sparkle-4">
          ✧
        </span>

        <span className="sparkle sparkle-5">
          ✦
        </span>

        <span className="sparkle sparkle-6">
          ✧
        </span>

        <span className="sparkle sparkle-7">
          ✦
        </span>

        <span className="sparkle sparkle-8">
          ✧
        </span>

      </div>


      {/* =================================================
                Celebration
            ================================================= */}

      {celebrating && (

        <div
          className="celebration"
          aria-hidden="true"
        >

          {Array.from({
            length: 25
          }).map(
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
              '--x':
                '-130px',

              '--y':
                '-100px',

              '--star-delay':
                '0s'
            }}
          >
            ✦
          </span>


          <span
            className="celebration-star"
            style={{
              '--x':
                '130px',

              '--y':
                '-100px',

              '--star-delay':
                '0.05s'
            }}
          >
            ✨
          </span>


          <span
            className="celebration-star"
            style={{
              '--x':
                '-160px',

              '--y':
                '50px',

              '--star-delay':
                '0.1s'
            }}
          >
            ✧
          </span>


          <span
            className="celebration-star"
            style={{
              '--x':
                '160px',

              '--y':
                '50px',

              '--star-delay':
                '0.15s'
            }}
          >
            ✦
          </span>


          <span
            className="celebration-star"
            style={{
              '--x':
                '0px',

              '--y':
                '-160px',

              '--star-delay':
                '0.05s'
            }}
          >
            ⭐
          </span>

        </div>

      )}


      {/* =================================================
                Main
            ================================================= */}

      <div
        className="container position-relative"
      >

        <div className="row justify-content-center">

          <div
            className="col-12 col-sm-10 col-md-7 col-lg-5"
          >

            <div
              className="card registration-card border-0"
            >

              <div
                className="card-body p-4 p-md-5"
              >


                {/* =================================
                                    Header
                                ================================= */}

                <div
                  className="text-center mb-4"
                >

                  <div
                    className="registration-icon mb-3"
                  >
                    ⭐
                  </div>


                  <h2
                    className="fw-bold text-white"
                  >
                    Rate Store
                  </h2>


                  <p
                    className="text-secondary mb-1"
                  >
                    Share your experience
                  </p>


                  {user && (

                    <p
                      className="text-info small mb-0"
                    >
                      Rating as{' '}
                      <strong>
                        {user.name}
                      </strong>
                    </p>

                  )}

                </div>


                {/* =================================
                                    Error
                                ================================= */}

                {error && (

                  <div
                    className="alert alert-danger"
                  >
                    {error}
                  </div>

                )}


                {/* =================================
                                    Success
                                ================================= */}

                {success && (

                  <div
                    className="alert alert-success text-center"
                  >
                    🎉 Thank you for rating
                    this store!
                  </div>

                )}


                {!success && (

                  <form
                    onSubmit={
                      handleSubmit
                    }
                  >


                    {/* =========================
                                            Store
                                        ========================= */}

                    <div
                      className="text-center mb-4"
                    >

                      <div
                        className="text-secondary mb-2"
                      >
                        You are rating
                      </div>


                      <div
                        className="fw-bold text-white"
                        style={{
                          fontSize:
                            '20px'
                        }}
                      >
                        {slug}
                      </div>

                    </div>


                    {/* =========================
                                            Stars
                                        ========================= */}

                    <div
                      className="text-center mb-4"
                    >

                      <div
                        className="mb-2 text-secondary"
                      >
                        Select your rating
                      </div>


                      <div
                        className="d-flex justify-content-center gap-2"
                      >

                        {[1, 2, 3, 4, 5].map(
                          (star) => (

                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                selectRating(
                                  star
                                )}
                              onMouseEnter={() =>
                                setHoverRating(
                                  star
                                )}
                              onMouseLeave={() =>
                                setHoverRating(
                                  0
                                )}
                              disabled={
                                loading
                              }
                              aria-label={`${star} star`}
                              style={{
                                border:
                                  'none',

                                background:
                                  'transparent',

                                color:
                                  star <=
                                    (
                                      hoverRating ||
                                      rating
                                    )
                                    ? '#ffd700'
                                    : '#555',

                                fontSize:
                                  '42px',

                                lineHeight:
                                  '1',

                                cursor:
                                  loading
                                    ? 'default'
                                    : 'pointer',

                                padding:
                                  '2px',

                                transition:
                                  'all 0.15s ease',

                                textShadow:
                                  star <=
                                    (
                                      hoverRating ||
                                      rating
                                    )
                                    ? '0 0 15px rgba(255,215,0,0.8)'
                                    : 'none'
                              }}
                            >
                              ★
                            </button>

                          )
                        )}

                      </div>


                      <div
                        className="text-warning mt-2"
                      >

                        {rating > 0
                          ? `${rating} / 5`
                          : 'Tap a star'}

                      </div>

                    </div>


                    {/* =========================
                                            Submit
                                        ========================= */}

                    <button
                      type="submit"
                      className="btn btn-sparkle btn-lg w-100"
                      disabled={
                        loading ||
                        !user ||
                        rating === 0
                      }
                    >

                      {loading ? (

                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          />

                          Submitting...
                        </>

                      ) : (

                        <>
                          Submit Rating
                          <span className="ms-2">
                            ✦
                          </span>
                        </>

                      )}

                    </button>


                  </form>

                )}


                {/* =================================
                                    Back
                                ================================= */}

                <div
                  className="text-center mt-4"
                >

                  <Link
                    to="/"
                    className="btn btn-link text-light text-decoration-none"
                  >
                    ← मागे जा
                  </Link>

                </div>


              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default RateStore;
