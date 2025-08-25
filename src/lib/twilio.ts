export async function sendSms(to: string, body: string) {
  // Stub: لا يرسل فعليًا في التطوير. عندما نفعّل OTP سنركّب SDK الرسمي.
  console.log(`[twilio:stub] sms to=\${to} body="\${body.slice(0, 80)}..."`);
  return { sid: "stub" };
}
