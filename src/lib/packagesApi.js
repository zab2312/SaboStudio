import { supabase } from './supabase'

const SETTINGS_ID = 'a0000000-0000-0000-0000-000000000001'

export async function fetchPackagesPageSettings() {
  const { data, error } = await supabase
    .from('packages_page_settings')
    .select('*')
    .eq('id', SETTINGS_ID)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function fetchPackageSubsections({ publishedOnly = false } = {}) {
  let query = supabase.from('package_subsections').select('*').order('sort_order', { ascending: true })

  if (publishedOnly) query = query.eq('is_published', true)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function fetchServicePackages({ publishedOnly = false, bookingOnly = false } = {}) {
  let query = supabase.from('service_packages').select('*').order('sort_order', { ascending: true })

  if (publishedOnly) query = query.eq('is_published', true)
  if (bookingOnly) query = query.eq('show_in_booking', true)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function fetchPackagesContent({ publishedOnly = false, bookingOnly = false } = {}) {
  const [settings, subsections, packages] = await Promise.all([
    fetchPackagesPageSettings(),
    fetchPackageSubsections({ publishedOnly }),
    fetchServicePackages({ publishedOnly, bookingOnly }),
  ])

  const sections = subsections.map((subsection) => ({
    ...subsection,
    packages: packages
      .filter((pkg) => pkg.section_id === subsection.id)
      .sort((a, b) => a.sort_order - b.sort_order),
  }))

  return { settings, sections, packages }
}

export function mapDbPackageToCard(pkg) {
  return {
    id: pkg.id,
    key: pkg.package_key,
    name: pkg.name,
    description: pkg.description,
    features: pkg.features || [],
    price: pkg.price,
    isPopular: pkg.is_popular,
    sectionId: pkg.section_id,
  }
}

export function buildPackageGroups(sections, settings) {
  const groups = (sections || [])
    .filter((section) => section.packages?.length > 0)
    .map((section) => ({
      label: section.title,
      options: section.packages.map((p) => ({
        value: p.package_key,
        label: p.name,
      })),
    }))

  if (settings?.combo_enabled && settings.combo_package_key) {
    groups.push({
      label: 'Kombinirano',
      options: [
        {
          value: settings.combo_package_key,
          label: settings.combo_booking_label || settings.combo_title,
          featured: true,
        },
      ],
    })
  }

  return groups
}

export function buildPackageMap(sections, settings) {
  const allPackages = (sections || []).flatMap((s) => s.packages || [])
  const map = Object.fromEntries(allPackages.map((p) => [p.package_key, p.name]))

  if (settings?.combo_enabled && settings.combo_package_key) {
    map[settings.combo_package_key] =
      settings.combo_booking_label || settings.combo_title || settings.combo_package_key
  }

  return map
}

export function getPackageLabel(packageMap, value) {
  return packageMap[value] || value
}

export function featuresToText(features) {
  return (features || []).join('\n')
}

export function textToFeatures(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export async function savePackagesPageSettings(settings) {
  const { web_section_title, social_section_title, social_section_description, ...rest } = settings
  const { error } = await supabase.from('packages_page_settings').upsert({
    id: SETTINGS_ID,
    ...rest,
    updated_at: new Date().toISOString(),
  })

  if (error) throw error
}

export async function upsertPackageSubsection(subsection) {
  const { error } = await supabase.from('package_subsections').upsert({
    ...subsection,
    updated_at: new Date().toISOString(),
  })

  if (error) throw error
}

export async function deletePackageSubsection(id) {
  const { error } = await supabase.from('package_subsections').delete().eq('id', id)
  if (error) throw error
}

export async function upsertServicePackage(packageData) {
  const { section_type, ...rest } = packageData
  const { error } = await supabase.from('service_packages').upsert(
    {
      ...rest,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'package_key' }
  )

  if (error) throw error
}

export async function deleteServicePackage(id) {
  const { error } = await supabase.from('service_packages').delete().eq('id', id)
  if (error) throw error
}
