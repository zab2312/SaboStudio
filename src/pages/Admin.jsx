import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Calendar, Clock, X, Mail, FileSearch, Package } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { supabase } from '../lib/supabase'
import AdminLayout from '../components/AdminLayout'
import Section from '../components/Section'
import './Admin.css'

export default function Admin() {
  // Package mapping
  const packageMap = {
    start: 'START WEB',
    upiti: 'WEB KOJI DONOSI UPITE',
    custom: 'CUSTOM WEB'
  }
  const [activeTab, setActiveTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [appointments, setAppointments] = useState([])
  const [auditRequests, setAuditRequests] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [faqs, setFaqs] = useState([])
  const [workingHours, setWorkingHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showTestimonialModal, setShowTestimonialModal] = useState(false)
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [showHoursModal, setShowHoursModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [editingFAQ, setEditingFAQ] = useState(null)
  const [editingHours, setEditingHours] = useState(null)

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    short_description: '',
    full_description: '',
    technologies: '',
    development_time: '',
    website_url: '',
    image_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [testimonialForm, setTestimonialForm] = useState({
    client_name: '',
    comment: ''
  })

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    order_index: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    await Promise.all([
      loadProjects(),
      loadAppointments(),
      loadAuditRequests(),
      loadTestimonials(),
      loadFAQs(),
      loadWorkingHours()
    ])
    setLoading(false)
  }

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    setProjects(data || [])
  }

  const loadAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
    setAppointments(data || [])
  }

  const loadWorkingHours = async () => {
    const { data } = await supabase
      .from('working_hours')
      .select('*')
      .order('day_of_week', { ascending: true })
    setWorkingHours(data || [])
  }

  const loadAuditRequests = async () => {
    const { data } = await supabase
      .from('audit_requests')
      .select('*')
      .order('created_at', { ascending: false })
    setAuditRequests(data || [])
  }

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    setTestimonials(data || [])
  }

  const loadFAQs = async () => {
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true })
    setFaqs(data || [])
  }

  const uploadImage = async (file) => {
    if (!file) return null

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `project-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      setUploadingImage(false)
      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadingImage(false)
      alert('Greška pri uploadu slike: ' + error.message)
      return null
    }
  }

  const handleProjectSubmit = async (e) => {
    e.preventDefault()
    const technologies = projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
    
    let imageUrl = projectForm.image_url

    // Upload image if file is selected
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile)
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else {
        return // Stop if upload failed
      }
    }
    
    const projectData = {
      ...projectForm,
      technologies,
      image_url: imageUrl || null
    }

    if (editingProject) {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingProject.id)
      if (!error) {
        await loadProjects()
        setShowProjectModal(false)
        setEditingProject(null)
        setProjectForm({
          title: '',
          description: '',
          short_description: '',
          full_description: '',
          technologies: '',
          development_time: '',
          website_url: '',
          image_url: ''
        })
        setImageFile(null)
        setImagePreview(null)
      }
    } else {
      const { error } = await supabase
        .from('projects')
        .insert(projectData)
      if (!error) {
        await loadProjects()
        setShowProjectModal(false)
        setProjectForm({
          title: '',
          description: '',
          short_description: '',
          full_description: '',
          technologies: '',
          development_time: '',
          website_url: '',
          image_url: ''
        })
        setImageFile(null)
        setImagePreview(null)
      }
    }
  }

  const handleDeleteProject = async (id) => {
    if (confirm('Jeste li sigurni da želite obrisati ovaj projekt?')) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      if (!error) {
        await loadProjects()
      }
    }
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title,
      description: project.description,
      short_description: project.short_description || '',
      full_description: project.full_description || '',
      technologies: project.technologies?.join(', ') || '',
      development_time: project.development_time,
      website_url: project.website_url || '',
      image_url: project.image_url || ''
    })
    setImageFile(null)
    setImagePreview(project.image_url || null)
    setShowProjectModal(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleWorkingHoursUpdate = async (dayId, startTime, endTime, isAvailable) => {
    const { error } = await supabase
      .from('working_hours')
      .update({
        start_time: startTime,
        end_time: endTime,
        is_available: isAvailable
      })
      .eq('id', dayId)
    if (!error) {
      await loadWorkingHours()
    }
  }

  const handleDeleteAppointment = async (id) => {
    if (confirm('Jeste li sigurni da želite obrisati ovu rezervaciju?')) {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
      if (!error) {
        await loadAppointments()
      } else {
        alert('Greška pri brisanju rezervacije: ' + error.message)
      }
    }
  }

  const handleDeleteAuditRequest = async (id) => {
    if (confirm('Jeste li sigurni da želite obrisati ovaj zahtjev za analizu?')) {
      const { error } = await supabase
        .from('audit_requests')
        .delete()
        .eq('id', id)
      if (!error) {
        await loadAuditRequests()
      } else {
        alert('Greška pri brisanju zahtjeva: ' + error.message)
      }
    }
  }

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault()
    const testimonialData = {
      client_name: testimonialForm.client_name,
      comment: testimonialForm.comment
    }

    if (editingTestimonial) {
      const { error } = await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', editingTestimonial.id)
      if (!error) {
        await loadTestimonials()
        setShowTestimonialModal(false)
        setEditingTestimonial(null)
        setTestimonialForm({ client_name: '', comment: '' })
      }
    } else {
      const { error } = await supabase
        .from('testimonials')
        .insert(testimonialData)
      if (!error) {
        await loadTestimonials()
        setShowTestimonialModal(false)
        setTestimonialForm({ client_name: '', comment: '' })
      }
    }
  }

  const handleDeleteTestimonial = async (id) => {
    if (confirm('Jeste li sigurni da želite obrisati ovaj komentar?')) {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)
      if (!error) {
        await loadTestimonials()
      } else {
        alert('Greška pri brisanju komentara: ' + error.message)
      }
    }
  }

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial)
    setTestimonialForm({
      client_name: testimonial.client_name,
      comment: testimonial.comment
    })
    setShowTestimonialModal(true)
  }

  const handleFAQSubmit = async (e) => {
    e.preventDefault()
    const faqData = {
      question: faqForm.question,
      answer: faqForm.answer,
      order_index: faqForm.order_index || 0
    }

    if (editingFAQ) {
      const { error } = await supabase
        .from('faqs')
        .update(faqData)
        .eq('id', editingFAQ.id)
      if (!error) {
        await loadFAQs()
        setShowFAQModal(false)
        setEditingFAQ(null)
        setFaqForm({ question: '', answer: '', order_index: 0 })
      }
    } else {
      const { error } = await supabase
        .from('faqs')
        .insert(faqData)
      if (!error) {
        await loadFAQs()
        setShowFAQModal(false)
        setFaqForm({ question: '', answer: '', order_index: 0 })
      }
    }
  }

  const handleDeleteFAQ = async (id) => {
    if (confirm('Jeste li sigurni da želite obrisati ovo pitanje?')) {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id)
      if (!error) {
        await loadFAQs()
      } else {
        alert('Greška pri brisanju pitanja: ' + error.message)
      }
    }
  }

  const handleEditFAQ = (faq) => {
    setEditingFAQ(faq)
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      order_index: faq.order_index || 0
    })
    setShowFAQModal(true)
  }

  const dayNames = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']

  return (
    <AdminLayout>
      <Section className="admin-section">
        <h1 className="admin-title">Admin Panel</h1>
        
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projekti
          </button>
          <button
            className={`admin-tab ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Rezervacije
          </button>
          <button
            className={`admin-tab ${activeTab === 'audits' ? 'active' : ''}`}
            onClick={() => setActiveTab('audits')}
          >
            Analize
          </button>
          <button
            className={`admin-tab ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            Komentari
          </button>
          <button
            className={`admin-tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </button>
          <button
            className={`admin-tab ${activeTab === 'hours' ? 'active' : ''}`}
            onClick={() => setActiveTab('hours')}
          >
            Radno vrijeme
          </button>
        </div>

        {activeTab === 'projects' && (
          <div className="admin-content">
            <button
              className="add-button"
              onClick={() => {
                setEditingProject(null)
                setProjectForm({
                  title: '',
                  description: '',
                  short_description: '',
                  full_description: '',
                  technologies: '',
                  development_time: '',
                  website_url: '',
                  image_url: ''
                })
                setShowProjectModal(true)
              }}
            >
              <Plus size={20} />
              Dodaj projekt
            </button>

            {loading ? (
              <div className="admin-loading">Učitavanje...</div>
            ) : (
              <div className="admin-list">
                {projects.map((project) => (
                  <div key={project.id} className="admin-item">
                    <div className="admin-item-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                    <div className="admin-item-actions">
                      <button onClick={() => handleEditProject(project)}>
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="admin-content">
            {loading ? (
              <div className="admin-loading">Učitavanje...</div>
            ) : (
              <div className="appointments-list">
                {appointments.length === 0 ? (
                  <div className="admin-empty">Nema rezervacija.</div>
                ) : (
                  appointments.map((appointment) => (
                    <div key={appointment.id} className="appointment-item">
                      <div className="appointment-info">
                        <h3>{appointment.client_name}</h3>
                        <p>{appointment.client_email}</p>
                        <div className="appointment-date">
                          <Calendar size={16} />
                          <span>{new Date(appointment.appointment_date).toLocaleString('hr-HR')}</span>
                        </div>
                        {appointment.package_selected && (
                          <div className="appointment-package">
                            <Package size={16} />
                            <span>{packageMap[appointment.package_selected] || appointment.package_selected}</span>
                          </div>
                        )}
                        <span className={`appointment-status ${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        title="Obriši rezervaciju"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'audits' && (
          <div className="admin-content">
            {loading ? (
              <div className="admin-loading">Učitavanje...</div>
            ) : (
              <div className="audit-requests-list">
                {auditRequests.length === 0 ? (
                  <div className="admin-empty">Nema zahtjeva za analizu.</div>
                ) : (
                  auditRequests.map((request) => (
                    <div key={request.id} className="audit-request-item">
                      <div className="audit-request-info">
                        <h3>{request.client_name}</h3>
                        <p>
                          <Mail size={16} style={{ display: 'inline', marginRight: '8px' }} />
                          {request.client_email}
                        </p>
                        {request.website_url && (
                          <p>
                            <FileSearch size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            <a href={request.website_url} target="_blank" rel="noopener noreferrer" className="website-link">
                              {request.website_url}
                            </a>
                          </p>
                        )}
                        <div className="audit-request-meta">
                          <span className={`audit-status ${request.status}`}>
                            {request.status === 'pending' ? 'Na čekanju' : request.status}
                          </span>
                          <span className="audit-date">
                            {new Date(request.created_at).toLocaleString('hr-HR')}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteAuditRequest(request.id)}
                        title="Obriši zahtjev"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="admin-content">
            <button
              className="add-button"
              onClick={() => {
                setEditingTestimonial(null)
                setTestimonialForm({ client_name: '', comment: '' })
                setShowTestimonialModal(true)
              }}
            >
              <Plus size={20} />
              Dodaj komentar
            </button>

            {loading ? (
              <div className="admin-loading">Učitavanje...</div>
            ) : (
              <div className="admin-list">
                {testimonials.length === 0 ? (
                  <div className="admin-empty">Nema komentara.</div>
                ) : (
                  testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="admin-item">
                      <div className="admin-item-content">
                        <h3>{testimonial.client_name}</h3>
                        <p>"{testimonial.comment}"</p>
                      </div>
                      <div className="admin-item-actions">
                        <button onClick={() => handleEditTestimonial(testimonial)}>
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDeleteTestimonial(testimonial.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="admin-content">
            <button
              className="add-button"
              onClick={() => {
                setEditingFAQ(null)
                setFaqForm({ question: '', answer: '', order_index: 0 })
                setShowFAQModal(true)
              }}
            >
              <Plus size={20} />
              Dodaj FAQ
            </button>

            {loading ? (
              <div className="admin-loading">Učitavanje...</div>
            ) : (
              <div className="admin-list">
                {faqs.length === 0 ? (
                  <div className="admin-empty">Nema pitanja.</div>
                ) : (
                  faqs.map((faq) => (
                    <div key={faq.id} className="admin-item">
                      <div className="admin-item-content">
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                          Redoslijed: {faq.order_index || 0}
                        </span>
                      </div>
                      <div className="admin-item-actions">
                        <button onClick={() => handleEditFAQ(faq)}>
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDeleteFAQ(faq.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="admin-content">
            {loading ? (
              <div className="admin-loading">Učitavanje...</div>
            ) : (
              <div className="working-hours-list">
                {workingHours.map((wh) => (
                  <div key={wh.id} className="working-hours-item">
                    <div className="hours-day">
                      <h3>{dayNames[wh.day_of_week]}</h3>
                      <label className="hours-toggle">
                        <input
                          type="checkbox"
                          checked={wh.is_available}
                          onChange={(e) => handleWorkingHoursUpdate(wh.id, wh.start_time, wh.end_time, e.target.checked)}
                        />
                        <span>Dostupno</span>
                      </label>
                    </div>
                    {wh.is_available && (
                      <div className="hours-time">
                        <input
                          type="time"
                          value={wh.start_time}
                          onChange={(e) => handleWorkingHoursUpdate(wh.id, e.target.value, wh.end_time, wh.is_available)}
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={wh.end_time}
                          onChange={(e) => handleWorkingHoursUpdate(wh.id, wh.start_time, e.target.value, wh.is_available)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {showProjectModal && (
          <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <button className="modal-close" onClick={() => setShowProjectModal(false)}>
                <X size={24} />
              </button>
              <h2>{editingProject ? 'Uredi projekt' : 'Dodaj projekt'}</h2>
              <form onSubmit={handleProjectSubmit}>
                <div className="form-group">
                  <label>Naziv</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Opis (legacy - zadržano za kompatibilnost)</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Kratki opis *</label>
                  <p className="form-hint">Ovaj opis se prikazuje na početnoj stranici u karticama projekata</p>
                  <textarea
                    value={projectForm.short_description}
                    onChange={(e) => setProjectForm({ ...projectForm, short_description: e.target.value })}
                    required
                    rows={4}
                    placeholder="Kratak opis projekta koji se prikazuje na početnoj stranici..."
                  />
                </div>
                <div className="form-group">
                  <label>Cijeli opis projekta *</label>
                  <p className="form-hint">Detaljni opis koji se prikazuje na stranici detalja projekta. Možeš koristiti bold, italic, linkove, slike itd.</p>
                  <div className="quill-wrapper">
                    <ReactQuill
                      theme="snow"
                      value={projectForm.full_description}
                      onChange={(value) => setProjectForm({ ...projectForm, full_description: value })}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'color': [] }, { 'background': [] }],
                          ['link', 'image'],
                          ['clean']
                        ]
                      }}
                      formats={[
                        'header',
                        'bold', 'italic', 'underline', 'strike',
                        'list', 'bullet',
                        'color', 'background',
                        'link', 'image'
                      ]}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Tehnologije (odvojene zarezom)</label>
                  <input
                    type="text"
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>
                <div className="form-group">
                  <label>Vrijeme izrade</label>
                  <input
                    type="text"
                    value={projectForm.development_time}
                    onChange={(e) => setProjectForm({ ...projectForm, development_time: e.target.value })}
                    placeholder="2 tjedna"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>URL web stranice</label>
                  <input
                    type="url"
                    value={projectForm.website_url}
                    onChange={(e) => setProjectForm({ ...projectForm, website_url: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Slika projekta</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image-button"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview(null)
                          if (!editingProject) {
                            setProjectForm({ ...projectForm, image_url: '' })
                          }
                        }}
                      >
                        <X size={16} />
                        Ukloni sliku
                      </button>
                    </div>
                  )}
                  {!imagePreview && projectForm.image_url && (
                    <div className="image-preview">
                      <img src={projectForm.image_url} alt="Current" />
                      <p className="image-url-note">Trenutna slika (možeš uploadati novu)</p>
                    </div>
                  )}
                  <p className="form-hint">Ili unesi URL slike:</p>
                  <input
                    type="url"
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    disabled={!!imageFile}
                  />
                </div>
                <button type="submit" className="submit-button" disabled={uploadingImage}>
                  {uploadingImage ? 'Uploadanje slike...' : editingProject ? 'Spremi promjene' : 'Dodaj projekt'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showTestimonialModal && (
          <div className="modal-overlay" onClick={() => setShowTestimonialModal(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <button className="modal-close" onClick={() => setShowTestimonialModal(false)}>
                <X size={24} />
              </button>
              <h2>{editingTestimonial ? 'Uredi komentar' : 'Dodaj komentar'}</h2>
              <form onSubmit={handleTestimonialSubmit}>
                <div className="form-group">
                  <label>Ime klijenta</label>
                  <input
                    type="text"
                    value={testimonialForm.client_name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, client_name: e.target.value })}
                    required
                    placeholder="Ime i prezime klijenta"
                  />
                </div>
                <div className="form-group">
                  <label>Komentar</label>
                  <textarea
                    value={testimonialForm.comment}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, comment: e.target.value })}
                    required
                    rows={5}
                    placeholder="Komentar klijenta..."
                  />
                </div>
                <button type="submit" className="submit-button">
                  {editingTestimonial ? 'Spremi promjene' : 'Dodaj komentar'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showFAQModal && (
          <div className="modal-overlay" onClick={() => setShowFAQModal(false)}>
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <button className="modal-close" onClick={() => setShowFAQModal(false)}>
                <X size={24} />
              </button>
              <h2>{editingFAQ ? 'Uredi FAQ' : 'Dodaj FAQ'}</h2>
              <form onSubmit={handleFAQSubmit}>
                <div className="form-group">
                  <label>Pitanje</label>
                  <input
                    type="text"
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    required
                    placeholder="Pitanje..."
                  />
                </div>
                <div className="form-group">
                  <label>Odgovor</label>
                  <textarea
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    required
                    rows={5}
                    placeholder="Odgovor..."
                  />
                </div>
                <div className="form-group">
                  <label>Redoslijed (0 = prvo, veći broj = niže)</label>
                  <input
                    type="number"
                    value={faqForm.order_index}
                    onChange={(e) => setFaqForm({ ...faqForm, order_index: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <button type="submit" className="submit-button">
                  {editingFAQ ? 'Spremi promjene' : 'Dodaj FAQ'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </Section>
    </AdminLayout>
  )
}

