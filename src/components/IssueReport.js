import React, { useState } from 'react';

function IssueReport({ onReport, user }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { name: 'Furniture', icon: '🪑' },
    { name: 'Classroom', icon: '🏫' },
    { name: 'Toilet', icon: '🚻' },
    { name: 'Electricity', icon: '⚡' },
    { name: 'Sanitation', icon: '🧼' },
    { name: 'Other', icon: '📦' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !location) return alert('Description and Location required');
    
    setIsSubmitting(true);
    setTimeout(() => {
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
      setIsSubmitting(false);
      setDescription('');
      setCategory('Furniture');
      setLocation('');
      setPriority('Medium');
      setImage(null);
    }, 1500);
  };

  const handleClear = () => {
    setDescription('');
    setCategory('Furniture');
    setLocation('');
    setPriority('Medium');
    setImage(null);
  };

  return (
    <div className="row justify-content-center animate-fade-in">
      <div className="col-md-10">
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white p-4">
            <div className="d-flex align-items-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{marginRight: '15px'}}>
                <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.3 19 9 17.7 9 16S10.3 14 12 14S15 15.3 15 16S13.7 19 12 19ZM17 19H7V18H17V19ZM17 16H7V15H17V16ZM17 13H7V5H17V13Z"/>
              </svg>
              <div>
                <h4 className="m-0">Report Facility Issue</h4>
                <p style={{opacity: 0.9, marginTop: '5px'}}>Help us maintain a safe school environment</p>
              </div>
            </div>
          </div>
          
          <div className="card-body p-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--primary-color)" style={{marginRight: '5px'}}>
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM16 10H8V8H16V10Z"/>
                  </svg>
                  Description
                </label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Describe the issue in detail (e.g., 'Broken desk in Classroom 5', 'Toilet pipe leaking')..." 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  required 
                  style={{borderRadius: '0.75rem'}}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select" 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    style={{borderRadius: '0.75rem'}}
                  >
                    {categories.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label">Priority Level</label>
                  <select 
                    className="form-select" 
                    value={priority} 
                    onChange={e => setPriority(e.target.value)}
                    style={{borderRadius: '0.75rem'}}
                  >
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Location in School</label>
                <input 
                  className="form-control" 
                  placeholder="e.g., Classroom 5, Toilet Block A, Main Building 2nd Floor" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  required 
                  style={{borderRadius: '0.75rem'}}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Upload Photo (Optional)</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept="image/*" 
                  onChange={e => setImage(e.target.files[0])}
                  style={{borderRadius: '0.75rem'}}
                />
                <small className="text-muted">📸 Photos help identify issues faster</small>
              </div>

              <div className="d-flex gap-3">
                <button 
                  className="btn btn-primary w-50" 
                  type="submit"
                  disabled={isSubmitting}
                  style={{height: '50px', fontSize: '1rem'}}
                >
                  {isSubmitting ? (
                    <span>
                      <span className="spinner d-inline" style={{width: '20px', height: '20px', borderTopColor: 'white', marginRight: '10px'}}></span>
                      Submitting...
                    </span>
                  ) : (
                    <span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{marginRight: '8px'}}>
                        <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.3 19 9 17.7 9 16S10.3 14 12 14S15 15.3 15 16S13.7 19 12 19ZM17 19H7V18H17V19ZM17 16H7V15H17V16ZM17 13H7V5H17V13Z"/>
                      </svg>
                      Submit Issue
                    </span>
                  )}
                </button>
                <button 
                  className="btn btn-secondary w-50" 
                  type="button"
                  onClick={handleClear}
                  style={{height: '50px', fontSize: '1rem'}}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueReport;
