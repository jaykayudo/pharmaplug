import axios, { AxiosResponse } from 'axios'
import React, { useCallback, useState } from 'react'
import { useErrorHandler } from './serviceUtils'

type APIType = (
  url: string,
  loader: CallableFunction | null,
  onSuccessCallback: CallableFunction,
  onErrorCallback?: CallableFunction,
) => {
  sendRequest: CallableFunction
  loading: boolean
}

export const usePostAPI: APIType = (
  url,
  loader,
  onSuccessCallback,
  onErrorCallback = undefined,
) => {
  const errorHandler = useErrorHandler()
  const [loading, setLoading] = useState(false)
  const defaultLoader = loader ?? setLoading
  const sendRequest = useCallback((data: AxiosResponse) => {
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

export const useGetAPI: APIType = (
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
