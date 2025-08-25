"use client";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

export type SelfPreviewHandle = {
  el: HTMLVideoElement | null;
  toggleAudio(): boolean;
  toggleVideo(): boolean;
  switchFacing(): Promise<void>;
};

type SelfPreviewProps = {
  onSwitchCam?: () => void;
  isVip?: boolean;
  beauty?: boolean;
  className?: string;
};

const SelfPreview = forwardRef<SelfPreviewHandle, SelfPreviewProps>(
  function SelfPreview(props, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    
    useImperativeHandle(ref, () => ({
      el: videoRef.current,
      
      toggleAudio(): boolean {
        const mediaStream = videoRef.current?.srcObject as MediaStream | null;
        let enabled = true;
        
        if (mediaStream) {
          const audioTracks = mediaStream.getAudioTracks();
          if (audioTracks.length > 0) {
            audioTracks.forEach(track => {
              track.enabled = !track.enabled;
            });
            enabled = audioTracks[0].enabled;
          }
        }
        
        return enabled;
      },
      
      toggleVideo(): boolean {
        const mediaStream = videoRef.current?.srcObject as MediaStream | null;
        let enabled = true;
        
        if (mediaStream) {
          const videoTracks = mediaStream.getVideoTracks();
          if (videoTracks.length > 0) {
            videoTracks.forEach(track => {
              track.enabled = !track.enabled;
            });
            enabled = videoTracks[0].enabled;
          }
        }
        
        return enabled;
      },
      
      async switchFacing(): Promise<void> {
        try {
          // Stop current tracks
          const currentStream = videoRef.current?.srcObject as MediaStream | null;
          if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
          }
          
          // Get new stream with user-facing camera
          const constraints = {
            video: { facingMode: "user" as const },
            audio: true
          };
          
          const newStream = await navigator.mediaDevices.getUserMedia(constraints);
          
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
            await videoRef.current.play().catch(() => {
              // Silent fail for autoplay issues
            });
          }
          
          props.onSwitchCam?.();
        } catch (error) {
          console.warn("[SelfPreview] switchFacing failed:", error);
        }
      },
    }), [props.onSwitchCam]);

    return (
      <video 
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover rounded-xl ${props.className || ""}`}
        style={{
          filter: props.beauty ? "blur(0.5px) saturate(1.1)" : undefined
        }}
      />
    );
  }
);

export default SelfPreview;
