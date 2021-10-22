import axios from "axios"

export const updatePage = (path, data, projectId) => {
    return axios
        .put(`${process.env.REACT_APP_API_URL}/${path}`, {
          projectId: projectId,
          ...data
        })
}

export const updateLastPage = (path, pageNumber, projectId) => {
  return axios
        .put(`${process.env.REACT_APP_API_URL}/${path}`, {
          projectId: projectId,
          last_page: pageNumber
        })
}

export const getLastPage = () => {
  return axios.get()
}