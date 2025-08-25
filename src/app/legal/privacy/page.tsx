export const metadata = { title: "Privacy Policy – DitonaChat" };
export default function PrivacyPage() {
  return (
    <main className="prose prose-invert mx-auto max-w-3xl p-6">
      <h1>Privacy Policy</h1>
      <p>Last updated: 2025-08-19</p>
      <h2>Who we are</h2>
      <p>DitonaChat provides an 18+ chat experience. Contact: <a href="mailto:info@ditonachat.com">info@ditonachat.com</a></p>
      <h2>Data we process</h2>
      <ul>
        <li>Account: email address (for magic link), session identifiers.</li>
        <li>Age gate: cookie-based confirmation; OTP may be used in some regions.</li>
        <li>Payments: handled by Stripe; we don’t store full payment details.</li>
        <li>WebRTC: media flows P2P when possible; connection metadata (ICE) may traverse our servers/partners.</li>
        <li>Logs & security: limited technical logs for abuse prevention and reliability.</li>
      </ul>
      <h2>Cookies</h2>
      <ul>
        <li>Essential cookies: session, age confirmation (<code>ageok</code>), anti-CSRF.</li>
      </ul>
      <h2>Third parties</h2>
      <ul>
        <li>Authentication: NextAuth (email magic link via your SMTP provider).</li>
        <li>Payments: Stripe.</li>
        <li>Realtime/Media: WebRTC STUN/TURN as needed.</li>
      </ul>
      <h2>Your rights</h2>
      <p>You can request access or deletion where applicable. Contact us to exercise your rights.</p>
      <h2>Minors</h2>
      <p>Our Service is not directed to children under 18. We remove any minor-related content immediately.</p>
      <h2>Changes</h2>
      <p>We may update this policy and will reflect the effective date above.</p>
    </main>
  );
}
