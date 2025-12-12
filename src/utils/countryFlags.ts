import lookup from 'country-code-lookup'

// Fallback map for IOC codes that might not match standard ISO3 or are missing in the library
const IOC_MAPPING: Record<string, string> = {
  'GER': 'DE', // Germany
  'RSA': 'ZA', // South Africa
  'NED': 'NL', // Netherlands
  'SUI': 'CH', // Switzerland
  'PUR': 'PR', // Puerto Rico
  'GRN': 'GD', // Grenada
  'BAH': 'BS', // Bahamas
  'TPE': 'TW', // Chinese Taipei
  'SKN': 'KN', // St. Kitts and Nevis
  'VIN': 'VC', // St. Vincent
  'ANT': 'AG', // Antigua
  'IVB': 'VG', // British Virgin Islands
  'ISV': 'VI', // US Virgin Islands
  'CAY': 'KY', // Cayman Islands
  'BER': 'BM', // Bermuda
  'MAS': 'MY', // Malaysia
  'NGR': 'NG', // Nigeria
  'POR': 'PT', // Portugal
  'LAT': 'LV', // Latvia
  'LTU': 'LT', // Lithuania
  'EST': 'EE', // Estonia
  'SVK': 'SK', // Slovakia
  'CZE': 'CZ', // Czechia
  'SLO': 'SI', // Slovenia
  'CRO': 'HR', // Croatia
  'SRB': 'RS', // Serbia
  'BIH': 'BA', // Bosnia
  'MKD': 'MK', // North Macedonia
  'MNE': 'ME', // Montenegro
  'KOS': 'XK', // Kosovo
  'DEN': 'DK', // Denmark
  'BUL': 'BG', // Bulgaria
  'ROU': 'RO', // Romania
  'GRE': 'GR', // Greece
  'UKR': 'UA', // Ukraine
  'BLR': 'BY', // Belarus
  'RUS': 'RU', // Russia
  'KAZ': 'KZ', // Kazakhstan
  'UZB': 'UZ', // Uzbekistan
  'TJK': 'TJ', // Tajikistan
  'KGZ': 'KG', // Kyrgyzstan
  'TKM': 'TM', // Turkmenistan
  'MGL': 'MN', // Mongolia
  'IRI': 'IR', // Iran
  'IRQ': 'IQ', // Iraq
  'KUW': 'KW', // Kuwait
  'KSA': 'SA', // Saudi Arabia
  'UAE': 'AE', // UAE
  'OMA': 'OM', // Oman
  'YEM': 'YE', // Yemen
  'JOR': 'JO', // Jordan
  'LBN': 'LB', // Lebanon
  'SYR': 'SY', // Syria
  'ISR': 'IL', // Israel
  'PLE': 'PS', // Palestine
  'EGY': 'EG', // Egypt
  'LBA': 'LY', // Libya
  'TUN': 'TN', // Tunisia
  'ALG': 'DZ', // Algeria
  'MAR': 'MA', // Morocco
  'SUD': 'SD', // Sudan
  'ETH': 'ET', // Ethiopia
  'ERI': 'ER', // Eritrea
  'DJI': 'DJ', // Djibouti
  'SOM': 'SO', // Somalia
  'KEN': 'KE', // Kenya
  'UGA': 'UG', // Uganda
  'TAN': 'TZ', // Tanzania
  'RWA': 'RW', // Rwanda
  'BDI': 'BI', // Burundi
  'SEY': 'SC', // Seychelles
  'MRI': 'MU', // Mauritius
  'MAD': 'MG', // Madagascar
  'MOZ': 'MZ', // Mozambique
  'ZAM': 'ZM', // Zambia
  'ZIM': 'ZW', // Zimbabwe
  'MAW': 'MW', // Malawi
  'BOT': 'BW', // Botswana
  'NAM': 'NA', // Namibia
  'LES': 'LS', // Lesotho
  'SWZ': 'SZ', // Eswatini
  'ANG': 'AO', // Angola
  'COD': 'CD', // DR Congo
  'CGO': 'CG', // Congo
  'GAB': 'GA', // Gabon
  'GEQ': 'GQ', // Equatorial Guinea
  'CMR': 'CM', // Cameroon
  'CAF': 'CF', // Central African Republic
  'CHA': 'TD', // Chad
  'NIG': 'NE', // Niger
  'BEN': 'BJ', // Benin
  'TOG': 'TG', // Togo
  'GHA': 'GH', // Ghana
  'CIV': 'CI', // Cote d'Ivoire
  'LBR': 'LR', // Liberia
  'SLE': 'SL', // Sierra Leone
  'GUI': 'GN', // Guinea
  'GBS': 'GW', // Guinea-Bissau
  'GAM': 'GM', // Gambia
  'SEN': 'SN', // Senegal
  'CPV': 'CV', // Cape Verde
  'MLI': 'ML', // Mali
  'BUR': 'BF', // Burkina Faso
  'MTN': 'MR', // Mauritania
  'ASA': 'AS', // American Samoa
  'SAM': 'WS', // Samoa
  'TGA': 'TO', // Tonga
  'FIJ': 'FJ', // Fiji
  'VAN': 'VU', // Vanuatu
  'SOL': 'SB', // Solomon Islands
  'PNG': 'PG', // Papua New Guinea
  'GUM': 'GU', // Guam
  'FSM': 'FM', // Micronesia
  'MHL': 'MH', // Marshall Islands
  'PLW': 'PW', // Palau
  'NRU': 'NR', // Nauru
  'KIR': 'KI', // Kiribati
  'TUV': 'TV', // Tuvalu
  'NZL': 'NZ', // New Zealand
  'INA': 'ID', // Indonesia
  'PHI': 'PH', // Philippines
  'VIE': 'VN', // Vietnam
  'LAO': 'LA', // Laos
  'CAM': 'KH', // Cambodia
  'THA': 'TH', // Thailand
  'MYA': 'MM', // Myanmar
  'BRU': 'BN', // Brunei
  'SIN': 'SG', // Singapore
  'TLS': 'TL', // Timor-Leste
  'NEP': 'NP', // Nepal
  'BHU': 'BT', // Bhutan
  'BAN': 'BD', // Bangladesh
  'SRI': 'LK', // Sri Lanka
  'MDV': 'MV', // Maldives
  'PAK': 'PK', // Pakistan
  'AFG': 'AF', // Afghanistan
  'PRK': 'KP', // North Korea
  'KOR': 'KR', // South Korea
  'JPN': 'JP', // Japan
  'CHN': 'CN', // China
  'HKG': 'HK', // Hong Kong
  'MAC': 'MO', // Macau
}

/**
 * Get the ISO2 country code from a 3-letter code (IOC/ISO3)
 * @param code 3-letter country code
 * @returns 2-letter ISO code or null if not found
 */
export function getIsoCode(code: string): string | null {
  if (!code || code.length < 2) return null
  
  // Already 2 letters?
  if (code.length === 2) return code.toUpperCase()
  
  // Check manual IOC mapping first (common in athletics)
  if (IOC_MAPPING[code.toUpperCase()]) {
    return IOC_MAPPING[code.toUpperCase()]
  }
  
  // Try lookup by ISO3
  const byIso = lookup.byIso(code)
  if (byIso) return byIso.iso2
  
  // Try lookup by country name (fuzzy)
  const byName = lookup.byCountry(code)
  if (byName?.iso2) return byName.iso2
  
  return null
}

/**
 * Get the CDN URL for a country flag
 * @param code 3-letter country code
 * @returns URL to the SVG flag
 */
export function getCountryFlagUrl(code: string): string {
  const isoCode = getIsoCode(code)
  
  if (!isoCode) {
    // Return a generic world icon or empty string
    // Using 'xx' or similar often returns a placeholder in some sets, 
    // but for circle-flags we might want a specific fallback.
    // Let's return a default "un" (United Nations) flag if available, or just a placeholder.
    return 'https://hatscripts.github.io/circle-flags/flags/xx.svg'
  }
  
  return `https://hatscripts.github.io/circle-flags/flags/${isoCode.toLowerCase()}.svg`
}
