"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {useDropzone} from 'react-dropzone'

export default function Home() {
  const [image, setImage] = useState<File>();
  const [isSelected,setIsSelected]=useState(false)
  const [result, setResult] = useState<string | null>(null); // Explicitly set result type
  const [img, setImg] = useState<File | null>(null); // 👈 CORRECTED LINE: Allow File or null
  const [loading,setLoading]=useState(false)

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]; // Use optional chaining for safety
    if (file) { // Only set state if a file exists
      setImg(file)
      setIsSelected(true);
    }
  }

  const handleUpload = async () => {
    setLoading(true)
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result as string;

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64 }),
      });

      const data = await res.json();
      setResult(data.url);
      console.log(data.url)
      setLoading(false)
    };

    if (img) {
      reader.readAsDataURL(img);
    } else {
      setLoading(false); // Stop loading if no image is present
    }
  };
  
  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = "background-removed.png"; // file name
    link.click();
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">🪄 Remove Background</h1>

      <input className="bg-blue-500 text-teal-50 text-bold rounded-full text-xl p-6 hover:bg-blue-600 " onChange={handleChange}  type="file" accept="image/*"  />
      {
        isSelected &&(
          <Button onClick={handleUpload} className="bg-amber-500 mt-5 text-teal-50 text-bold rounded-full text-xl p-6 hover:bg-amber-600 ">
            {loading?"Loading ...":"Remove Background"}
          </Button>
        )
      }
      {result && (
        <div className="mt-6 ">
          <h2 className="font-semibold text-black">Result:</h2>
          <img src={result} alt="Result" className="rounded-lg shadow-lg mt-2 border border-amber-400" onClick={handleDownload} />
          
        </div>
      )}
    </div>
  );
}