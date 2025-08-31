
import React, { useState, useRef, useCallback } from 'react';
import { generateCaptionForImage } from './services/geminiService';
import { convertFileToBase64 } from './utils/fileUtils';
import MemeCanvas from './components/MemeCanvas';
import ControlPanel from './components/ControlPanel';
import Loader from './components/Loader';
import Navbar from './components/Navbar';

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
              onDownload={handleDownload}
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

export default App;
