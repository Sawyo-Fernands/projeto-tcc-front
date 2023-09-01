
'use client'

import React, { useContext, useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { UserContext } from '@/context/useUser';
import { api } from '@/services/api/axios';
import Loading from '@/components/Loading';

const VideoRecognition = () => {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const { dataUser } = useContext(UserContext)
  const [openLoading,setOpenLoading] = useState(true)

  async function listarImagensUsuario(){
    const response = await api.get("imagens/visualizar",{
      params:{
        usuarioId:dataUser.id,
        paginacao:80
      }
    })
    return response.data.map((element: { imagemBase64: string; }) =>(
      element.imagemBase64
    ))
  }

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
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
    };

    const runFaceApi = async () => {
      await loadModels();
      const labeledFaceDescriptors = await getLabeledFaceDescriptions();
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors,0.6);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      document.body.append(canvas);

      const displaySize = { width: video.width || 720, height: video.height || 560 };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video,new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        const results = resizedDetections.map((d) => {
          return faceMatcher.findBestMatch(d.descriptor);
        });
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        resizedDetections.forEach(detection => {
          const { age, gender, genderProbability } = detection
          new faceapi.draw.DrawTextField([
              `${parseInt(String(age), 10)} years`,
              `${gender} (${(genderProbability * 100).toFixed(2)})`
          ], detection.detection.box.topRight).draw(canvas)
      })
      results.forEach((result, index) => {
        const box = resizedDetections[index].detection.box
        const { label, distance } = result
        new faceapi.draw.DrawTextField([
            `${label} (${(distance * 100).toFixed(2)})`
        ], box.bottomRight).draw(canvas)
    })
      }, 150);
    };

    const getLabeledFaceDescriptions = async () => {
      const labels = [dataUser.usuario];
      const images = await listarImagensUsuario()

      return Promise.all(
        labels.map(async (label) => {
          const descriptions : any = [];
          for (let i = 0; i < images.length; i++) {
            // console.log(images[i])
            const base64Response = await fetch(images[i]);
            const blob = await base64Response.blob();
            const img = await faceapi.bufferToImage(blob);
            // const img = await faceapi.fetchImage(`labels/${label}/${i}.jpeg`);
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            if(detections?.descriptor)  descriptions.push(detections?.descriptor);
          }
          console.log(descriptions)
          setOpenLoading(false)
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
      );
    };

    startVideo();
    runFaceApi();
  }, []);

  return (
    <>
    <Loading openModal={openLoading} />
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
    </>
   
  );
};

export default VideoRecognition;