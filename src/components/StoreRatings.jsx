import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../API';

function StoreRatings() {

  const { slug } = useParams();

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get logged-in user from localStorage
  const getUser = () => {

    try {

      const savedUser =
        localStorage.getItem('user');

      return savedUser
        ? JSON.parse(savedUser)
        : null;

    } catch (error) {

      console.error(
        'Unable to read user:',
        error
      );

      return null;
    }
  };


  // =========================================================
  // Load Ratings
  // =========================================================

  useEffect(() => {

    const loadRatings = async () => {

      try {

        setLoading(true);
        setError('');

        const response =
          await axios.get(
            `${API_URL}/store/${slug}/ratings`
          );

        setRatings(
          response.data
        );

      } catch (error) {

        console.error(
          'Error loading ratings:',
          error
        );

        setError(
          'Failed to load ratings.'
        );

      } finally {

        setLoading(false);

      }
    };


    loadRatings();

  }, [slug]);


  // =========================================================
  // Render Stars
  // =========================================================

  const renderRatingStars = (rating) => {

    const stars = [];

    const numericRating =
      Number(rating) || 0;


    for (let i = 0; i < 5; i++) {

      stars.push(

        <span
          key={i}
          style={{
            color:
              i < numericRating
                ? '#ffd700'
                : '#555',

            fontSize:
              '20px',

            textShadow:
              i < numericRating
                ? '0 0 8px rgba(255,215,0,0.6)'
                : 'none'
          }}
        >
          ★
        </span>

      );
    }

    return stars;
  };


  // =========================================================
  // Render
  // =========================================================

  const user = getUser();


  return (

    <div
      style={{
        minHeight: '100vh',

        background:
          'radial-gradient(circle at top, #18202d 0%, #080a0f 45%, #030405 100%)',

        color: '#fff',

        padding:
          '25px 0 50px'
      }}
    >

      <div className="container">


        {/* Header */}

        <div
          className="mb-4 p-4 rounded-4 text-center"
          style={{
            background:
              'linear-gradient(145deg, #151a23, #0b0e14)',

            border:
              '1px solid rgba(255,255,255,0.10)',

            boxShadow:
              '0 10px 30px rgba(0,0,0,0.4)'
          }}
        >

          <div
            style={{
              fontSize:
                '35px'
            }}
          >
            ⭐
          </div>


          <h2 className="fw-bold mb-2">

            Ratings

          </h2>


          <div
            className="text-info"
            style={{
              wordBreak:
                'break-word'
            }}
          >
            {slug}
          </div>


          {!loading && ratings.length > 0 && (

            <div
              className="text-secondary mt-2"
            >
              {ratings.length}
              {' '}
              {ratings.length === 1
                ? 'rating'
                : 'ratings'}
            </div>

          )}

        </div>


        {/* Error */}

        {error && (

          <div
            className="alert alert-danger"
          >
            {error}
          </div>

        )}


        {/* Loading */}

        {loading && (

          <div
            className="text-center py-5"
          >

            <div
              className="spinner-border text-warning"
              role="status"
            />

            <div
              className="text-secondary mt-3"
            >
              Loading ratings...
            </div>

          </div>

        )}


        {/* Ratings */}

        {!loading &&
          !error &&
          ratings.length > 0 && (

            <div>

              {ratings.map(
                (rating) => (

                  <div
                    key={rating._id}
                    className="card mb-3 border-0"
                    style={{
                      background:
                        'linear-gradient(145deg, #151a23, #0b0e14)',

                      color:
                        '#fff',

                      borderRadius:
                        '15px',

                      border:
                        '1px solid rgba(255,255,255,0.08)',

                      boxShadow:
                        '0 8px 20px rgba(0,0,0,0.3)'
                    }}
                  >

                    <div
                      className="card-body"
                    >

                      <div
                        className="d-flex justify-content-between align-items-center flex-wrap gap-2"
                      >

                        <h5
                          className="card-title mb-0"
                        >
                          {rating.userName}
                        </h5>


                        <span
                          className="badge rounded-pill bg-warning text-dark"
                        >
                          ⭐ {rating.rating}/5
                        </span>

                      </div>


                      <div className="mt-2">

                        {renderRatingStars(
                          rating.rating
                        )}

                      </div>


                      {rating.createdAt && (

                        <div
                          className="text-secondary small mt-2"
                        >
                          {new Date(
                            rating.createdAt
                          ).toLocaleDateString()}
                        </div>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}


        {/* No Ratings */}

        {!loading &&
          !error &&
          ratings.length === 0 && (

            <div
              className="text-center py-5"
              style={{
                color:
                  '#adb5bd'
              }}
            >

              <div
                style={{
                  fontSize:
                    '50px'
                }}
              >
                ⭐
              </div>

              <h5>
                No ratings yet
              </h5>

              <p>
                Be the first person to rate this store.
              </p>

            </div>

          )}


        {/* Back */}

        <div
          className="text-center mt-4"
        >

          <Link
            to="/"
            className="btn btn-outline-light"
          >
            ← Back to Stores
          </Link>

        </div>

      </div>

    </div>

  );
}

export default StoreRatings;
