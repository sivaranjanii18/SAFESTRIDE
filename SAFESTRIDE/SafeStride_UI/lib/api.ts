const API_BASE = "http://localhost:8000/api"

export async function apiCall(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    })
    return response.json()
}

// Auth
export const authAPI = {
    signup: (data: { name: string; email: string; phone: string; password: string }) =>
        apiCall("/signup", { method: "POST", body: JSON.stringify(data) }),

    login: (data: { email: string; password: string }) =>
        apiCall("/login", { method: "POST", body: JSON.stringify(data) }),
}

// Devices
export const deviceAPI = {
    register: (userId: number, data: { device_name: string; mac_address: string }) =>
        apiCall(`/devices/${userId}`, { method: "POST", body: JSON.stringify(data) }),

    getAll: (userId: number) => apiCall(`/devices/${userId}`),

    sync: (deviceId: number, data: { battery_level?: number; is_connected?: boolean }) =>
        apiCall(`/devices/${deviceId}/sync`, { method: "PUT", body: JSON.stringify(data) }),
}

// Emergency Contacts
export const contactAPI = {
    add: (userId: number, data: { name: string; phone: string; email?: string; priority_order?: number }) =>
        apiCall(`/contacts/${userId}`, { method: "POST", body: JSON.stringify(data) }),

    getAll: (userId: number) => apiCall(`/contacts/${userId}`),

    delete: (contactId: number) => apiCall(`/contacts/${contactId}`, { method: "DELETE" }),
}

// SOS
export const sosAPI = {
    trigger: (userId: number, deviceId: number, alertType: string, lat: number, lng: number) =>
        apiCall(`/sos/${userId}?device_id=${deviceId}&alert_type=${alertType}&latitude=${lat}&longitude=${lng}`, { method: "POST" }),

    cancel: (alertId: number) => apiCall(`/sos/${alertId}/cancel`, { method: "PUT" }),

    resolve: (alertId: number) => apiCall(`/sos/${alertId}/resolve`, { method: "PUT" }),

    history: (userId: number) => apiCall(`/sos/${userId}/history`),
}

// Search & Heatmap
export const searchAPI = {
    search: (query: string) => apiCall(`/search?query=${encodeURIComponent(query)}`),

    heatmap: () => apiCall("/heatmap"),

    riskCheck: (lat: number, lng: number) => apiCall(`/risk-check?latitude=${lat}&longitude=${lng}`),
}

// AI
export const aiAPI = {
    predictRisk: (lat: number, lng: number, time: string, reportText: string) =>
        apiCall(`/ai/predict-risk?latitude=${lat}&longitude=${lng}&time=${encodeURIComponent(time)}&report_text=${encodeURIComponent(reportText)}`, { method: "POST" }),

    areaSafety: (lat: number, lng: number) =>
        apiCall(`/ai/area-safety?latitude=${lat}&longitude=${lng}`),
}

// Location
export const locationAPI = {
    update: (userId: number, lat: number, lng: number) =>
        apiCall(`/location/${userId}?latitude=${lat}&longitude=${lng}`, { method: "POST" }),

    getLive: (userId: number) => apiCall(`/location/${userId}/live`),

    getTrail: (userId: number) => apiCall(`/location/${userId}/trail`),
}

// Reports
export const reportAPI = {
    summary: (userId: number) => apiCall(`/reports/${userId}/summary`),

    locations: (userId: number) => apiCall(`/reports/${userId}/locations`),
}

// Community
export const communityAPI = {
    report: (userId: number, location: string, lat: number, lng: number, reportText: string, riskLevel: number) =>
        apiCall(`/community/report?user_id=${userId}&location=${encodeURIComponent(location)}&latitude=${lat}&longitude=${lng}&report_text=${encodeURIComponent(reportText)}&risk_level=${riskLevel}`, { method: "POST" }),

    recent: () => apiCall("/community/recent"),

    hotspots: () => apiCall("/community/hotspots"),
}

// Analytics
export const analyticsAPI = {
    timeRisk: (location: string) => apiCall(`/analytics/time-risk?location=${encodeURIComponent(location)}`),
}