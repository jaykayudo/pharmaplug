import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { message as dialogMessage } from 'antd'
import Path from '../navigations/constants.js'
const errors = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Access Forbidden',
  404: 'Not Found',
  500: 'Internal server erro',
}

export const formatErrorData = (data) => {
  const keys = Object.keys(data)
  let message = ''
  for (const key of keys) {
    const current = data[key]
    if (key !== 'detail') {
      message += key
      message += '==>'
    }
    if (typeof current === 'string') {
      message += current
      message += '\n  '
    } else if (Array.isArray(current)) {
      message += current.join('\n  ')
    } else if (typeof current === 'object') {
      message += formatErrorData(current)
    }
  }
  return message
}

export const formatErrorTitle = (status) => {
  let title
  if (Object.keys(errors).includes(`${status}`)) {
    title = `${status} - ${errors[status]}`
  } else {
    title = 'Unknown Error'
  }
  return title
}

export const useErrorHandler = () => {
  let title = ''
  let message = ''
  const handleError = (error) => {
    const status = error.status

    const headerCheck =
      error.response?.headers['content-type']?.includes('json')
    const data = error.response?.data ?? { detail: 'Unknown Error' }
    message = formatErrorData(
      headerCheck ? data : { detail: `${errors[status] ?? 'Unknown Error'}` },
    )
    title = formatErrorTitle(status)

    dialogMessage.error({
      content: `${title} - ${message}`,
      duration: 5,
      key: 'updatable',
    })
    if (status == 401) {
    }

    return { title, message }
  }
  return handleError
}
