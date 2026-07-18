import { NextResponse } from 'next/server';
import { formatGeminiError, parseReceiptWithGemini } from '../../../lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const mimeType = image.type || 'image/jpeg';

    const receipt = await parseReceiptWithGemini(buffer, mimeType);
    return NextResponse.json(receipt);
  } catch (error) {
    console.error('Receipt parsing failed:', error);
    const { message, status } = formatGeminiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
