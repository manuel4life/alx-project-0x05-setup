import { HEIGHT, WIDTH } from "@/constants";
import { RequestProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY?.trim();
    const rapidApiHost = 'chatgpt-42.p.rapidapi.com';
    const apiUrl = 'https://chatgpt-42.p.rapidapi.com/gpt/texttoimage';

    if (!rapidApiKey) {
        return response.status(500).json({
            error: "API key is missing in environment variables"
        });
    }

    try {
        const { prompt } = request.body;

        if (!prompt || typeof prompt !== 'string') {
            return response.status(400).json({
                error: "Prompt is required and must be a string"
            });
        }

        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': rapidApiHost
            },
            body: JSON.stringify({
                text: prompt,
                width: WIDTH,
                height: HEIGHT
            })
        });

        const data = await res.json();

        const imageUrl = data.generated_image || data.url || data.image;

        if (!imageUrl) {
            console.error('Unexpected API response:', data);
            throw new Error("Could not extract image URL from API response");
        }

        return response.status(200).json({
            imageUrl: imageUrl,
            prompt: prompt
        });

    } catch (error) {
        console.error("Full API error:", error);
        return response.status(500).json({
            error: error instanceof Error ? error.message : "Internal server error"
        });
    }
}


export default handler;