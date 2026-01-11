import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Login from '../components/Login';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('resume');

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeMessage, setResumeMessage] = useState('');
  const [currentResume, setCurrentResume] = useState(null);

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillMessage, setSkillMessage] = useState('');

  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState({
    title: '', description: '', technologies: '', githubUrl: '', liveUrl: '', featured: false, image: null
  });
  const [editingProject, setEditingProject] = useState(null);
  const [projectMessage, setProjectMessage] = useState('');

  const [experiences, setExperiences] = useState([]);
  const [experienceData, setExperienceData] = useState({
    position: '', company: '', startDate: '', endDate: '', skills: '', description: ''
  });
  const [editingExperience, setEditingExperience] = useState(null);
  const [experienceMessage, setExperienceMessage] = useState('');

  const [certs, setCerts] = useState([]);
  const [certData, setCertData] = useState({ title: '', issuer: '', issueDate: '', url: '', image: null });
  const [certMessage, setCertMessage] = useState('');

  const [messages, setMessages] = useState([]);
  const [messageError, setMessageError] = useState('');

  // ================== FETCH FUNCTIONS ==================
  const fetchAll = useCallback(() => {
    axios.get('/api/resume/info').then(res => setCurrentResume(res.data)).catch(() => setCurrentResume(null));
    axios.get('/api/skills').then(res => setSkills(res.data)).catch(()=>{});
    axios.get('/api/projects').then(res => setProjects(res.data)).catch(()=>{});
    axios.get('/api/experiences').then(res => setExperiences(res.data)).catch(()=>{});
    axios.get('/api/certifications').then(res => setCerts(res.data)).catch(()=>{});
    if(token){
      axios.get('/api/contact', { headers: { Authorization: `Bearer ${token}` }}).then(res => setMessages(res.data)).catch(()=>{setMessageError('Failed')});
    }
  }, [token]);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if(savedToken){
      setToken(savedToken);
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      fetchAll();
    }
  }, [fetchAll]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem('adminToken', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    fetchAll();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  // ================== RESUME ==================
  const handleResumeUpload = async e => {
    e.preventDefault();
    if(!resumeFile) return;
    const formData = new FormData();
    formData.append('resume', resumeFile);
    try {
      await axios.post('/api/resume/upload', formData);
      setResumeMessage('Uploaded successfully!');
      setResumeFile(null);
      fetchAll();
    } catch { setResumeMessage('Upload failed'); }
  };

  const handleResumeDelete = async () => {
    try { await axios.delete('/api/resume'); setResumeMessage('Deleted successfully!'); fetchAll(); }
    catch { setResumeMessage('Delete failed'); }
  };

  // ================== SKILLS ==================
  const handleAddSkill = async e => {
    e.preventDefault();
    if(!newSkill.trim()) return;
    try {
      await axios.post('/api/skills', { name: newSkill.trim() });
      setNewSkill(''); setSkillMessage('Skill added!');
      fetchAll();
    } catch { setSkillMessage('Add failed'); }
  };

  const handleRemoveSkill = async skill => {
    try { await axios.delete(`/api/skills/${skill}`); setSkillMessage('Skill removed!'); fetchAll(); }
    catch { setSkillMessage('Remove failed'); }
  };

  // ================== PROJECTS ==================
  const handleProjectSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(projectData).forEach(key => { if(projectData[key]) formData.append(key, projectData[key]); });
    try {
      if(editingProject) await axios.put(`/api/projects/${editingProject._id}`, formData);
      else await axios.post('/api/projects', formData);
      setProjectData({ title:'', description:'', technologies:'', githubUrl:'', liveUrl:'', featured:false, image:null });
      setEditingProject(null);
      setProjectMessage('Project saved!');
      fetchAll();
    } catch { setProjectMessage('Save failed'); }
  };

  const handleEditProject = proj => {
    setEditingProject(proj);
    setProjectData({...proj, technologies: proj.technologies.join(', '), image:null});
    setActiveTab('add-project');
  };

  const handleDeleteProject = async id => { if(!window.confirm('Delete?')) return; try{ await axios.delete(`/api/projects/${id}`); fetchAll(); }catch{} };

  // ================== EXPERIENCE ==================
  const handleExperienceSubmit = async e => {
    e.preventDefault();
    try {
      if(editingExperience) await axios.put(`/api/experiences/${editingExperience._id}`, experienceData);
      else await axios.post('/api/experiences', experienceData);
      setExperienceData({ position:'', company:'', startDate:'', endDate:'', skills:'', description:'' });
      setEditingExperience(null);
      setExperienceMessage('Saved!');
      fetchAll();
    } catch { setExperienceMessage('Save failed'); }
  };

  const handleDeleteExperience = async id => { if(!window.confirm('Delete?')) return; try{ await axios.delete(`/api/experiences/${id}`); fetchAll(); }catch{} };

  // ================== CERTIFICATIONS ==================
  const handleCertSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(certData).forEach(key => { if(certData[key]) formData.append(key, certData[key]); });
    try { await axios.post('/api/certifications', formData); setCertData({ title:'', issuer:'', issueDate:'', url:'', image:null }); fetchAll(); setCertMessage('Saved!'); }
    catch { setCertMessage('Save failed'); }
  };

  const handleDeleteCert = async id => { if(!window.confirm('Delete?')) return; try{ await axios.delete(`/api/certifications/${id}`); fetchAll(); }catch{} };

  // ================== MESSAGES ==================
  const handleDeleteMessage = async id => { if(!window.confirm('Delete?')) return; try{ await axios.delete(`/api/contact/${id}`); fetchAll(); }catch{} };

  if(!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <nav className="admin-nav">
        {['resume','skills','projects','experience','certifications','messages'].map(tab => (
          <button key={tab} className={`nav-btn ${activeTab===tab?'active':''}`} onClick={()=>setActiveTab(tab)}>
            {tab.replace('-',' ').replace(/\b\w/g,l=>l.toUpperCase())}
          </button>
        ))}
      </nav>

      <div className="admin-section">

       {activeTab==='resume' && (
  <div className="section">
    <h2>Resume</h2>
    {currentResume ? (
      <>
        <p>Current file: {currentResume.originalName}</p>
        <button className="btn-primary" onClick={()=>window.open(currentResume.url)}>Download</button>
        <button className="btn-danger" onClick={handleResumeDelete}>Delete</button>
        <p>Upload new one</p>
        {currentResume.previewImage && (
          <div style={{marginTop:'10px'}}>
            <img src={currentResume.previewImage} alt="Resume Preview" style={{maxWidth:'300px'}} />
          </div>
        )}
      </>
    ) : <p>No resume uploaded</p>}
    <form onSubmit={handleResumeUpload}>
      <input type="file" onChange={e=>setResumeFile(e.target.files[0])} accept=".pdf"/>
      <button className="btn-primary" type="submit">Upload</button>
    </form>
    <p>{resumeMessage}</p>
  </div>
)}


        {/* ===== SKILLS ===== */}
        {activeTab==='skills' && (
          <div className="section">
            <h2>Skills</h2>
            <form onSubmit={handleAddSkill}>
              <input value={newSkill} onChange={e=>setNewSkill(e.target.value)} placeholder="New Skill"/>
              <button className="btn-primary" type="submit">Add</button>
            </form>
            <ul>
              {skills.map(skill => (
                <li key={skill}>
                  {skill} <button className="btn-danger" onClick={()=>handleRemoveSkill(skill)}>Delete</button>
                </li>
              ))}
            </ul>
            <p>{skillMessage}</p>
          </div>
        )}

        {activeTab==='projects' && (
  <div className="section">
    <h2>{editingProject ? 'Edit Project' : 'Add Project'}</h2>
    
   {/* ===== PROJECT FORM ===== */}
<form onSubmit={handleProjectSubmit}>
  <input 
    placeholder="Title" 
    value={projectData.title} 
    onChange={e => setProjectData({...projectData, title: e.target.value})} 
    required
  />
  <textarea 
    placeholder="Description" 
    value={projectData.description} 
    onChange={e => setProjectData({...projectData, description: e.target.value})} 
    required
  />
  <input 
    placeholder="Technologies (comma)" 
    value={projectData.technologies} 
    onChange={e => setProjectData({...projectData, technologies: e.target.value})}
  />
  <input 
    placeholder="Github URL" 
    value={projectData.githubUrl} 
    onChange={e => setProjectData({...projectData, githubUrl: e.target.value})}
  />
  <input 
    placeholder="Live URL" 
    value={projectData.liveUrl} 
    onChange={e => setProjectData({...projectData, liveUrl: e.target.value})}
  />
<label>
  <input
    type="checkbox"
    checked={projectData.featured}
    onChange={e => setProjectData({ ...projectData, featured: e.target.checked })}
  />
  Featured
</label>



  <input 
    type="file" 
    onChange={e => setProjectData({...projectData, image: e.target.files[0]})} 
    accept="image/*"
  />
  <button className="btn-primary" type="submit">{editingProject ? 'Update' : 'Add'}</button>
</form>
<p>{projectMessage}</p>


    {/* ===== EXISTING PROJECTS ===== */}
    <h2 style={{marginTop:'20px'}} align="center">Your Projects</h2>
    {projects.map(proj => (
      <div key={proj._id} style={{marginBottom:'15px', padding:'10px', background:'#1f1f38', borderRadius:'5px'}}>
        <h3>Title: {proj.title}</h3>
        {proj.hasImage && <img src={`/api/projects/${proj._id}/image`} alt={proj.title} />}
        <p>Description: {proj.description}</p>
        <p>Skills: {proj.technologies.join(', ')}</p>
        <p>Github: <a href={proj.githubUrl} target="_blank">{proj.githubUrl}</a></p>
        <p>Live: <a href={proj.liveUrl} target="_blank">{proj.liveUrl}</a></p>
        <p>Featured: {proj.featured ? 'Yes' : 'No'}</p>
        <button className="btn-edit" onClick={()=>handleEditProject(proj)}>Edit</button>
        <button className="btn-danger" onClick={()=>handleDeleteProject(proj._id)}>Delete</button>
      </div>
    ))}
  </div>
)}




        {/* ===== EXPERIENCE ===== */}
       {activeTab==='experience' && (
  <div className="section">
    <h2>Experience</h2>
    <form onSubmit={handleExperienceSubmit}>
      <input placeholder="Position" value={experienceData.position} onChange={e=>setExperienceData({...experienceData,position:e.target.value})}/>
      <input placeholder="Company" value={experienceData.company} onChange={e=>setExperienceData({...experienceData,company:e.target.value})}/>
      <input type="date" value={experienceData.startDate} onChange={e=>setExperienceData({...experienceData,startDate:e.target.value})}/>
      <input type="date" value={experienceData.endDate} onChange={e=>setExperienceData({...experienceData,endDate:e.target.value})}/>
      <input placeholder="Skills (comma)" value={experienceData.skills} onChange={e=>setExperienceData({...experienceData,skills:e.target.value})}/>
      <textarea placeholder="Description" value={experienceData.description} onChange={e=>setExperienceData({...experienceData,description:e.target.value})}/>
      <button className="btn-primary" type="submit">Save</button>
    </form>
    <p>{experienceMessage}</p>
     <h2 align="center">Your Experience</h2>
    {experiences.map(exp => (
      
      <div key={exp._id} style={{marginBottom:'15px', padding:'10px', background:'#1f1f38', borderRadius:'5px'}}>
       
        <h3>{exp.position} @ {exp.company}</h3>
        <p>Start: {exp.startDate} | End: {exp.endDate}</p>
        <p>Skills: {exp.skills}</p>
        <p>Description: {exp.description}</p>
        <button className="btn-danger" onClick={()=>handleDeleteExperience(exp._id)}>Delete</button>
      </div>
    ))}
  </div>
)}


       {activeTab==='certifications' && (
  <div className="section">
    <h2>Add Certifications</h2>
    <form onSubmit={handleCertSubmit}>
      <input placeholder="Title" value={certData.title} onChange={e=>setCertData({...certData,title:e.target.value})}/>
      <input placeholder="Issuer" value={certData.issuer} onChange={e=>setCertData({...certData,issuer:e.target.value})}/>
      <input type="date" value={certData.issueDate} onChange={e=>setCertData({...certData,issueDate:e.target.value})}/>
      <input placeholder="URL" value={certData.url} onChange={e=>setCertData({...certData,url:e.target.value})}/>
      <input type="file" onChange={e=>setCertData({...certData,image:e.target.files[0]})}/>
      <button className="btn-primary" type="submit">Save</button>
    </form>
    <h2 align="center">Your Certifications</h2>
    <p>{certMessage}</p>
    {certs.map(cert => (
      <div key={cert._id} style={{marginBottom:'15px', padding:'10px', background:'#1f1f38', borderRadius:'5px'}}>
        <h3>Title: {cert.title}</h3>
        {cert.image && (
  <img
    src={`/api/certifications/${cert._id}/image`}
    alt={cert.title}
    style={{ maxWidth: '150px', marginTop: '5px' }}
  />
)}

        <p>Issuer: {cert.issuer}</p>
        <p>Issue Date: {cert.issueDate}</p>
        <p>URL: <a href={cert.url} target="_blank">{cert.url}</a></p>
        <button className="btn-danger" onClick={()=>handleDeleteCert(cert._id)}>Delete</button>
      </div>
    ))}
  </div>
)}


       {activeTab==='messages' && (
  <div className="section">
    <h2>Messages</h2>
   
    {messages.map(msg => (
      <div key={msg._id} style={{marginBottom:'15px', padding:'10px', background:'#1f1f38', borderRadius:'5px'}}>
        <p>Name: {msg.name}</p>
        <p>Email: {msg.email}</p>
        <p>Subject: {msg.subject}</p>
        <p>Message: {msg.message}</p>
        <p>Sent At: {new Date(msg.createdAt).toLocaleString()}</p>
        <button className="btn-danger" onClick={()=>handleDeleteMessage(msg._id)}>Delete</button>
      </div>
    ))}
  </div>
)}


      </div>
    </div>
  );
};

export default Admin;
