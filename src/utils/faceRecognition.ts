import * as faceapi from 'face-api.js';

let isModelLoaded = false;

export const loadFaceApiModels = async (): Promise<void> => {
  if (isModelLoaded) return;
  
  try {
    const MODEL_URL = '/models';
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    
    isModelLoaded = true;
    console.log('Face API models loaded successfully');
  } catch (error) {
    console.error('Error loading Face API models:', error);
    throw error;
  }
};

export const detectFace = async (imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => {
  try {
    const detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    return detection;
  } catch (error) {
    console.error('Error detecting face:', error);
    return null;
  }
};

export const compareFaces = (descriptor1: Float32Array, descriptor2: Float32Array): number => {
  try {
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    return distance;
  } catch (error) {
    console.error('Error comparing faces:', error);
    return 1; // Return max distance on error
  }
};

export const captureImageFromVideo = (video: HTMLVideoElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  ctx.drawImage(video, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.8);
};