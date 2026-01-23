// import { PostFormValues } from "@/features/post/components/postForm"

import { PostFormValues } from "../components/postForm"

const API_URL = import.meta.env.VITE_API_URL

function getToken() {
  return localStorage.getItem("token")
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || "Error en la API")
  }

  return res.json()
}

export function createPost(data: PostFormValues): Promise<void> {
  return request<void>("/posts", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updatePost(
  id: string,
  data: PostFormValues
) {
  return request<void>(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export function publishPost(id: string) {
  return request<void>(`/posts/${id}/publish`, {
    method: "POST",
  })
}

export function deletePost(id: string) {
  return request<void>(`/posts/${id}`, {
    method: "DELETE",
  })
}

export interface PostResponse {
  id: string
  title: string
  content: string
  status: string
  createdAt: string
}

export function getPosts() {
  return request<PostResponse[]>("/posts")
}

