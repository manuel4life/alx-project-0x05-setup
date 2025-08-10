import ImageCard from "@/components/common/ImageCard";
import { ImageProps } from "@/interfaces";
import { useState } from "react";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedImages, setGeneratedImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<string>("");

  const handleGenerateImage = async () => {
    setIsLoading(true);
    console.log("Generating Images..");
    console.log(process.env.NEXT_PUBLIC_GPT_API_KEY);

    try {
      const response = await fetch(
        "https://chatgpt-42.p.rapidapi.com/aitohuman",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
            "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com",
          },
          body: JSON.stringify({
            text: prompt || "Generate a creative image description",
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);
      setApiResponse(data.response || data.message);
    } catch (error: unknown) {
      console.error("API Error:", error);
      setApiResponse("Error generating image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl text-blue-500 font-bold mb-2">
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
            className="w-full p-3 border border-gray-300 text-gray-800 rounded-lg mb-4"
          />
          <button
            onClick={handleGenerateImage}
            disabled={isLoading}
            className={`w-full p-3 rounded-lg transition duration-200  ${
              isLoading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "Loading..." : "Generate Response"}
          </button>
        </div>

        {apiResponse && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md w-full max-w-md">
            <h3 className="font-bold mb-2">AI Response:</h3>
            <p>{apiResponse}</p>
          </div>
        )}

        {imageUrl && (
          <ImageCard
            action={() => setImageUrl(imageUrl)}
            imageUrl={imageUrl}
            prompt={prompt}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
