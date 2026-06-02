export const PACKAGE_GROUPS = [
  {
    label: 'Web paketi',
    options: [
      { value: 'start', label: 'START WEB' },
      { value: 'upiti', label: 'WEB KOJI DONOSI UPITE' },
      { value: 'custom', label: 'CUSTOM WEB' },
    ],
  },
  {
    label: 'Društvene mreže',
    options: [
      { value: 'start-social', label: 'START SOCIAL' },
      { value: 'growth-social', label: 'GROWTH SOCIAL' },
      { value: 'content-partner', label: 'CONTENT PARTNER' },
    ],
  },
  {
    label: 'Kombinirano',
    options: [{ value: 'web-social', label: 'Web + društvene mreže', featured: true }],
  },
]

export const packageMap = Object.fromEntries(
  PACKAGE_GROUPS.flatMap((group) => group.options.map((option) => [option.value, option.label]))
)

export function getPackageLabel(value) {
  return packageMap[value] || value
}
