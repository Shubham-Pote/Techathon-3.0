export function isEligible(scheme, farmer) {
  if (!farmer) return false

  // state match
  if (scheme.state && scheme.state !== farmer.state)
    return false

  // land requirement
  if (
    scheme.min_land_acres !== null &&
    farmer.land_acres < scheme.min_land_acres
  )
    return false

  // crop match
  if (
    scheme.supported_crops.length &&
    !scheme.supported_crops.some((c) =>
      farmer.crops.includes(c)
    )
  )
    return false

  // required documents/conditions
  if (!farmer.land_owner) return false
  if (!farmer.has_aadhaar) return false
  if (!farmer.has_bank_account) return false

  return true
}
