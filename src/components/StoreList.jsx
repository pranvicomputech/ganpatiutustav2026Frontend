import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../API'

const ENABLE_RATE_BUTTON = true

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
        if (!response.ok) throw new Error('Failed to load stores')

        setStores(await response.json())
      } catch (err) {
        console.error('Error fetching stores:', err)
        setError('Failed to load stores.')
      } finally {
        setLoading(false)
      }
    }

    loadStores()
  }, [user?.mobile])

  const renderRatingStars = rating => {
    const numericRating = Number(rating) || 0

    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < numericRating ? '#ffd700' : '#555',
          fontSize: '18px',
          textShadow: i < numericRating
            ? '0 0 8px rgba(255,215,0,.6)'
            : 'none'
        }}
      >
        ★
      </span>
    ))
  }

  const sortedStores = [...stores].sort((a, b) => {
    const pranviA = a.name?.trim().toLowerCase() === 'pranvi computech'
    const pranviB = b.name?.trim().toLowerCase() === 'pranvi computech'

    if (pranviA && !pranviB) return -1
    if (!pranviA && pranviB) return 1

    if (sortBy === 'rating') {
      const ratingA = Number(a.averageRating) || 0
      const ratingB = Number(b.averageRating) || 0
      if (ratingA !== ratingB) return ratingB - ratingA
    }

    return (a.serialIndex || 0) - (b.serialIndex || 0)
  })

  const openMap = link => {
    if (link) window.open(link, '_blank', 'noopener,noreferrer')
  }

  const openInstagram = id => {
    if (!id) return
    const username = id.replace(/^@/, '').trim()
    if (username) {
      window.open(
        `https://www.instagram.com/${username}/`,
        '_blank',
        'noopener,noreferrer'
      )
    }
  }

  return (
    <div className="store-page">
      <style>{`
        @keyframes sparkle {
          0% { transform:translateY(20px) scale(.3) rotate(0);opacity:0 }
          20% { opacity:1 }
          50% { transform:translateY(-30px) translateX(10px) scale(1) rotate(45deg);opacity:.9 }
          100% { transform:translateY(-75px) translateX(-8px) scale(.2) rotate(90deg);opacity:0 }
        }

        @keyframes glow {
          0%,100% { box-shadow:0 10px 30px rgba(0,0,0,.45) }
          50% { box-shadow:0 10px 40px rgba(0,195,255,.16) }
        }

        @keyframes shine {
          0% { background-position:200% center }
          100% { background-position:-200% center }
        }

        .store-page {
          min-height:100vh;
          background:radial-gradient(circle at top,#18202d 0%,#080a0f 45%,#030405 100%);
          color:#fff;
          padding-bottom:60px;
          overflow:hidden;
        }

        .store-card-column {
          padding:22px 0;
        }

        .store-card {
          position:relative;
          overflow:hidden;
          height:100%;
          border:2px solid rgba(255,215,0,.45)!important;
          border-radius:18px;
          background:linear-gradient(145deg,#151a23,#090c12);
          animation:glow 4s ease-in-out infinite;
          transition:transform .25s ease,border-color .25s ease;
        }

        .store-card:hover {
          transform:translateY(-5px);
          border-color:rgba(0,200,255,.8)!important;
        }

        .sparkle {
          position:absolute;
          color:#fff;
          pointer-events:none;
          user-select:none;
          z-index:3;
          animation:sparkle 3.5s linear infinite;
        }

        .store-title {
          background:linear-gradient(90deg,#fff,#69e7ff,#fff,#ffd700,#fff);
          background-size:300% auto;
          background-clip:text;
          -webkit-background-clip:text;
          color:transparent;
          -webkit-text-fill-color:transparent;
          animation:shine 5s linear infinite;
        }

        .store-image-wrapper {
          position:relative;
          width:100%;
          min-height:300px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          padding:0;
        }

        .store-image {
          position:relative;
          z-index:2;
          display:block;
          width:100%;
          height:auto;
          max-width:100%;
          object-fit:contain;
          object-position:center;
        }

        .image-map-label {
          position:absolute;
          z-index:4;
          bottom:10px;
          left:10px;
          background:rgba(0,0,0,.78);
          padding:5px 10px;
          border-radius:20px;
          font-size:12px;
          pointer-events:none;
        }

        .sort-wrapper {
          margin:10px 0 18px;
          padding:0 10px;
        }

        .sort-button {
          min-width:160px;
          min-height:44px;
          border-radius:10px;
          font-weight:600;
          margin:4px;
        }

        .rating-instagram-row {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          min-height:30px;
          margin-bottom:18px;
        }

        .rating-wrapper {
          display:flex;
          align-items:center;
          flex-wrap:wrap;
          gap:8px;
          min-width:0;
        }

        .instagram-button {
          flex-shrink:0;
          width:38px;
          height:38px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          border:1px solid rgba(225,48,108,.6);
          border-radius:9px;
          background:rgba(225,48,108,.12);
          color:#ff66c4;
          font-size:20px;
          cursor:pointer;
          transition:.2s ease;
          padding:0;
        }

        .instagram-button:hover {
          background:rgba(225,48,108,.28);
          border-color:#E1306C;
          color:#fff;
          transform:translateY(-2px);
          box-shadow:0 4px 12px rgba(225,48,108,.25);
        }

        .rate-button {
          border-radius:10px;
          min-height:44px;
        }

        @media(max-width:576px) {
          .store-card-column { padding:16px 0 }
          .store-image-wrapper { min-height:260px }
          .sort-wrapper { margin:5px 0 15px;padding:0 5px }
          .sort-button { width:100%;margin:4px 0 }
          .instagram-button { width:36px;height:36px;font-size:19px }
        }
      `}</style>

      <div className="container py-4 position-relative">

        <div
          className="p-3 p-md-4 mb-5 rounded-4 text-center"
          style={{
            background: 'linear-gradient(135deg,rgba(20,25,35,.97),rgba(8,10,15,.97))',
            border: '1px solid rgba(255,255,255,.12)',
            boxShadow: '0 10px 35px rgba(0,0,0,.4)'
          }}
        >
          <div style={{ color: '#ffd700', fontSize: 28, marginBottom: 8 }}>
            ✨ 🪔 ✨
          </div>

          <div className="h4 fw-bold mb-3">
            येवला गणपतीउत्सव २०२६ मध्ये आपणा सर्वांचे स्वागत
          </div>

          <hr style={{ borderColor: 'rgba(255,255,255,.15)' }} />

          <div
            className="h6 mb-0"
            style={{ color: '#adb5bd', lineHeight: 1.7 }}
          >
            देखावा बघायला जाण्यासाठीचा मॅप उघडण्यासाठी त्या देखाव्याच्या फोटोवर टच करा
          </div>
        </div>

        {!loading && !error && stores.length > 0 && (
          <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2 sort-wrapper">
            <button
              type="button"
              className={`btn sort-button ${sortBy === 'nearby'
                ? 'btn-warning'
                : 'btn-outline-warning'
                }`}
              onClick={() => setSortBy('nearby')}
            >
              📍 जवळपासचे
            </button>

            <button
              type="button"
              className={`btn sort-button ${sortBy === 'rating'
                ? 'btn-warning'
                : 'btn-outline-warning'
                }`}
              onClick={() => setSortBy('rating')}
            >
              ⭐ रेटिंगनुसार
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" />
            <div className="text-secondary mt-3">Loading ...</div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="row gx-4">
            {sortedStores.map((store, index) => {
              const isPranvi =
                store.name?.trim().toLowerCase() === 'pranvi computech'

              const averageRating = store.averageRating
              const totalRatings = store.totalRatings || 0
              const validRating =
                !isNaN(Number(averageRating)) &&
                Number(averageRating) > 0

              const alreadyVisited = store.alreadyVisited === true

              return (
                <div
                  key={store.slug}
                  className="col-12 col-sm-6 col-lg-4 store-card-column"
                >
                  <div className="card store-card">

                    <span
                      className="sparkle"
                      style={{
                        top: '15%',
                        left: '12%',
                        animationDelay: `${index * .2}s`
                      }}
                    >
                      ✦
                    </span>

                    <span
                      className="sparkle"
                      style={{
                        top: '30%',
                        right: '10%',
                        fontSize: 10,
                        animationDelay: `${index * .5}s`
                      }}
                    >
                      ✧
                    </span>

                    <span
                      className="sparkle"
                      style={{
                        top: '60%',
                        left: '8%',
                        fontSize: 16,
                        animationDelay: `${index * .8}s`
                      }}
                    >
                      ✦
                    </span>

                    <span
                      className="sparkle"
                      style={{
                        bottom: '10%',
                        right: '15%',
                        fontSize: 12,
                        animationDelay: `${index * 1.1}s`
                      }}
                    >
                      ✧
                    </span>

                    <div className="store-image-wrapper">
                      {store.image ? (
                        <img
                          src={`${API_URL}/uploads/${store.image}`}
                          className="store-image"
                          alt={store.name}
                          onClick={() => openMap(store.mapLink)}
                          style={{
                            cursor: store.mapLink
                              ? 'pointer'
                              : 'default'
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center w-100"
                          style={{
                            minHeight: 300,
                            color: '#6c757d',
                            fontSize: 60
                          }}
                        >
                          🏪
                        </div>
                      )}

                      {store.mapLink && (
                        <div className="image-map-label">
                          📍 Tap image for map
                        </div>
                      )}
                    </div>

                    <div
                      className="card-body d-flex flex-column"
                      style={{
                        padding: 20,
                        position: 'relative',
                        zIndex: 2
                      }}
                    >
                      <h5
                        className="fw-bold mb-3 store-title"
                        style={{ fontSize: 21 }}
                      >
                        {store.name}
                      </h5>

                      {!isPranvi && (
                        <div className="rating-instagram-row">
                          <div className="rating-wrapper">
                            {validRating ? (
                              <>
                                <span>
                                  {renderRatingStars(averageRating)}
                                </span>

                                <span className="text-secondary small">
                                  {averageRating} ({totalRatings} rating
                                  {totalRatings === 1 ? '' : 's'})
                                </span>
                              </>
                            ) : (
                              <span className="text-secondary small">
                                No ratings yet
                              </span>
                            )}
                          </div>

                          {store.instaId && (
                            <button
                              type="button"
                              className="instagram-button"
                              onClick={() =>
                                openInstagram(store.instaId)
                              }
                              title="Open Instagram"
                              aria-label="Open Instagram"
                            >
                              <i className="bi bi-instagram" />
                            </button>
                          )}
                        </div>
                      )}

                      {isPranvi && store.instaId && (
                        <div
                          className="rating-instagram-row"
                          style={{ justifyContent: 'flex-end' }}
                        >
                          <button
                            type="button"
                            className="instagram-button"
                            onClick={() =>
                              openInstagram(store.instaId)
                            }
                            title="Open Instagram"
                            aria-label="Open Instagram"
                          >
                            <i className="bi bi-instagram" />
                          </button>
                        </div>
                      )}

                      <div className="mt-auto">
                        {!isPranvi && (
                          alreadyVisited ? (
                            <div
                              className="text-center py-2"
                              style={{
                                color: '#42f59b',
                                background: 'rgba(25,135,84,.12)',
                                border: '1px solid rgba(25,135,84,.35)',
                                borderRadius: 10,
                                fontWeight: 600
                              }}
                            >
                              ✓ देखावा पाहिला
                            </div>
                          ) : ENABLE_RATE_BUTTON ? (
                            <Link
                              to={`/rate/${store.slug}`}
                              className="btn btn-outline-warning fw-semibold w-100 rate-button"
                            >
                              ⭐ Rate
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-outline-warning fw-semibold w-100 rate-button"
                              disabled
                            >
                              ⭐ Rate
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && !error && sortedStores.length === 0 && (
          <div
            className="text-center py-5"
            style={{ color: '#adb5bd' }}
          >
            <div style={{ fontSize: 45 }}>✨</div>
            <h5>No stores available</h5>
          </div>
        )}

        {/* Logout button intentionally kept hidden/commented.
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            localStorage.removeItem('user')
            window.location.href = '/login'
          }}
        >
          Logout
        </button>
        */}

      </div>
    </div>
  )
}

export default StoreList
