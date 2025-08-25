export const metadata = { title: "Terms of Service – DitonaChat" };
export default function TermsPage() {
  return (
    <main className="prose prose-invert mx-auto max-w-3xl p-6">
      <h1>Terms of Service</h1>
      <p>Last updated: 2025-08-19</p>
      <h2>Eligibility</h2>
      <p>DitonaChat is for adults (18+) only. By using the Service, you confirm you are at least 18.</p>
      <h2>Accounts & Access</h2>
      <p>Sign-in is via email magic link (no passwords). You are responsible for access to your email account.</p>
      <h2>Acceptable Use</h2>
      <ul>
        <li>No illegal content, harassment, or exploitation.</li>
        <li>No minors’ content. Violations lead to immediate termination.</li>
      </ul>
      <h2>Payments</h2>
      <p>Subscriptions are processed by Stripe. Billing terms appear at checkout.</p>
      <h2>Networking & Quality</h2>
      <p>Video/voice rely on WebRTC and may use relay servers; quality can vary.</p>
      <h2>Termination</h2>
      <p>We may suspend or terminate accounts violating these Terms.</p>
      <h2>Contact</h2>
      <p>Questions: <a href="mailto:info@ditonachat.com">info@ditonachat.com</a></p>
    </main>
  );
}
