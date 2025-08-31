
import React, { useEffect, useCallback } from 'react';

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
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1f2937'; // bg-gray-800
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    if (!imageSrc) {
        ctx.fillStyle = '#9ca3af'; // text-gray-400
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

      // --- Text Drawing ---
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
          // Calculate the starting Y position for the whole text block
          const totalTextHeight = (lines.length -1) * lineHeight;
          const startY = offsetY + (drawHeight * (yPercent / 100)) - (totalTextHeight / 2);

          lines.forEach((line, index) => {
              const lineY = startY + (index * lineHeight);
              ctx.strokeText(line, x, lineY);
              ctx.fillText(line, x, lineY);
          })
      }

      // Top text
      wrapText(topText, topTextY);
      
      // Bottom text
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
      // Defer the canvas redraw to the next animation frame to avoid the loop error.
      requestAnimationFrame(drawMeme);
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    drawMeme(); // Initial draw for when props change
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [drawMeme, canvasRef]);


  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default MemeCanvas;
