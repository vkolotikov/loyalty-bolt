import React, { useEffect, useRef } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { useScanner } from '../../hooks/useScanner';

const QRScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const { scanning, setScanning, error, setError, handleScan } = useScanner({ type: 'qr' });

  const startScanner = async () => {
    try {
      if (!videoRef.current) {
        throw new Error('Video element not found');
      }

      setError(null);
      setScanning(true);

      const codeReader = new BrowserQRCodeReader();

      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();
        if (devices.length === 0) {
          throw new Error('No camera found');
        }
      } catch (e) {
        throw new Error('Unable to access camera. Please ensure camera permissions are granted.');
      }

      const controls = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result, err) => {
          if (err) {
            if (!err.message.includes('NotFoundException')) {
              console.error('QR Scanner error:', err);
              setError('Error reading QR code');
            }
            return;
          }

          if (result) {
            const text = result.getText();
            try {
              const data = JSON.parse(text);
              if (data.clientId) {
                await handleScan(data.clientId);
                await stopScanner();
                return;
              }
            } catch {
              await handleScan(text);
              await stopScanner();
            }
          }
        }
      );

      controlsRef.current = controls;
    } catch (error) {
      console.error('Error starting scanner:', error);
      setError(error instanceof Error ? error.message : 'Failed to start scanner');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (controlsRef.current) {
        await controlsRef.current.stop();
        controlsRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping scanner:', error);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scanning) {
        stopScanner();
      }
    };
  }, [scanning]);

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">QR Code Scanner</h2>
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-center px-4 py-2 bg-red-600 rounded">
              {error}
            </p>
          </div>
        )}
        {!scanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-lg">
              Click "Start Scanner" to begin
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={scanning ? stopScanner : startScanner}
          className={scanning ? 'btn-danger' : 'btn-primary'}
        >
          {scanning ? 'Stop Scanner' : 'Start Scanner'}
        </button>
        {error && (
          <button
            onClick={() => setError(null)}
            className="btn-neutral"
          >
            Clear Error
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;