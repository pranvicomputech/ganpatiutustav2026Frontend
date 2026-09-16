import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../API'; // Import API_URL

function Store() {
  const { slug } = useParams();
  const [store, setStore] = useState({});
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [userMobile, setUserMobile] = useState('');

  useEffect(() => {
    async function loadStore() {
      const res = await fetch(`${API_URL}/store/${slug}`);
      const data = await res.json();
      setStore(data.store);
    }
    loadStore();
  }, [slug]);

  const handleRatingClick = (rate) => setRating(rate);

  const handleSubmit = async () => {
    if (!userName || !userMobile || rating === 0) {
      return alert('Please provide all the information.');
    }

    try {
      const res = await fetch(`${API_URL}/store/${slug}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userMobile, rating }),
      });

      const data = await res.json();
      if (data.error) {
        return alert(data.error);
      }

      alert('Thank you for your rating!');
      window.location.reload(); // Reload the page to show updated ratings
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('There was an error submitting your rating.');
    }
  };

  return (
    <div>
      <h2>{store.name}</h2>
      <div>⭐ Average: {store.averageRating || 'No ratings yet'}</div>
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'selected' : ''}`}
            onClick={() => handleRatingClick(star)}
          >
            ★
          </span>
        ))}
      </div>
      <input
        type="text"
        className="form-control my-2"
        placeholder="Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="text"
        className="form-control my-2"
        placeholder="Mobile Number"
        value={userMobile}
        onChange={(e) => setUserMobile(e.target.value)}
      />
      <button className="btn btn-success my-2" onClick={handleSubmit}>
        Submit Rating
      </button>
    </div>
  );
}

export default Store;
