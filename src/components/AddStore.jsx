import React, { useState } from 'react'
import { API_URL } from '../API'
import { useNavigate } from 'react-router-dom'
function AddStore() {
  const [storeData, setStoreData] = useState({
    name: '',
    mapLink: '',
    instaId: '',
    serialIndex: '',
    image: null,
    token: ''
  })
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target
    setStoreData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  const handleFileChange = (e) => {
    setStoreData(prevState => ({
      ...prevState,
      image: e.target.files[0] || null
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const formData = new FormData()
      formData.append('name', storeData.name)
      formData.append('mapLink', storeData.mapLink)
      formData.append('instaId', storeData.instaId)
      formData.append('serialIndex', storeData.serialIndex)
      if (storeData.image) {
        formData.append('image', storeData.image)
      }
      formData.append('token', storeData.token)
      const res = await fetch(`${API_URL}/admin/add-store`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      setMsg(data.message || data.error)
      if (res.ok) {
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      console.error(error)
      setMsg('Server error')
    }
  }
  return (
    <div className="container mt-5">
      <h2>Add New Store</h2>
      <form onSubmit={handleSubmit}>
        <div className="row align-items-center my-2">
          <label className="col-sm-3 col-form-label">Store Name</label>
          <div className="col-sm-9">
            <input
              type="text"
              name="name"
              value={storeData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Store Name"
              required
            />
          </div>
        </div>
        <div className="row align-items-center my-2">
          <label className="col-sm-3 col-form-label">Google Maps Link</label>
          <div className="col-sm-9">
            <input
              type="text"
              name="mapLink"
              value={storeData.mapLink}
              onChange={handleChange}
              className="form-control"
              placeholder="Google Maps Link"
              required
            />
          </div>
        </div>
        <div className="row align-items-center my-2">
          <label className="col-sm-3 col-form-label">Instagram ID</label>
          <div className="col-sm-9">
            <input
              type="text"
              name="instaId"
              value={storeData.instaId}
              onChange={handleChange}
              className="form-control"
              placeholder="Instagram ID (Optional)"
            />
          </div>
        </div>
        <div className="row align-items-center my-2">
          <label className="col-sm-3 col-form-label">Serial Index</label>
          <div className="col-sm-9">
            <input
              type="number"
              name="serialIndex"
              value={storeData.serialIndex}
              onChange={handleChange}
              className="form-control"
              placeholder="Serial Index"
              min="1"
              required
            />
          </div>
        </div>
        <div className="row align-items-center my-2">
          <label className="col-sm-3 col-form-label">Store Image</label>
          <div className="col-sm-9">
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control"
              accept="image/*"
            />
            <small className="text-muted">Optional</small>
          </div>
        </div>
        <div className="row align-items-center my-2">
          <label className="col-sm-3 col-form-label">Admin Token</label>
          <div className="col-sm-9">
            <input
              type="text"
              name="token"
              value={storeData.token}
              onChange={handleChange}
              className="form-control"
              placeholder="Admin Token"
              required
            />
          </div>
        </div>
        <button className="btn btn-success mt-3" type="submit">
          Add Store
        </button>
      </form>
      <p className="mt-3">{msg}</p>
      {msg && msg.toLowerCase().includes('success') && (
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary mt-2"
        >
          Go to Store List
        </button>
      )}
    </div>
  )
}
export default AddStore