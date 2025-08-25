"use client";
import { makeSocket, type SocketT } from '@/utils/socket';

import { useEffect } from "react";
/**
 * يحمي استدعاءات WebRTC الأساسية ويُطبع لوجات مفيدة بدون كسر الصفحة.
 * - لا يحاول الوصول إلى RTCPeerConnection في SSR.
 * - لا يستخدم bind على الدوال الأصلية (يستعمل call(this, ...)).
 */
export default function ClientRTCGuard() {
  useEffect(() => {
    try {
      const g: any = globalThis as any;

      const PC =
        (g && (g.RTCPeerConnection || g.webkitRTCPeerConnection || g.mozRTCPeerConnection)) || null;

      if (!PC || !PC.prototype) {
        console.warn("[RTC-GUARD] RTCPeerConnection not available in this env (SSR or unsupported).");
        return;
      }

      const proto = PC.prototype;

      const orig = {
        setRemoteDescription: proto.setRemoteDescription,
        setLocalDescription: proto.setLocalDescription,
        createOffer: proto.createOffer,
        createAnswer: proto.createAnswer,
        addIceCandidate: proto.addIceCandidate,
      };

      // تأكد أن الدوال موجودة قبل التغليف
      if (typeof orig.setRemoteDescription !== "function" || typeof orig.setLocalDescription !== "function") {
        console.warn("[RTC-GUARD] Core methods missing on prototype; skipping patch.");
        return;
      }

      // تغليف آمن
      proto.setRemoteDescription = async function(desc: any) {
        try {
          // قبول كلًا من {type,sdp} أو {sdp فقط}
          if (desc && !desc.type && desc.sdp && typeof RTCSessionDescription !== "undefined") {
            desc = new RTCSessionDescription(desc);
          }
          return await orig.setRemoteDescription.call(this, desc);
        } catch (e) {
          console.error("[RTC-GUARD] setRemoteDescription error:", e, desc);
          throw e;
        }
      };

      proto.setLocalDescription = async function(desc?: any) {
        try {
          if (desc && !desc.type && desc.sdp && typeof RTCSessionDescription !== "undefined") {
            desc = new RTCSessionDescription(desc);
          }
          return await orig.setLocalDescription.call(this, desc);
        } catch (e) {
          console.error("[RTC-GUARD] setLocalDescription error:", e, desc);
          throw e;
        }
      };

      if (typeof orig.createOffer === "function") {
        proto.createOffer = async function(options?: RTCOfferOptions) {
          try {
            return await orig.createOffer.call(this, options as any);
          } catch (e) {
            console.error("[RTC-GUARD] createOffer error:", e);
            throw e;
          }
        };
      }

      if (typeof orig.createAnswer === "function") {
        proto.createAnswer = async function(options?: RTCOfferOptions) {
          try {
            return await orig.createAnswer.call(this, options as any);
          } catch (e) {
            console.error("[RTC-GUARD] createAnswer error:", e);
            throw e;
          }
        };
      }

      if (typeof orig.addIceCandidate === "function") {
        proto.addIceCandidate = async function(cand: any) {
          try {
            return await orig.addIceCandidate.call(this, cand);
          } catch (e) {
            console.error("[RTC-GUARD] addIceCandidate error:", e, cand);
            throw e;
          }
        };
      }

      console.log("[RTC-GUARD] v3 active");
    } catch (e) {
      console.error("[RTC-GUARD] init error:", e);
    }
  }, []);

  return null;
}
