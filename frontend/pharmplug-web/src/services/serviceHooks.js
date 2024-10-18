import axios from 'axios'
import { useCallback, useState } from 'react'
import { useErrorHandler } from './serviceUtils.js'

export const usePostAPI = (
  url,
  loader,
  onSuccessCallback,
  onErrorCallback = undefined,
) => {
  const errorHandler = useErrorHandler()
  const [loading, setLoading] = useState(false)
  const defaultLoader = loader ?? setLoading
  const sendRequest = useCallback((data) => {
    defaultLoader(true)
    axios
      .post(url, data)
      .then((req) => {
        onSuccessCallback(req.data)
      })
      .catch((err) => {
        console.log(err)
        errorHandler(err)
        if (onErrorCallback) onErrorCallback(err)
      })
      .finally(() => {
        defaultLoader(false)
      })
  }, [])
  return { sendRequest, loading }
}

export const useGetAPI = (
  url,
  loader,
  onSuccessCallback,
  onErrorCallback = undefined,
) => {
  const errorHandler = useErrorHandler()
  const [loading, setLoading] = useState(false)
  const defaultLoader = loader ?? setLoading
  const sendRequest = (data = undefined, page = undefined) => {
    defaultLoader(true)
    axios
      .get(`${url}${page ? '?page=' + page : ''}`, { params: data })
      .then((req) => {
        onSuccessCallback(req.data)
      })
      .catch((err) => {
        errorHandler(err)
        if (onErrorCallback) onErrorCallback(err)
      })
      .finally(() => {
        defaultLoader(false)
      })
  }
  return { sendRequest, loading }
}
