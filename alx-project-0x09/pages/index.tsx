import ImageCard from "@/components/common/ImageCard";
import React, { useState } from "react";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const resp = await fetch("/api/generate-image", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        throw new Error(`Request failed with status ${resp.status}`);
      }

      const data = await resp.json();

      if (!data.imageUrl) {
        throw new Error("No image URL returned from API");
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error("Image generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl. text-blue-500 font-bold mb-2">
          Image Generation App
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Generate stunning images based on your prompts!
        </p>

        <div className="w-full max-w-md">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg mb-4"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateImage}
            disabled={isLoading}
            className={`w-full p-3 rounded-lg transition duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "Generating..." : "Generate Image"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg w-full max-w-md">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="mt-6 w-full max-w-md">
            <ImageCard
              action={() => setImageUrl(imageUrl)}
              imageUrl={imageUrl}
              prompt={prompt}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
