
'use client'

import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const VideoRecognition = () => {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    const startVideo = async () => {
      const constraints = {
        video: {
          width: 720,
          height: 560,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
    };

    const loadModels = async () => {
      const MODEL_URL = 'models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
    };

    const runFaceApi = async () => {
      await loadModels();
      const labeledFaceDescriptors = await getLabeledFaceDescriptions();
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      document.body.append(canvas);

      const displaySize = { width: video.width || 720, height: video.height || 560 };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video)
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        const results = resizedDetections.map((d) => {
          return faceMatcher.findBestMatch(d.descriptor);
        });
        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, {
            label: result.toString(),
          });
          drawBox.draw(canvas);
        });
      }, 100);
    };

    const getLabeledFaceDescriptions = async () => {
      const labels = ['Sawyo'];
      return Promise.all(
        labels.map(async (label) => {
          const descriptions : any = [];
          for (let i = 1; i <= 2; i++) {
            const img = await faceapi.fetchImage(`labels/${label}/${i}.jpeg`);
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            descriptions.push(detections?.descriptor);
          }
          console.log(descriptions)
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
      );
    };

    startVideo();
    runFaceApi();
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        height="560"
        width="720"
        id="inputVideo"
        autoPlay
        muted
        playsInline
      ></video>
      <canvas ref={canvasRef} id="overlay" style={{ position: 'absolute', top: 0, zIndex: 20 }}></canvas>
    </div>
  );
};

export default VideoRecognition;