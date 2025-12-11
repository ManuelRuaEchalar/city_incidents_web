// User model
export interface User {
  user_id: number
  username: string
  email: string
  profile_pic_url?: string
  role: 'CITIZEN' | 'ADMIN'
  is_verified: boolean
  created_at: string
}

// Category model
export interface Category {
  category_id: number
  name: string
  description: string
  _count?: {
    incidents: number
  }
}

// City model
export interface City {
  city_id: number
  name: string
  code: string
  _count?: {
    incidents: number
  }
}

// Status model
export interface Status {
  status_id: number
  name: string
  description: string
  _count?: {
    incidents: number
  }
}

// Incident model (for lists)
export interface Incident {
  incident_id: number
  category_id: number
  status_id: number
  city_id?: number
  latitude: number
  longitude: number
  description: string
  photo_url?: string
  address_ref?: string
  created_at: string
  user?: {
    username: string
  }
  category?: Category
  status?: Status
  city?: City
}

// Incident detail model (with full relations)
export interface IncidentDetail extends Incident {
  category: Category
  status: Status
  city?: City
}

// City statistics response
export interface CityStats {
  category_id: number
  name: string
  description: string
  _count: {
    incidents: number
  }
}

// Auth response
export interface AuthResponse {
  access_token: string
}

// API error response
export interface ApiError {
  message: string
  statusCode: number
}

// Pagination (if needed in future)
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Create/Update DTOs
export interface CreateCityDto {
  name: string
  code?: string
}

export interface UpdateCityDto {
  name?: string
  code?: string
}

export interface CreateCategoryDto {
  name: string
  description?: string
}

export interface UpdateCategoryDto {
  name?: string
  description?: string
}

export interface CreateStatusDto {
  name: string
  description: string
}

export interface UpdateStatusDto {
  name?: string
  description?: string
}

export interface UpdateIncidentDto {
  category_id?: number
  status_id?: number
  city_id?: number
  latitude?: number
  longitude?: number
  description?: string
  photo_url?: string
  address_ref?: string
}

export interface UpdateIncidentStatusDto {
  status_id: number
}

export interface LoginDto {
  email: string
  password: string
}
