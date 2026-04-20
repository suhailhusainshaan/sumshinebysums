import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
  const url = `${API_BASE_URL}/products/featured`;

  const debug: Record<string, unknown> = {
    step1_url_being_fetched: url,
    step2_api_base_url_env: process.env.NEXT_PUBLIC_API_BASE_URL ?? '(not set, using default)',
  };

  try {
    const response = await fetch(url, { cache: 'no-store' });

    debug.step3_http_status = response.status;
    debug.step4_response_ok = response.ok;
    debug.step5_content_type = response.headers.get('content-type');

    const text = await response.text();
    debug.step6_raw_response_text = text.slice(0, 500);

    try {
      const json = JSON.parse(text);
      debug.step7_parsed_json_keys = Object.keys(json);
      debug.step8_data_field = json.data;
      debug.step9_data_is_array = Array.isArray(json.data);
      debug.step10_data_length = Array.isArray(json.data) ? json.data.length : 'NOT_ARRAY';
    } catch {
      debug.step7_json_parse_error = 'Response is not valid JSON';
    }
  } catch (err: unknown) {
    debug.step3_fetch_error = err instanceof Error ? err.message : String(err);
    debug.step4_possible_cause = 'Backend server may be down or not reachable from Next.js server';
  }

  return NextResponse.json(debug, { status: 200 });
}
