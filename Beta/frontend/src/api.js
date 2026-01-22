const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, '') || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchChallenges() {
  return request('/challenges/')
}

export async function registerUser(payload) {
  return request('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function loginUser(payload) {
  return request('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function startChallenge(challengeId, token) {
  return request(`/challenges/${challengeId}/start/`, {
    method: 'POST',
    headers: token ? { Authorization: `Token ${token}` } : {},
  })
}

export async function submitFlag(challengeId, submittedFlag, token) {
  return request(`/challenges/${challengeId}/submit/`, {
    method: 'POST',
    headers: token ? { Authorization: `Token ${token}` } : {},
    body: JSON.stringify({ submitted_flag: submittedFlag }),
  })
}
