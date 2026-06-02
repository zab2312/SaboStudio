import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, X, Save, ChevronDown, ChevronUp } from 'lucide-react'
import {
  fetchPackagesContent,
  savePackagesPageSettings,
  upsertPackageSubsection,
  deletePackageSubsection,
  upsertServicePackage,
  deleteServicePackage,
  featuresToText,
  textToFeatures,
} from '../../lib/packagesApi'

const emptySettings = {
  page_title: '',
  page_description: '',
  combo_title: '',
  combo_description: '',
  combo_button_text: '',
  combo_package_key: 'web-social',
  combo_booking_label: '',
  combo_enabled: true,
  footer_note: '',
}

const emptySubsectionForm = {
  title: '',
  description: '',
  sort_order: 0,
  is_published: true,
}

const emptyPackageForm = {
  package_key: '',
  section_id: '',
  name: '',
  description: '',
  featuresText: '',
  price: '',
  is_popular: false,
  sort_order: 0,
  is_published: true,
  show_in_booking: true,
}

export default function AdminPackagesPanel() {
  const [loading, setLoading] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settings, setSettings] = useState(emptySettings)
  const [sections, setSections] = useState([])
  const [expandedSections, setExpandedSections] = useState({})
  const [showSettings, setShowSettings] = useState(false)

  const [showSubsectionModal, setShowSubsectionModal] = useState(false)
  const [editingSubsection, setEditingSubsection] = useState(null)
  const [subsectionForm, setSubsectionForm] = useState(emptySubsectionForm)

  const [showPackageModal, setShowPackageModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [packageForm, setPackageForm] = useState(emptyPackageForm)
  const [activeSectionId, setActiveSectionId] = useState(null)

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const { settings: pageSettings, sections: loadedSections } = await fetchPackagesContent()
      setSettings(pageSettings || emptySettings)
      setSections(loadedSections)
      setExpandedSections(
        Object.fromEntries((loadedSections || []).map((s) => [s.id, true]))
      )
    } catch (error) {
      console.error(error)
      alert(
        'Greška pri učitavanju. Pokreni supabase-packages.sql ili supabase-packages-migrate-subsections.sql u Supabaseu.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setSavingSettings(true)
    try {
      await savePackagesPageSettings(settings)
      alert('Glavni tekstovi sekcije su spremljeni.')
    } catch (error) {
      alert('Greška: ' + error.message)
    } finally {
      setSavingSettings(false)
    }
  }

  const openNewSubsection = () => {
    setEditingSubsection(null)
    setSubsectionForm({
      ...emptySubsectionForm,
      sort_order: sections.length + 1,
    })
    setShowSubsectionModal(true)
  }

  const openEditSubsection = (section) => {
    setEditingSubsection(section)
    setSubsectionForm({
      title: section.title,
      description: section.description || '',
      sort_order: section.sort_order,
      is_published: section.is_published,
    })
    setShowSubsectionModal(true)
  }

  const handleSubsectionSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        title: subsectionForm.title.trim(),
        description: subsectionForm.description.trim(),
        sort_order: Number(subsectionForm.sort_order) || 0,
        is_published: subsectionForm.is_published,
      }
      if (editingSubsection) payload.id = editingSubsection.id

      await upsertPackageSubsection(payload)
      await loadAll()
      setShowSubsectionModal(false)
    } catch (error) {
      alert('Greška: ' + error.message)
    }
  }

  const handleDeleteSubsection = async (section) => {
    if (
      !confirm(
        `Obrisati podsekciju "${section.title}" i sve pakete unutar nje? Ova radnja se ne može poništiti.`
      )
    ) {
      return
    }
    try {
      await deletePackageSubsection(section.id)
      await loadAll()
    } catch (error) {
      alert('Greška: ' + error.message)
    }
  }

  const openNewPackage = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId)
    setActiveSectionId(sectionId)
    setEditingPackage(null)
    setPackageForm({
      ...emptyPackageForm,
      section_id: sectionId,
      sort_order: (section?.packages?.length || 0) + 1,
    })
    setShowPackageModal(true)
  }

  const openEditPackage = (pkg) => {
    setActiveSectionId(pkg.section_id)
    setEditingPackage(pkg)
    setPackageForm({
      package_key: pkg.package_key,
      section_id: pkg.section_id,
      name: pkg.name,
      description: pkg.description,
      featuresText: featuresToText(pkg.features),
      price: pkg.price,
      is_popular: pkg.is_popular,
      sort_order: pkg.sort_order,
      is_published: pkg.is_published,
      show_in_booking: pkg.show_in_booking,
    })
    setShowPackageModal(true)
  }

  const handlePackageSubmit = async (e) => {
    e.preventDefault()
    const packageKey = packageForm.package_key.trim().toLowerCase().replace(/\s+/g, '-')
    if (!/^[a-z0-9-]+$/.test(packageKey)) {
      alert('Ključ paketa: samo mala slova, brojevi i crtice.')
      return
    }
    if (!packageForm.section_id) {
      alert('Odaberi podsekciju.')
      return
    }

    try {
      const payload = {
        package_key: packageKey,
        section_id: packageForm.section_id,
        name: packageForm.name.trim(),
        description: packageForm.description.trim(),
        features: textToFeatures(packageForm.featuresText),
        price: packageForm.price.trim(),
        is_popular: packageForm.is_popular,
        sort_order: Number(packageForm.sort_order) || 0,
        is_published: packageForm.is_published,
        show_in_booking: packageForm.show_in_booking,
      }
      if (editingPackage) payload.id = editingPackage.id

      await upsertServicePackage(payload)
      await loadAll()
      setShowPackageModal(false)
      setEditingPackage(null)
      setPackageForm(emptyPackageForm)
    } catch (error) {
      alert('Greška: ' + error.message)
    }
  }

  const handleDeletePackage = async (id) => {
    if (!confirm('Obrisati ovaj paket?')) return
    try {
      await deleteServicePackage(id)
      await loadAll()
    } catch (error) {
      alert('Greška: ' + error.message)
    }
  }

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) {
    return <div className="admin-loading">Učitavanje paketa...</div>
  }

  return (
    <div className="admin-packages-panel">
      <div className="admin-packages-toolbar">
        <button type="button" className="add-button" onClick={openNewSubsection}>
          <Plus size={20} />
          Dodaj novu podsekciju
        </button>
        <button
          type="button"
          className="admin-packages-settings-toggle"
          onClick={() => setShowSettings((v) => !v)}
        >
          {showSettings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          Postavke glavne sekcije
        </button>
      </div>

      {showSettings && (
        <form className="admin-packages-settings" onSubmit={handleSaveSettings}>
          <p className="admin-packages-hint">
            Naslov i opis cijele sekcije „Paketi usluga”, kombinirana ponuda i napomena na dnu.
          </p>
          <div className="admin-packages-settings-grid">
            <div className="form-group">
              <label>Glavni naslov sekcije</label>
              <input
                type="text"
                value={settings.page_title}
                onChange={(e) => setSettings({ ...settings, page_title: e.target.value })}
                required
              />
            </div>
            <div className="form-group admin-packages-full">
              <label>Podnaslov ispod glavnog naslova</label>
              <textarea
                value={settings.page_description}
                onChange={(e) => setSettings({ ...settings, page_description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Kombinirana ponuda — naslov</label>
              <input
                type="text"
                value={settings.combo_title}
                onChange={(e) => setSettings({ ...settings, combo_title: e.target.value })}
              />
            </div>
            <div className="form-group admin-packages-full">
              <label>Kombinirana ponuda — tekst</label>
              <textarea
                value={settings.combo_description}
                onChange={(e) => setSettings({ ...settings, combo_description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Tekst gumba</label>
              <input
                type="text"
                value={settings.combo_button_text}
                onChange={(e) => setSettings({ ...settings, combo_button_text: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Ključ u rezervaciji</label>
              <input
                type="text"
                value={settings.combo_package_key}
                onChange={(e) => setSettings({ ...settings, combo_package_key: e.target.value })}
              />
            </div>
            <div className="form-group admin-packages-full">
              <label>Napomena na dnu</label>
              <textarea
                value={settings.footer_note}
                onChange={(e) => setSettings({ ...settings, footer_note: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <button type="submit" className="submit-button" disabled={savingSettings}>
            <Save size={18} />
            {savingSettings ? 'Spremanje...' : 'Spremi glavne postavke'}
          </button>
        </form>
      )}

      {sections.length === 0 ? (
        <div className="admin-empty admin-packages-empty">
          Nema podsekcija. Klikni „Dodaj novu podsekciju” da kreneš.
        </div>
      ) : (
        <div className="admin-subsections-list">
          {sections.map((section) => (
            <div key={section.id} className="admin-subsection-card">
              <div className="admin-subsection-header">
                <button
                  type="button"
                  className="admin-subsection-toggle"
                  onClick={() => toggleSection(section.id)}
                >
                  {expandedSections[section.id] ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                <div className="admin-subsection-titles">
                  <h3>{section.title}</h3>
                  {section.description && <p>{section.description}</p>}
                  <span className="admin-package-meta">
                    Redoslijed: {section.sort_order}
                    {!section.is_published && ' · Skriveno'}
                    {' · '}
                    {section.packages?.length || 0} paketa
                  </span>
                </div>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => openEditSubsection(section)} title="Uredi podsekciju">
                    <Edit size={18} />
                  </button>
                  <button type="button" onClick={() => handleDeleteSubsection(section)} title="Obriši podsekciju">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {expandedSections[section.id] && (
                <div className="admin-subsection-body">
                  <button
                    type="button"
                    className="add-button add-button-small"
                    onClick={() => openNewPackage(section.id)}
                  >
                    <Plus size={18} />
                    Dodaj paket u ovu podsekciju
                  </button>

                  {section.packages?.length === 0 ? (
                    <p className="admin-packages-empty-inline">Još nema paketa u ovoj podsekciji.</p>
                  ) : (
                    <div className="admin-list admin-list-nested">
                      {section.packages.map((pkg) => (
                        <div key={pkg.id} className="admin-item">
                          <div className="admin-item-content">
                            <h4>{pkg.name}</h4>
                            <p>{pkg.price}</p>
                            <span className="admin-package-meta">{pkg.package_key}</span>
                          </div>
                          <div className="admin-item-actions">
                            <button type="button" onClick={() => openEditPackage(pkg)}>
                              <Edit size={18} />
                            </button>
                            <button type="button" onClick={() => handleDeletePackage(pkg.id)}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showSubsectionModal && (
        <div className="modal-overlay" onClick={() => setShowSubsectionModal(false)}>
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button type="button" className="modal-close" onClick={() => setShowSubsectionModal(false)}>
              <X size={24} />
            </button>
            <h2>{editingSubsection ? 'Uredi podsekciju' : 'Nova podsekcija'}</h2>
            <form onSubmit={handleSubsectionSubmit}>
              <div className="form-group">
                <label>Naslov podsekcije *</label>
                <input
                  type="text"
                  value={subsectionForm.title}
                  onChange={(e) => setSubsectionForm({ ...subsectionForm, title: e.target.value })}
                  placeholder="npr. Web paketi"
                  required
                />
              </div>
              <div className="form-group">
                <label>Podnaslov / opis (opcionalno)</label>
                <textarea
                  value={subsectionForm.description}
                  onChange={(e) => setSubsectionForm({ ...subsectionForm, description: e.target.value })}
                  rows={3}
                  placeholder="Kratki opis ispod naslova podsekcije"
                />
              </div>
              <div className="form-group">
                <label>Redoslijed</label>
                <input
                  type="number"
                  min="0"
                  value={subsectionForm.sort_order}
                  onChange={(e) =>
                    setSubsectionForm({
                      ...subsectionForm,
                      sort_order: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
              <div className="form-group admin-packages-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={subsectionForm.is_published}
                    onChange={(e) =>
                      setSubsectionForm({ ...subsectionForm, is_published: e.target.checked })
                    }
                  />
                  Prikaži na stranici
                </label>
              </div>
              <button type="submit" className="submit-button">
                {editingSubsection ? 'Spremi podsekciju' : 'Dodaj podsekciju'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {showPackageModal && (
        <div className="modal-overlay" onClick={() => setShowPackageModal(false)}>
          <motion.div
            className="modal-content modal-content-wide"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button type="button" className="modal-close" onClick={() => setShowPackageModal(false)}>
              <X size={24} />
            </button>
            <h2>{editingPackage ? 'Uredi paket' : 'Novi paket'}</h2>
            <form onSubmit={handlePackageSubmit}>
              <div className="form-group">
                <label>Podsekcija *</label>
                <select
                  value={packageForm.section_id}
                  onChange={(e) => setPackageForm({ ...packageForm, section_id: e.target.value })}
                  required
                >
                  <option value="">Odaberi podsekciju</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Ključ paketa *</label>
                <input
                  type="text"
                  value={packageForm.package_key}
                  onChange={(e) => setPackageForm({ ...packageForm, package_key: e.target.value })}
                  required
                  disabled={!!editingPackage}
                  placeholder="npr. start-social"
                />
              </div>
              <div className="form-group">
                <label>Naziv paketa *</label>
                <input
                  type="text"
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Opis paketa *</label>
                <textarea
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stavke (jedna po retku)</label>
                <textarea
                  value={packageForm.featuresText}
                  onChange={(e) => setPackageForm({ ...packageForm, featuresText: e.target.value })}
                  rows={8}
                />
              </div>
              <div className="form-group">
                <label>Cijena *</label>
                <input
                  type="text"
                  value={packageForm.price}
                  onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Redoslijed u podsekciji</label>
                <input
                  type="number"
                  min="0"
                  value={packageForm.sort_order}
                  onChange={(e) =>
                    setPackageForm({ ...packageForm, sort_order: parseInt(e.target.value, 10) || 0 })
                  }
                />
              </div>
              <div className="form-group admin-packages-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={packageForm.is_popular}
                    onChange={(e) => setPackageForm({ ...packageForm, is_popular: e.target.checked })}
                  />
                  Najčešći izbor
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={packageForm.is_published}
                    onChange={(e) => setPackageForm({ ...packageForm, is_published: e.target.checked })}
                  />
                  Prikaži na stranici
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={packageForm.show_in_booking}
                    onChange={(e) =>
                      setPackageForm({ ...packageForm, show_in_booking: e.target.checked })
                    }
                  />
                  U formi rezervacije
                </label>
              </div>
              <button type="submit" className="submit-button">
                {editingPackage ? 'Spremi paket' : 'Dodaj paket'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
