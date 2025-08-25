export const redact = (s: string) =>
  s.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig,'[email]')
   .replace(/\+?\d[\d -]{7,}\d/g,'[phone]');
export const info  = (...a: any[]) => console.info(...a.map(x=> typeof x==='string'?redact(x):x));
export const error = (...a: any[]) => console.error(...a.map(x=> typeof x==='string'?redact(x):x));
