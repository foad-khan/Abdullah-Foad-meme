
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// === From utils/fileUtils.ts ===
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// === From services/geminiService.ts ===
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function generateCaptionForImage(imageBase64: string): Promise<string> {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
        },
    };
    const textPart = {
        text: 'Analyze this image and suggest a short, funny meme caption. Format the response as a JSON object with "topText" and "bottomText" keys. The text should be concise and impactful, suitable for a meme.'
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    topText: {
                        type: Type.STRING,
                        description: "The text to display at the top of the meme."
                    },
                    bottomText: {
                        type: Type.STRING,
                        description: "The text to display at the bottom of the meme."
                    }
                }
            }
        }
    });

    return response.text;
}

// === From components/icons.tsx ===
const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const MagicWandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c.239.053.484.11.73.182m-3.962 1.542a3.375 3.375 0 0 1-2.268-1.542 25.13 25.13 0 0 1-1.42-3.464m11.379 1.542c.313.23.615.474.904.722a3.375 3.375 0 0 1 2.268-1.542 25.13 25.13 0 0 1 1.42-3.464M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
  </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
    </svg>
);

// === From components/Loader.tsx ===
interface LoaderProps {
  message: string;
}
const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
      <p className="mt-4 text-lg text-white font-semibold">{message}</p>
    </div>
  );
};


// === From components/MemeCanvas.tsx ===
interface MemeCanvasProps {
  imageSrc: string | null;
  topText: string;
  bottomText: string;
  topTextY: number;
  bottomTextY: number;
  fontSize: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setError: (error: string | null) => void;
}
const MemeCanvas: React.FC<MemeCanvasProps> = ({
  imageSrc,
  topText,
  bottomText,
  topTextY,
  bottomTextY,
  fontSize,
  canvasRef,
  setError,
}) => {
  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    if (!imageSrc) {
        ctx.fillStyle = '#9ca3af';
        ctx.font = '20px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Your meme will appear here', canvas.width / (2*dpr), canvas.height / (2*dpr));
        return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    
    img.onload = () => {
      const containerWidth = canvas.width / dpr;
      const containerHeight = canvas.height / dpr;
      const imgAspectRatio = img.width / img.height;
      const containerAspectRatio = containerWidth / containerHeight;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspectRatio > containerAspectRatio) {
        drawWidth = containerWidth;
        drawHeight = drawWidth / imgAspectRatio;
        offsetX = 0;
        offsetY = (containerHeight - drawHeight) / 2;
      } else {
        drawHeight = containerHeight;
        drawWidth = drawHeight * imgAspectRatio;
        offsetY = 0;
        offsetX = (containerWidth - drawWidth) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      const finalFontSize = Math.max(16, Math.floor(drawWidth * (fontSize / 100)));
      ctx.font = `bold ${finalFontSize}px Impact, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = finalFontSize / 20;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const x = containerWidth / 2;
      const wrapText = (text: string, yPercent: number) => {
          const lines = text.toUpperCase().split('\n');
          const lineHeight = finalFontSize * 1.2;
          const totalTextHeight = (lines.length -1) * lineHeight;
          const startY = offsetY + (drawHeight * (yPercent / 100)) - (totalTextHeight / 2);

          lines.forEach((line, index) => {
              const lineY = startY + (index * lineHeight);
              ctx.strokeText(line, x, lineY);
              ctx.fillText(line, x, lineY);
          })
      }
      wrapText(topText, topTextY);
      wrapText(bottomText, bottomTextY);
    };

    img.onerror = () => {
      setError("Couldn't load the image. It might be a CORS issue or an invalid URL.");
    };
  }, [imageSrc, topText, bottomText, topTextY, bottomTextY, fontSize, canvasRef, setError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(drawMeme);
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    drawMeme();
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [drawMeme, canvasRef]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};


// === From components/Navbar.tsx ===
const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tighter text-gray-100">
              Meme Generator
            </h1>
          </div>
        </div>
      </div>
    </nav>
  );
};


// === From components/ControlPanel.tsx ===
interface ControlPanelProps {
  topText: string;
  setTopText: (text: string) => void;
  bottomText: string;
  setBottomText: (text: string) => void;
  topTextY: number;
  setTopTextY: (y: number) => void;
  bottomTextY: number;
  setBottomTextY: (y: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSuggestCaption: () => void;
  onShare: () => void;
  onDownload: () => void;
  onDownloadGif: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onTriggerFileUpload: () => void;
  isImageLoaded: boolean;
}
const ControlPanel: React.FC<ControlPanelProps> = ({
  topText, setTopText, bottomText, setBottomText, topTextY, setTopTextY, bottomTextY, setBottomTextY,
  fontSize, setFontSize, onFileChange, onSuggestCaption, onShare, onDownload, onDownloadGif,
  fileInputRef, onTriggerFileUpload, isImageLoaded,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl space-y-8 h-full flex flex-col overflow-y-auto">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-300 flex items-center">
          <span className="bg-indigo-500 text-white rounded-full h-6 w-6 text-xs font-bold flex items-center justify-center mr-3">1</span>
          Choose Image
        </h2>
        <div>
          <input type="file" accept="image/*" onChange={onFileChange} ref={fileInputRef} className="hidden" />
          <button onClick={onTriggerFileUpload} className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <UploadIcon className="w-5 h-5" />
            Upload an Image
          </button>
        </div>
      </div>

      <div className={`space-y-4 transition-opacity ${isImageLoaded ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <h2 className="text-lg font-bold text-gray-300 flex items-center">
          <span className="bg-indigo-500 text-white rounded-full h-6 w-6 text-xs font-bold flex items-center justify-center mr-3">2</span>
          Add & Position Text
        </h2>
        <div className="space-y-4">
          <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="Top Text" className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          <div className="space-y-2">
            <label htmlFor="top-y" className="text-sm font-medium text-gray-400">Top Text Position</label>
            <input id="top-y" type="range" min="0" max="50" value={topTextY} onChange={(e) => setTopTextY(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
          </div>
          <input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="Bottom Text" className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          <div className="space-y-2">
            <label htmlFor="bottom-y" className="text-sm font-medium text-gray-400">Bottom Text Position</label>
            <input id="bottom-y" type="range" min="50" max="100" value={bottomTextY} onChange={(e) => setBottomTextY(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
          </div>
          <div className="space-y-2">
            <label htmlFor="font-size" className="text-sm font-medium text-gray-400">Text Size</label>
            <input id="font-size" type="range" min="5" max="20" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
          </div>
          <button onClick={onSuggestCaption} className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <MagicWandIcon className="w-5 h-5" /> Suggest AI Caption
          </button>
        </div>
      </div>

      <div className={`flex-grow flex flex-col justify-end transition-opacity ${isImageLoaded ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-300 flex items-center">
            <span className="bg-indigo-500 text-white rounded-full h-6 w-6 text-xs font-bold flex items-center justify-center mr-3">3</span>
            Share or Download
          </h2>
          <div className="space-y-4">
            <button onClick={onShare} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <ShareIcon className="w-5 h-5" /> Share
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={onDownload} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <DownloadIcon className="w-5 h-5" /> Download PNG
              </button>
              <button onClick={onDownloadGif} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <DownloadIcon className="w-5 h-5" /> Download GIF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// === From App.tsx ===
declare var GIF: any;
const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [topText, setTopText] = useState<string>('');
  const [bottomText, setBottomText] = useState<string>('');
  const [topTextY, setTopTextY] = useState<number>(10);
  const [bottomTextY, setBottomTextY] = useState<number>(90);
  const [fontSize, setFontSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      setIsLoading(true);
      setLoadingMessage('Loading image...');
      try {
        const base64 = await convertFileToBase64(file);
        setImageSrc(base64);
        setTopText('');
        setBottomText('');
      } catch (err) {
        setError('Failed to load image. Please try another file.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSuggestCaption = useCallback(async () => {
    if (!imageSrc) {
      setError('Please select an image first.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Thinking of a caption...');
    try {
      const base64Data = imageSrc.split(',')[1];
      const captionData = await generateCaptionForImage(base64Data);
      const parsedCaption = JSON.parse(captionData);
      setTopText(parsedCaption.topText || '');
      setBottomText(parsedCaption.bottomText || '');
    } catch (err) {
      console.error(err);
      setError('Failed to suggest a caption. The AI might be stumped!');
    } finally {
      setIsLoading(false);
    }
  }, [imageSrc]);

  const handleShare = async () => {
    if (!canvasRef.current) {
      setError('Canvas not found.');
      return;
    }
    if (!navigator.share) {
      setError('Sharing is not supported on this browser. Please download the image instead.');
      return;
    }
    setError(null);
    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError('Failed to create image blob for sharing.');
        return;
      }
      const file = new File([blob], 'meme.png', { type: 'image/png' });
      const shareData = {
        files: [file],
        title: 'My Meme',
        text: 'Check out this meme I made!',
      };
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share was cancelled or failed.', err);
      }
    }, 'image/png');
  };

  const handleDownload = () => {
    if (!canvasRef.current) {
      setError('Canvas not found.');
      return;
    }
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDownloadGif = () => {
    if (!canvasRef.current) {
      setError('Canvas not found.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Creating your GIF...');

    const canvas = canvasRef.current;

    setTimeout(() => {
      try {
        const gif = new GIF({
          workers: 2,
          quality: 10,
          workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js',
        });
        gif.addFrame(canvas, { delay: 500 });
        gif.on('finished', (blob: Blob) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'meme.gif';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          setIsLoading(false);
        });
        gif.render();
      } catch (err) {
        console.error('GIF creation failed:', err);
        setError('An error occurred while creating the GIF.');
        setIsLoading(false);
      }
    }, 100);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-screen bg-gray-900 text-white font-sans flex flex-col">
      {isLoading && <Loader message={loadingMessage} />}
      <Navbar />
      <main className="flex-grow container mx-auto min-h-0 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full p-4 lg:p-8">
          <div className="lg:col-span-5">
            <ControlPanel
              topText={topText}
              setTopText={setTopText}
              bottomText={bottomText}
              setBottomText={setBottomText}
              topTextY={topTextY}
              setTopTextY={setTopTextY}
              bottomTextY={bottomTextY}
              setBottomTextY={setBottomTextY}
              fontSize={fontSize}
              setFontSize={setFontSize}
              onFileChange={handleFileChange}
              onSuggestCaption={handleSuggestCaption}
              onShare={handleShare}
              onDownload={handleDownload}
              onDownloadGif={handleDownloadGif}
              fileInputRef={fileInputRef}
              onTriggerFileUpload={triggerFileUpload}
              isImageLoaded={!!imageSrc}
            />
          </div>
          <div className="lg:col-span-7 bg-gray-800/50 rounded-2xl p-4 flex items-center justify-center aspect-square lg:aspect-auto">
            <MemeCanvas
              canvasRef={canvasRef}
              imageSrc={imageSrc}
              topText={topText}
              bottomText={bottomText}
              topTextY={topTextY}
              bottomTextY={bottomTextY}
              fontSize={fontSize}
              setError={setError}
            />
          </div>
        </div>
      </main>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg animate-pulse" onClick={() => setError(null)}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

// === Original index.tsx render logic ===
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
