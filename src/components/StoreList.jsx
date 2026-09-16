import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../API'

function StoreList() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('nearby')

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoading(true)
        setError(null)

        let url = `${API_URL}/stores`

        if (user?.mobile) {
          url += `?mobile=${encodeURIComponent(user.mobile)}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to load stores')
        }

        const data = await response.json()
        setStores(data)
      } catch (error) {
        console.error('Error fetching stores:', error)
        setError('Failed to load stores.')
      } finally {
        setLoading(false)
      }
    }

    loadStores()
  }, [user?.mobile])

  const renderRatingStars = rating => {
    const stars = []
    const numericRating = Number(rating) || 0

    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i < numericRating ? '#ffd700' : '#555',
            fontSize: '18px',
            textShadow:
              i < numericRating
                ? '0 0 8px rgba(255,215,0,0.6)'
                : 'none'
          }}
        >
          ★
        </span>
      )
    }

    return stars
  }

  const sortedStores = [...stores].sort((a, b) => {
    const isPranviA =
      a.name?.trim().toLowerCase() === 'pranvi computech'

    const isPranviB =
      b.name?.trim().toLowerCase() === 'pranvi computech'

    if (isPranviA && !isPranviB) {
      return -1
    }

    if (!isPranviA && isPranviB) {
      return 1
    }

    if (sortBy === 'rating') {
      const ratingA = Number(a.averageRating) || 0
      const ratingB = Number(b.averageRating) || 0

      if (ratingB !== ratingA) {
        return ratingB - ratingA
      }

      return (
        (a.serialIndex || 0) -
        (b.serialIndex || 0)
      )
    }

    return (
      (a.serialIndex || 0) -
      (b.serialIndex || 0)
    )
  })

  const openMap = mapLink => {
    if (!mapLink) return

    window.open(
      mapLink,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const openInstagram = instaId => {
    if (!instaId) return

    const username = instaId
      .replace(/^@/, '')
      .trim()

    if (!username) return

    window.open(
      `https://www.instagram.com/${username}/`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, #18202d 0%, #080a0f 45%, #030405 100%)',
        color: '#fff',
        paddingBottom: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>
        {`
          @keyframes storeSparkleFloat {
            0% {
              transform: translateY(20px) translateX(0) scale(0.3) rotate(0deg);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            50% {
              transform: translateY(-30px) translateX(10px) scale(1) rotate(45deg);
              opacity: 0.9;
            }
            100% {
              transform: translateY(-75px) translateX(-8px) scale(0.2) rotate(90deg);
              opacity: 0;
            }
          }

          @keyframes cardGlow {
            0%, 100% {
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
            }
            50% {
              box-shadow: 0 10px 40px rgba(0, 195, 255, 0.16);
            }
          }

          @keyframes titleShine {
            0% {
              background-position: 200% center;
            }
            100% {
              background-position: -200% center;
            }
          }

          .store-card-column {
            padding-top: 22px;
            padding-bottom: 22px;
          }

          .store-card-custom {
            position: relative;
            overflow: hidden;
            animation: cardGlow 4s ease-in-out infinite;
            transition:
              transform 0.25s ease,
              border-color 0.25s ease;
            border: 2px solid rgba(255, 215, 0, 0.45) !important;
            height: 100%;
          }

          .store-card-custom:hover {
            transform: translateY(-5px);
            border-color: rgba(0, 200, 255, 0.8) !important;
          }

          .card-inner-sparkle {
            position: absolute;
            color: #ffffff;
            pointer-events: none;
            user-select: none;
            z-index: 3;
            animation: storeSparkleFloat 3.5s linear infinite;
          }

          .store-title-shine {
            background:
              linear-gradient(
                90deg,
                #ffffff,
                #69e7ff,
                #ffffff,
                #ffd700,
                #ffffff
              );
            background-size: 300% auto;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            animation: titleShine 5s linear infinite;
          }

          .store-card-body-custom {
            position: relative;
            z-index: 2;
          }

          .store-image-wrapper {
            position: relative;
            width: 100%;
            height: 230px;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .store-image {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            object-fit: contain !important;
            object-position: center;
            display: block;
          }

          .image-map-label {
            position: absolute;
            z-index: 4;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.78);
            color: #fff;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            pointer-events: none;
          }

          .sort-wrapper {
            margin-top: 10px;
            margin-bottom: 18px;
            padding: 0 10px;
          }

          .sort-button {
            min-width: 160px;
            min-height: 44px;
            border-radius: 10px;
            font-weight: 600;
            margin: 4px;
          }

          .rating-instagram-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            min-height: 30px;
            margin-bottom: 18px;
          }

          .rating-wrapper {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            min-width: 0;
          }

          .instagram-button {
            flex-shrink: 0;
            width: 38px;
            height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(225, 48, 108, 0.6);
            border-radius: 9px;
            background: rgba(225, 48, 108, 0.12);
            color: #ff66c4;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0;
          }

          .instagram-button:hover {
            background: rgba(225, 48, 108, 0.28);
            border-color: #E1306C;
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(225, 48, 108, 0.25);
          }

          .instagram-button:active {
            transform: translateY(0);
          }

          .rate-button {
            border-radius: 10px;
            position: relative;
            z-index: 5;
            min-height: 44px;
          }

          @media (max-width: 576px) {
            .store-card-column {
              padding-top: 16px;
              padding-bottom: 16px;
            }

            .store-image-wrapper {
              height: 210px;
            }

            .sort-wrapper {
              margin-top: 5px;
              margin-bottom: 15px;
              padding: 0 5px;
            }

            .sort-button {
              width: 100%;
              margin: 4px 0;
            }

            .rating-instagram-row {
              gap: 8px;
            }

            .instagram-button {
              width: 36px;
              height: 36px;
              font-size: 19px;
            }
          }
        `}
      </style>

      <span
        className="card-inner-sparkle"
        style={{
          top: '20%',
          left: '5%',
          fontSize: '16px',
          animationDuration: '3s'
        }}
      >
        ✦
      </span>

      <span
        className="card-inner-sparkle"
        style={{
          top: '40%',
          right: '5%',
          color: '#ffd700',
          fontSize: '13px',
          animationDuration: '3.5s',
          animationDelay: '1s'
        }}
      >
        ✧
      </span>

      <div className="container py-4 position-relative">
        <div
          className="p-3 p-md-4 mb-5 rounded-4 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(20,25,35,0.97), rgba(8,10,15,0.97))',
            border:
              '1px solid rgba(255,255,255,0.12)',
            boxShadow:
              '0 10px 35px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              color: '#ffd700',
              fontSize: '28px',
              marginBottom: '8px'
            }}
          >
            ✨ 🪔 ✨
          </div>

          <div className="h4 fw-bold mb-3">
            येवला गणपतीउत्सव २०२६ मध्ये
            आपणा सर्वांचे स्वागत
          </div>

          <hr
            style={{
              borderColor:
                'rgba(255,255,255,0.15)'
            }}
          />

          <div
            className="h6 mb-0"
            style={{
              color: '#adb5bd',
              lineHeight: '1.7'
            }}
          >
            देखावा बघायला जाण्यासाठीचा
            मॅप उघडण्यासाठी त्या देखाव्याच्या
            फोटोवर टच करा
          </div>
        </div>

        {!loading &&
          !error &&
          stores.length > 0 && (
            <div
              className="
                d-flex
                flex-column
                flex-sm-row
                justify-content-center
                align-items-center
                gap-2
                sort-wrapper
              "
            >
              <button
                type="button"
                className={`btn sort-button ${sortBy === 'nearby'
                    ? 'btn-warning'
                    : 'btn-outline-warning'
                  }`}
                onClick={() =>
                  setSortBy('nearby')
                }
              >
                📍 जवळपासचे
              </button>

              <button
                type="button"
                className={`btn sort-button ${sortBy === 'rating'
                    ? 'btn-warning'
                    : 'btn-outline-warning'
                  }`}
                onClick={() =>
                  setSortBy('rating')
                }
              >
                ⭐ रेटिंगनुसार
              </button>
            </div>
          )}

        {loading && (
          <div className="text-center py-5">
            <div
              className="spinner-border text-warning"
              role="status"
            />

            <div className="text-secondary mt-3">
              Loading ...
            </div>
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger text-center"
            role="alert"
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="row gx-4">
            {sortedStores.map(
              (store, index) => {
                const isPranviComputech =
                  store.name?.trim().toLowerCase() ===
                  'pranvi computech'

                const averageRating =
                  store.averageRating

                const totalRatings =
                  store.totalRatings || 0

                const isValidRating =
                  !isNaN(
                    Number(averageRating)
                  ) &&
                  Number(averageRating) > 0

                const alreadyVisited =
                  store.alreadyVisited === true

                return (
                  <div
                    key={store.slug}
                    className="
                      col-12
                      col-sm-6
                      col-lg-4
                      store-card-column
                    "
                  >
                    <div
                      className="
                        card
                        store-card-custom
                        border-0
                      "
                      style={{
                        background:
                          'linear-gradient(145deg, #151a23, #090c12)',
                        borderRadius: '18px',
                        color: '#fff'
                      }}
                    >
                      <span
                        className="
                          card-inner-sparkle
                        "
                        style={{
                          top: '15%',
                          left: '12%',
                          animationDelay:
                            `${index * 0.2}s`,
                          fontSize: '13px'
                        }}
                      >
                        ✦
                      </span>

                      <span
                        className="
                          card-inner-sparkle
                        "
                        style={{
                          top: '30%',
                          right: '10%',
                          animationDelay:
                            `${index * 0.5}s`,
                          fontSize: '10px'
                        }}
                      >
                        ✧
                      </span>

                      <span
                        className="
                          card-inner-sparkle
                        "
                        style={{
                          top: '60%',
                          left: '8%',
                          animationDelay:
                            `${index * 0.8}s`,
                          fontSize: '16px'
                        }}
                      >
                        ✦
                      </span>

                      <span
                        className="
                          card-inner-sparkle
                        "
                        style={{
                          bottom: '10%',
                          right: '15%',
                          animationDelay:
                            `${index * 1.1}s`,
                          fontSize: '12px'
                        }}
                      >
                        ✧
                      </span>

                      <div
                        className="
                          store-image-wrapper
                        "
                      >
                        {store.image ? (
                          <img
                            src={`${API_URL}/uploads/${store.image}`}
                            className="
                              store-image
                            "
                            alt={store.name}
                            onClick={() =>
                              openMap(
                                store.mapLink
                              )
                            }
                            style={{
                              cursor:
                                store.mapLink
                                  ? 'pointer'
                                  : 'default'
                            }}
                          />
                        ) : (
                          <div
                            className="
                              d-flex
                              align-items-center
                              justify-content-center
                              w-100
                              h-100
                            "
                            style={{
                              color: '#6c757d',
                              fontSize: '60px'
                            }}
                          >
                            🏪
                          </div>
                        )}

                        {store.mapLink && (
                          <div
                            className="
                              image-map-label
                            "
                          >
                            📍 Tap image for map
                          </div>
                        )}
                      </div>

                      <div
                        className="
                          card-body
                          d-flex
                          flex-column
                          store-card-body-custom
                        "
                        style={{
                          padding: '20px'
                        }}
                      >
                        <h5
                          className="
                            fw-bold
                            mb-3
                            store-title-shine
                          "
                          style={{
                            fontSize: '21px'
                          }}
                        >
                          {store.name}
                        </h5>

                        {!isPranviComputech && (
                          <div className="rating-instagram-row">
                            <div className="rating-wrapper">
                              {isValidRating ? (
                                <>
                                  <span>
                                    {renderRatingStars(
                                      averageRating
                                    )}
                                  </span>

                                  <span
                                    className="
                                      text-secondary
                                      small
                                    "
                                  >
                                    {averageRating}
                                    {' '}
                                    (
                                    {totalRatings}
                                    {' '}
                                    rating
                                    {totalRatings ===
                                      1
                                      ? ''
                                      : 's'}
                                    )
                                  </span>
                                </>
                              ) : (
                                <span
                                  className="
                                    text-secondary
                                    small
                                  "
                                >
                                  No ratings yet
                                </span>
                              )}
                            </div>

                            {store.instaId && (
                              <button
                                type="button"
                                className="
                                  instagram-button
                                "
                                onClick={() =>
                                  openInstagram(
                                    store.instaId
                                  )
                                }
                                title="Open Instagram"
                                aria-label="Open Instagram"
                              >
                                <i className="bi bi-instagram"></i>
                              </button>
                            )}
                          </div>
                        )}

                        {isPranviComputech &&
                          store.instaId && (
                            <div
                              className="rating-instagram-row"
                              style={{
                                justifyContent:
                                  'flex-end'
                              }}
                            >
                              <button
                                type="button"
                                className="
                                  instagram-button
                                "
                                onClick={() =>
                                  openInstagram(
                                    store.instaId
                                  )
                                }
                                title="Open Instagram"
                                aria-label="Open Instagram"
                              >
                                <i className="bi bi-instagram"></i>
                              </button>
                            </div>
                          )}

                        <div className="mt-auto">
                          {!isPranviComputech &&
                            (alreadyVisited ? (
                              <div
                                className="
                                  text-center
                                  py-2
                                "
                                style={{
                                  color: '#42f59b',
                                  background:
                                    'rgba(25,135,84,0.12)',
                                  border:
                                    '1px solid rgba(25,135,84,0.35)',
                                  borderRadius: '10px',
                                  fontWeight: '600',
                                  boxShadow:
                                    '0 0 15px rgba(25,135,84,0.08)'
                                }}
                              >
                                ✓ देखावा पाहिला
                              </div>
                            ) : (
                              <Link
                                to={`/rate/${store.slug}`}
                                className="
                                  btn
                                  btn-outline-warning
                                  fw-semibold
                                  w-100
                                  rate-button
                                "
                              >
                                ⭐ Rate
                              </Link>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            )}
          </div>
        )}

        {!loading &&
          !error &&
          sortedStores.length === 0 && (
            <div
              className="
                text-center
                py-5
              "
              style={{
                color: '#adb5bd'
              }}
            >
              <div
                style={{
                  fontSize: '45px'
                }}
              >
                ✨
              </div>

              <h5>
                No stores available
              </h5>
            </div>
          )}
      </div>
    </div>
  )
}

export default StoreList