/* Media bridge: mic/cam/speaker + swipe (H80/V50) + masks-on-self + beauty modes */
if (typeof window !== 'undefined') {
  const w = window as any;
  w.__DITONA_MEDIA__ ||= {
    stream: null as MediaStream|null,
    selfVideo: null as HTMLVideoElement|null,
    speakerMuted: false,
    maskMode: 'off' as ('off'|'sunglasses'|'mustache'|'surgical'|'clown'|'bunny'),
    beautyIdx: 0 as 0|1|2|3|4|5, // 0 off, 1 soft, 2 soft+, 3 warm, 4 cool, 5 mono
    maskRAF: 0 as number,
  };
  const S = w.__DITONA_MEDIA__;

  let DBG = false; try { DBG = (localStorage.getItem('debugSwipe') === '1'); } catch {}
  const dlog = (...a: any[]) => { if (DBG) console.log('[SWIPE]', ...a); };

  async function ensureStream(): Promise<MediaStream|null> {
    if (S.stream) return S.stream;
    try {
      const st = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      S.stream = st;
      let v: HTMLVideoElement | null =
        (document.querySelector('video[data-self-preview]') as HTMLVideoElement|null) ||
        (document.getElementById('selfPreview') as HTMLVideoElement|null);
      if (!v) {
        v = document.createElement('video');
        v.autoplay = true; v.muted = true; v.playsInline = true;
        v.style.position = 'fixed'; v.style.right = '-9999px'; v.style.bottom = '-9999px';
        v.setAttribute('data-self-preview','hidden');
        document.body.appendChild(v);
      }
      S.selfVideo = v;
      try { (v as any).srcObject = st; } catch {}
      applyBeautyIdx(S.beautyIdx);
      applyMask(S.maskMode);
      return st;
    } catch (e) { console.warn('getUserMedia failed', e); return null; }
  }

  function setMic(mute: boolean)  { S.stream?.getAudioTracks().forEach(t => (t.enabled = !mute)); }
  function setCam(mute: boolean)  { S.stream?.getVideoTracks().forEach(t => (t.enabled = !mute)); }
  function setSpeaker(mute: boolean) {
    S.speakerMuted = mute;
    const nodes = Array.from(document.querySelectorAll('video, audio')) as HTMLMediaElement[];
    for (const el of nodes) {
      if (S.selfVideo && el === S.selfVideo) continue; // keep self muted separately
      el.muted = mute;
    }
  }

  // ======= Masks on SELF =======
  function ensureOverlay(): HTMLDivElement {
    let ov = document.getElementById('maskOverlaySelf') as HTMLDivElement|null;
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'maskOverlaySelf';
      ov.style.position = 'fixed';
      ov.style.left = '0'; ov.style.right = '0';
      ov.style.top = '50vh'; ov.style.height = '50vh';
      ov.style.pointerEvents = 'none';
      ov.style.zIndex = '45';
      ov.style.display = 'grid';
      ov.style.placeItems = 'center';
      document.body.appendChild(ov);
    }
    return ov;
  }
  function maskEmoji(mode: 'off'|'sunglasses'|'mustache'|'surgical'|'clown'|'bunny'){
    switch(mode){
      case 'sunglasses': return '😎';
      case 'mustache':   return '🥸';
      case 'surgical':   return '😷';
      case 'clown':      return '🤡';
      case 'bunny':      return '🐰';
      default:           return '';
    }
  }
  function applyMask(mode: 'off'|'sunglasses'|'mustache'|'surgical'|'clown'|'bunny') {
    S.maskMode = mode;
    try { localStorage.setItem('maskMode', mode); } catch {}
    const ov = ensureOverlay();
    ov.innerHTML = '';
    cancelAnimationFrame(S.maskRAF || 0);
    if (mode === 'off') return;

    const span = document.createElement('span');
    span.textContent = maskEmoji(mode);
    span.style.position = 'absolute';
    span.style.transform = 'translate(-50%,-50%)';
    span.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,.5))';
    ov.appendChild(span);

    const FD = ('FaceDetector' in window) ? new (window as any).FaceDetector({ fastMode: true, maxDetectedFaces: 1 }) : null;

    const loop = async () => {
      if (!S.selfVideo) { S.maskRAF = requestAnimationFrame(loop); return; }
      const v = S.selfVideo;
      let cx = window.innerWidth/2, cy = window.innerHeight*0.75, size = 80; // fallback
      try {
        if (FD && v.readyState >= 2) {
          const faces = await FD.detect(v);
          if (faces && faces[0]) {
            const f = faces[0] as any;
            const bb = f.boundingBox; // video coords
            const vw = v.videoWidth || 640, vh = v.videoHeight || 480;
            const px = (bb.x + bb.width/2) / vw;
            const faceTop = bb.y / vh;
            const pyEye = (bb.y + bb.height*0.32) / vh;
            const pyLip = (bb.y + bb.height*0.62) / vh;

            let py: number; let scale=1;
            switch (S.maskMode) {
              case 'sunglasses': py = pyEye; scale = 0.9; break;
              case 'mustache':   py = pyLip; scale = 0.7; break;
              case 'surgical':   py = (bb.y + bb.height*0.55)/vh; scale = 0.9; break;
              case 'clown':      py = (bb.y + bb.height*0.50)/vh; scale = 1.2; break;
              case 'bunny':      py = faceTop - 0.25; scale = 1.0; break; // ears
              default:           py = pyLip; scale = 0.8;
            }
            cx = Math.round(px * window.innerWidth);
            cy = Math.round(window.innerHeight*0.5 + py * window.innerHeight*0.5);
            size = Math.round(Math.min(bb.width, bb.height) * scale);
            if (S.maskMode === 'bunny') size = Math.max(72, Math.min(size*1.2, 200));
            else size = Math.max(48, Math.min(size, 180));
          }
        }
      } catch(e){ /* ignore */ }
      span.style.left = `${cx}px`; span.style.top  = `${cy}px`; span.style.fontSize = `${size}px`;
      S.maskRAF = requestAnimationFrame(loop);
    };
    S.maskRAF = requestAnimationFrame(loop);
  }

  // ======= Beauty modes on self preview =======
  function applyBeautyIdx(idx: 0|1|2|3|4|5) {
    S.beautyIdx = idx;
    try { localStorage.setItem('beautyIdx', String(idx)); } catch {}
    const v = S.selfVideo; if (!v) return;
    const filters = [
      'none',
      'contrast(1.03) saturate(1.05) brightness(1.03) blur(0.4px)',
      'contrast(1.06) saturate(1.08) brightness(1.06) blur(0.8px)',
      'brightness(1.04) contrast(1.02) saturate(1.12) sepia(0.12) blur(0.3px)',
      'brightness(1.02) contrast(1.04) saturate(0.9) hue-rotate(200deg) blur(0.3px)',
      'grayscale(0.55) contrast(1.05) brightness(1.05) blur(0.2px)',
    ];
    (v.style as any).filter = filters[idx] || 'none';
  }

  // === Bus wiring ===
  import('./bus').then(({ on, emit }) => {
    on('toggle-mic', async (e) => { await ensureStream(); setMic(!!(e.detail?.muted)); });
    on('toggle-cam', async (e) => { await ensureStream(); setCam(!!(e.detail?.muted)); });
    on('toggle-speaker',     (e) => { setSpeaker(!!(e.detail?.muted)); });
    on('toggle-mask',        (e) => { const m = e.detail?.mode as any; applyMask(m ?? 'off'); });
    on('beauty-mode',        (e) => { const I = Number(e.detail?.idx   ?? 0) as (0|1|2|3|4|5); applyBeautyIdx(I); });
  });

  // === Swipe: H80 / V50 ===
  (function bindSwipe(){
    let startX: number|null = null, startY: number|null = null, active = false;
    const H = 80, V = 50;
    const onDown = (e: PointerEvent) => { if (!e.isPrimary) return; startX = e.clientX; startY = e.clientY; active = true; dlog('down', startX, startY); };
    const onMove = (e: PointerEvent) => {
      if (!active || startX == null || startY == null) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) >= H && Math.abs(dx) > Math.abs(dy)) {
        active = false; import('./bus').then(({ emit }) => emit(dx <= -H ? 'next' : 'prev')); return;
      }
      if (Math.abs(dy) >= V && Math.abs(dy) > Math.abs(dx)) {
        active = false; import('./bus').then(({ emit }) => emit(dy >= V ? 'history' : 'latest'));
      }
    };
    const onUp = () => { active = false; startX = null; startY = null; };
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointermove', onMove,  { passive: true });
    document.addEventListener('pointerup',   onUp,    { passive: true });
    document.addEventListener('pointercancel', onUp,  { passive: true });
  })();

  // restore prefs
  try {
    const m = (localStorage.getItem('maskMode') as any) || 'off';
    const I = Number(localStorage.getItem('beautyIdx')||'0') as (0|1|2|3|4|5);
    S.maskMode = m; S.beautyIdx = I;
  } catch {}
}
