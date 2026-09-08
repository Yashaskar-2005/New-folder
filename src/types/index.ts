export type OutputFormatType = 
  | 'linkedin' 
  | 'twitter' 
  | 'advisory' 
  | 'video_script' 
  | 'infographic' 
  | 'exec_summary' 
  | 'presentation';

export interface StructuredOutputItem {
  output_type: OutputFormatType;
  title: string;
  content_markdown: string;
  structured_data: Record<string, any>;
  word_count: number;
  tags?: string[];
}

export interface TransformResponse {
  job_id: string;
  status: string;
  source_title: string;
  source_word_count: number;
  duration_seconds: number;
  model_used: string;
  created_at: string;
  outputs: StructuredOutputItem[];
}

export interface TransformRequest {
  source_title?: string;
  source_text: string;
  source_type?: string;
  output_types: OutputFormatType[];
  tone?: string;
  target_audience?: string;
  language?: string;
  detail_level?: string;
  api_key_override?: string;
  model_choice?: string;
}

export interface FileUploadResponse {
  filename: string;
  file_type: string;
  char_count: number;
  word_count: number;
  extracted_text: string;
  preview_snippet: string;
}

export interface JobListItem {
  id: string;
  source_title: string;
  source_type: string;
  source_word_count: number;
  outputs_count: number;
  output_types: OutputFormatType[];
  tone: string;
  target_audience: string;
  language: string;
  duration_seconds: number;
  model_used: string;
  created_at: string;
}

export interface AnalyticsSummary {
  total_transformations: number;
  total_words_processed: number;
  total_deliverables_generated: number;
  avg_latency_seconds: number;
  format_distribution: Record<string, number>;
  audience_distribution: Record<string, number>;
  recent_activity: Array<{
    id: string;
    title: string;
    words: number;
    outputs: number;
    created_at: string;
  }>;
}

export interface PresetSample {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
  recommendedFormats: OutputFormatType[];
  tone: string;
  target_audience: string;
}
