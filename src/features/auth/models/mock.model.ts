export interface User {
  id: number
  name: string
  username: string
  createdAt: string
}

export interface Post {
  id: number
  title: string
  content: string
  userId: number
  createdAt: string
}

export interface CreateUserRequest {
  name: string
  username: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  name: string
  username: string
  password: string
}

export interface User {
  id: number
  name: string
  username: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken: string
}