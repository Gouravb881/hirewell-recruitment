const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const JOB_ID_KEY = "hirewell_backend_job_id";

export const getActiveJobId = () => Number(localStorage.getItem(JOB_ID_KEY) || 0);
export const setActiveJobId = (id) => localStorage.setItem(JOB_ID_KEY, String(id));

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    // Re-throw so callers can catch it, but now it's a caught error
    throw err;
  }
}

export async function createJob(payload) {
  const job = await request("/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  setActiveJobId(job.id);
  return job;
}

export async function uploadCandidate(jobId, file) {
  const formData = new FormData();
  formData.append("job_id", String(jobId));
  formData.append("file", file);
  return request("/candidates", { method: "POST", body: formData });
}

export async function listCandidates(jobId) {
  return request(`/candidates?job_id=${jobId}`);
}

export async function runBatchMatch(jobId) {
  return request(`/match/batch/${jobId}`, { method: "POST" });
}

export async function listMatches(jobId) {
  return request(`/matches?job_id=${jobId}`);
}
