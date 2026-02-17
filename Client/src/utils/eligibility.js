export function isEligible(scheme, farmer) {
  if (!farmer) return false

  // state match
  if (scheme.state && scheme.state !== farmer.state)
    return false

  // land requirement
  if (
    scheme.min_land_acres !== null &&
    farmer.landSizeAcres !== null &&
    farmer.landSizeAcres < scheme.min_land_acres
  )
    return false

  // crop match
  if (
    scheme.supported_crops.length &&
    farmer.crops.length &&
    !scheme.supported_crops.some((c) =>
      farmer.crops.includes(c)
    )
  )
    return false

  return true
}
