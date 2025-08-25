 "use client";

type LikeButtonProps = { peerId: string; roomId: string; onToggle?: (r:{liked:boolean;likes:number})=>void };
type Props = { peerId: string; roomId: string; onToggle?: (next:{liked:boolean;likes:number})=>void };
export default function LikeButton({ peerId, roomId, onToggle }: Props) {
  const click = async () => {
    try {
      const r = await fetch("/api/likes/toggle", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ peerId, roomId }) });
      const j = await r.json();
      onToggle?.(j);
    } catch {}
  };
  return <button onClick={click} aria-label="Like" title="Like">❤️</button>;
}
