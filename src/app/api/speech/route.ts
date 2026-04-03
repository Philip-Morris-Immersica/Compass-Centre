import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!audio || !(audio instanceof Blob)) {
      return Response.json({ error: "No audio provided" }, { status: 400 });
    }

    const file = new File([audio], "recording.webm", { type: audio.type || "audio/webm" });

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file,
    });

    return Response.json({ text: transcription.text });
  } catch (error) {
    console.error("Speech API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Transcription failed" },
      { status: 500 }
    );
  }
}
