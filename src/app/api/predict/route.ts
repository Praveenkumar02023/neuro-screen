import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const mode = formData.get('mode') as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // SIMULATED processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // SIMULATED AI Prediction Logic
        // In a real app, this would call a Python microservice or load a TF/ONNX model
        const isMockAd = Math.random() > 0.5;

        let result = {};

        if (mode === 'binary') {
            // CN vs AD
            const labels = ['CN (Cognitively Normal)', 'AD (Alzheimer\'s Disease)'];
            // Mock probability
            const p1 = Math.random();
            const p2 = 1 - p1;
            const probs = [p1, p2];
            const maxIdx = probs.indexOf(Math.max(...probs));

            result = {
                prediction: labels[maxIdx],
                confidence: probs[maxIdx],
                details: {
                    [labels[0]]: probs[0],
                    [labels[1]]: probs[1]
                }
            };
        } else {
            // Multi-class
            const labels = ['CN', 'MCI (Mild Cognitive Impairment)', 'AD'];
            const p1 = Math.random();
            const p2 = Math.random();
            const p3 = Math.random();
            const total = p1 + p2 + p3;
            const probs = [p1 / total, p2 / total, p3 / total];
            const maxIdx = probs.indexOf(Math.max(...probs));

            result = {
                prediction: labels[maxIdx],
                confidence: probs[maxIdx],
                details: {
                    [labels[0]]: probs[0],
                    [labels[1]]: probs[1],
                    [labels[2]]: probs[2]
                }
            };
        }

        return NextResponse.json({
            status: "success",
            filename: file.name,
            result: result
        });

    } catch (error) {
        console.error('Prediction error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
