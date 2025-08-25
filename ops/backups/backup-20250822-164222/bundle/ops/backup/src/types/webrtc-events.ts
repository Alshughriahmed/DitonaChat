export type OfferEvt      = { roomId: string; desc: RTCSessionDescriptionInit };
export type AnswerEvt     = { roomId: string; desc: RTCSessionDescriptionInit };
export type CandidateEvt  = { roomId?: string; candidate: RTCIceCandidateInit };
export type RoomClosedEvt = { reason: string };
export type QueueErrorEvt = { message?: string; remainingMs?: number };