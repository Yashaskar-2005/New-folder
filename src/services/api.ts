import { 
  TransformRequest, 
  TransformResponse, 
  FileUploadResponse, 
  JobListItem, 
  AnalyticsSummary,
  StructuredOutputItem
} from '../types';

const API_BASE = '/api';

export async function transformContent(req: TransformRequest): Promise<TransformResponse> {
  const response = await fetch(`${API_BASE}/transform`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to transform content');
  }
  return response.json();
}

export async function regenerateFormat(fmt: string, req: TransformRequest): Promise<StructuredOutputItem> {
  const response = await fetch(`${API_BASE}/transform/single?fmt=${encodeURIComponent(fmt)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to regenerate ${fmt}`);
  }
  return response.json();
}

export async function uploadDocument(file: File): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to upload and parse document');
  }
  return response.json();
}

export async function fetchHistory(): Promise<JobListItem[]> {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) {
    throw new Error('Failed to fetch job history');
  }
  return response.json();
}

export async function fetchJobDetail(jobId: string): Promise<TransformResponse> {
  const response = await fetch(`${API_BASE}/history/${encodeURIComponent(jobId)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch job details');
  }
  return response.json();
}

export async function deleteJob(jobId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/history/${encodeURIComponent(jobId)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete job');
  }
}

export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  const response = await fetch(`${API_BASE}/analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return response.json();
}

export async function downloadExport(format: string, title: string, outputs: any[]): Promise<void> {
  const response = await fetch(`${API_BASE}/transform/export/${format}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_title: title, outputs }),
  });

  if (!response.ok) {
    throw new Error(`Failed to export in ${format} format`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  // Extract filename from header or fallback
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `${title.replace(/\s+/g, '_')}.${format === 'markdown' ? 'md' : format}`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) filename = match[1];
  }

  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
