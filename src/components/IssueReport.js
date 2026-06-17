import React, { useState } from 'react';

function IssueReport({ onReport, user }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [image, setImage] = useState(null);

  const categories = ['Furniture', 'Classroom', 'Toilet', 'Electricity', 'Sanitation', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !location) return alert('Description and Location required');
    
    onReport({
      description,
      category,
      location,
      priority,
      image,
      schoolId: user.schoolId,
      reportedBy: user.name,
      role: user.role
    });
    
    setDescription('');
    setCategory('Furniture');
    setLocation('');
    setPriority('Medium');
    setImage(null);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h4>Report Facility Issue</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" placeholder="Describe the issue..." value={description} onChange={e => setDescription(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Location in School</label>
                <input className="form-control" placeholder="e.g., Classroom 5, Toilet Block A" value={location} onChange={e => setLocation(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Priority</label>
                <select className="form-control" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Image (optional)</label>
                <input type="file" className="form-control" accept="image/*" onChange={e => setImage(e.target.files[0])} />
              </div>

              <button className="btn btn-primary w-100" type="submit">Submit Issue</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueReport;
