// ditona: minimal RTC client (local stream + pc lifecycle)
// This is a small helper; wire it from the UI later.
"use client";
import { createPeerConnection, getLocalStream } from "./webrtc";

export class RtcClient {
  pc: RTCPeerConnection | null = null;
  local: MediaStream | null = null;
  facing: "user" | "environment" = "user";

  async start(audio = true) {
    this.local = await getLocalStream(this.facing, audio);
    this.pc = await createPeerConnection();
    this.local.getTracks().forEach((t) => this.pc!.addTrack(t, this.local!));
    return { pc: this.pc, local: this.local };
  }

  async switchCamera() {
    this.facing = this.facing === "user" ? "environment" : "user";
    // Replace video track
    const newStream = await getLocalStream(this.facing, !!this.local?.getAudioTracks().length);
    const newVideo = newStream.getVideoTracks()[0];
    if (!this.local) this.local = newStream;
    const senders = this.pc?.getSenders() || [];
    const vSender = senders.find((s) => s.track?.kind === "video");
    if (vSender && newVideo) await vSender.replaceTrack(newVideo);
    // stop old video tracks
    this.local.getVideoTracks().forEach((t) => t.stop());
    // set new local
    this.local = new MediaStream([
      newVideo,
      ...newStream.getAudioTracks(),
      ...this.local.getAudioTracks(),
    ]);
    return this.facing;
  }

  stop() {
    this.pc?.getSenders().forEach((s) => s.track && s.track.stop());
    this.local?.getTracks().forEach((t) => t.stop());
    this.pc?.close();
    this.pc = null;
    this.local = null;
  }
}
