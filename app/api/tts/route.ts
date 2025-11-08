import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_TTS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: "ko-KR",
            name: "ko-KR-Standard-A",
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error.message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ audioContent: data.audioContent });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}
