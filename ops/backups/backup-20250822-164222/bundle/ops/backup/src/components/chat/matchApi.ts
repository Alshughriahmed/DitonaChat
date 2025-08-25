export type ToggleLikeResult = { 
  liked: boolean; 
  likes: number; 
};

export async function nextAction(
  genderPref?: string, 
  countryPref?: string
): Promise<void> {
  try {
    await fetch("/api/match/cancel", { method: "POST" });
  } catch (e) {
    console.warn("[matchApi] Cancel failed:", e);
  }
  
  const response = await fetch("/api/match/enqueue", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ genderPref, countryPref })
  });
  
  if (!response.ok) {
    throw new Error(`Enqueue failed: ${response.status}`);
  }
}

export async function prevAction(): Promise<void> {
  return nextAction();
}

export async function stopAction(): Promise<void> {
  const response = await fetch("/api/match/cancel", { method: "POST" });
  if (!response.ok) {
    throw new Error(`Stop failed: ${response.status}`);
  }
}

export const likes = {
  async toggle({ 
    roomId, 
    peerId 
  }: { 
    roomId: string; 
    peerId: string; 
  }): Promise<ToggleLikeResult> {
    try {
      const response = await fetch("/api/likes/toggle", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roomId, peerId })
      });
      
      if (!response.ok) {
        return { liked: false, likes: 0 };
      }
      
      return await response.json();
    } catch (e) {
      console.warn("[likes] Toggle failed:", e);
      return { liked: false, likes: 0 };
    }
  }
};

export function relayLog(event: string, data: any): void {
  try {
    console.debug("[telemetry]", event, data);
    // Could send to analytics endpoint here
  } catch (e) {
    // Silent fail for telemetry
  }
}
