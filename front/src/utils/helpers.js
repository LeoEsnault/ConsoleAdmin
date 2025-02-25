export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@_]+(\.[^\s@_]+)+$/
  return emailRegex.test(email)
}

export const checkEmail = (email, $q) => {
  if (!isValidEmail(email.trim())) {
    $q.notify({
      message: "L'adresse mail n'est pas valide",
      type: 'negative',
      position: 'top',
    })
    return false
  }
  return true
}
