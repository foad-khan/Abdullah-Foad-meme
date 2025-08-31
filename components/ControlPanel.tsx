
import React from 'react';
import { UploadIcon, MagicWandIcon, DownloadIcon, ShareIcon } from './icons';

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
  topText,
  setTopText,
  bottomText,
  setBottomText,
  topTextY,
  setTopTextY,
  bottomTextY,
  setBottomTextY,
  fontSize,
  setFontSize,
  onFileChange,
  onSuggestCaption,
  onShare,
  onDownload,
  onDownloadGif,
  fileInputRef,
  onTriggerFileUpload,
  isImageLoaded,
}) => {
    
  return (
    <div className="bg-gray-800 p-6 rounded-2xl space-y-8 h-full flex flex-col overflow-y-auto">
      {/* Step 1: Image Selection */}
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

      {/* Step 2: Add Text */}
      <div className={`space-y-4 transition-opacity ${isImageLoaded ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <h2 className="text-lg font-bold text-gray-300 flex items-center">
          <span className="bg-indigo-500 text-white rounded-full h-6 w-6 text-xs font-bold flex items-center justify-center mr-3">2</span>
          Add & Position Text
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            placeholder="Top Text"
            className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
           <div className="space-y-2">
            <label htmlFor="top-y" className="text-sm font-medium text-gray-400">Top Text Position</label>
            <input id="top-y" type="range" min="0" max="50" value={topTextY} onChange={(e) => setTopTextY(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
          </div>
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            placeholder="Bottom Text"
            className="w-full p-3 bg-gray-900/70 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
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

      {/* Step 3: Share or Download */}
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

export default ControlPanel;