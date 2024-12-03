export const validateName = (
  text: string,
  field_name = '',
  is_full_name = false,
) => {
  let errorText = ''
  let status = true
  if (text.length < 3) {
    status = false
    errorText = `${field_name} field length is too short`.trim()
    return { status, errorText }
  } else if (text.length > 100) {
    status = false
    errorText = `${field_name} field length is too long`.trim()
    return { status, errorText }
  } else if (!isNaN(text)) {
    status = false
    errorText = `${field_name} field should not be numeric`.trim()
    return { status, errorText }
  } else if (is_full_name && text.split(' ', 2).length !== 2) {
    status = false
    errorText =
      `${field_name} field should be firstname and lastname seperated with a blank`.trim()
    return { status, errorText }
  }
  return { status, errorText }
}

export const validateEmail = (text: string, field_name = 'email') => {
  let errorText = ''
  let status = true
  let re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  if (text.length < 3) {
    status = false
    errorText = `${field_name} field length is too short`.trim()
    return { status, errorText }
  } else if (!text.match(re)) {
    status = false
    errorText = `${field_name} field does not contain a valid email`.trim()
    return { status, errorText }
  }
  return { status, errorText }
}

export const validatePhoneNumber = (
  text: string,
  field_name = 'Phone number',
) => {
  let errorText = ''
  let status = true
  if (text.length !== 11) {
    status = false
    errorText =
      `${field_name} field should contain 11 numeric characters`.trim()
    return { status, errorText }
  } else if (isNaN(text)) {
    status = false
    errorText =
      `${field_name} field should contain 11 numeric characters`.trim()
    return { status, errorText }
  }
  return { status, errorText }
}

export const validatePassword = (text: string, field_name = '') => {
  let errorText = ''
  let status = true
  if (text.length < 8) {
    status = false
    errorText =
      `${field_name} field should contain more than 8 characters`.trim()
    return { status, errorText }
  }
  return { status, errorText }
}
