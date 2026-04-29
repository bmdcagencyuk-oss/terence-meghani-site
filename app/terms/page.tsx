import type { Metadata } from 'next';
import Link from 'next/link';
import { Kicker } from '@/components/ui/Kicker';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'Terms and conditions for using terencemeghani.com and engaging Terence Meghani Studio.',
  alternates: { canonical: '/terms/' },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-char">
        <div className="mx-auto max-w-3xl px-6 lg:px-12">
          <Kicker>Legal</Kicker>
          <h1
            className="mt-6 font-display text-white"
            style={{ fontSize: 'var(--text-display-lg)' }}
          >
            Terms
          </h1>
          <div className="mt-10 space-y-5 text-mist leading-relaxed text-lg">
            <p>
              These terms govern your use of terencemeghani.com and any engagement with
              Terence Meghani Studio. They sit alongside (and where relevant, are
              superseded by) any signed engagement agreement between us.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              1. Who you&rsquo;re contracting with
            </h2>
            <p>
              Services are delivered by{' '}
              <strong className="text-white">Branding Marketing UK Ltd</strong> (company
              number 13859038), trading as <strong className="text-white">Terence Meghani</strong>,
              registered in England and Wales. Throughout these terms I refer to my
              business as &ldquo;the studio,&rdquo; &ldquo;I,&rdquo; &ldquo;me,&rdquo; or
              &ldquo;my.&rdquo;
            </p>

            <h2 className="font-display text-white text-2xl mt-10">2. The website</h2>
            <p>
              This website provides information about the studio and its services.
              Browsing the site does not, by itself, create any contractual relationship
              between us.
            </p>
            <p>
              I take reasonable care to keep the content accurate and current, but I
              make no warranty that the site is error-free, uninterrupted, or that any
              specific outcome will result from following information published here.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">3. Engagements</h2>
            <p>
              Any engagement begins with a discovery call, followed by a written
              proposal that sets out scope, timeline, and pricing. The contract is
              formed when you accept the proposal in writing — not when you book a call
              or send an enquiry.
            </p>
            <p>
              Each engagement may have its own terms (a Statement of Work or signed
              agreement) which take precedence over these general terms where they
              conflict.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              4. Pricing and payment
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Fixed-fee project work is quoted on a per-engagement basis, agreed in
                advance, and invoiced according to the schedule in the proposal
                (typically 50% on signature, 50% on delivery, or split into milestones).
              </li>
              <li>
                Retainers (including WordPress Operations) are billed monthly in
                advance.
              </li>
              <li>
                Invoices are payable within 14 days of issue unless the engagement
                specifies otherwise.
              </li>
              <li>
                Late payment may attract statutory interest under the Late Payment of
                Commercial Debts (Interest) Act 1998.
              </li>
              <li>All prices are exclusive of VAT unless otherwise stated.</li>
            </ul>

            <h2 className="font-display text-white text-2xl mt-10">
              5. Intellectual property
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                On full payment for an engagement, I assign to you all intellectual
                property rights in the final deliverables produced specifically for your
                project (logos, brand systems, custom code written for your business,
                design files, etc.).
              </li>
              <li>
                I retain ownership of pre-existing tools, frameworks, libraries, and
                methodologies I bring to the engagement, and licence them to you on a
                perpetual, non-exclusive basis as needed for your use of the
                deliverables.
              </li>
              <li>
                I retain the right to feature non-confidential aspects of completed work
                in my portfolio, on social media, and in case studies — unless we&rsquo;ve
                agreed otherwise in writing.
              </li>
              <li>
                Third-party assets (stock photography, fonts, plugins, etc.) are
                licensed under their own terms; their cost and licensing scope are
                agreed in the proposal where relevant.
              </li>
            </ul>

            <h2 className="font-display text-white text-2xl mt-10">
              6. Client responsibilities
            </h2>
            <p>To deliver good work I rely on you to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Provide accurate briefs, timely feedback, and necessary access (hosting,
                accounts, brand assets) within agreed timeframes
              </li>
              <li>
                Have the right to use any materials you supply (logos, copy, images,
                etc.) and indemnify the studio against any third-party IP claims arising
                from those materials
              </li>
              <li>Pay invoices on time</li>
              <li>
                Communicate respectfully — I work directly with everyone, no account
                managers, and the relationship works best when both sides are direct
              </li>
            </ul>

            <h2 className="font-display text-white text-2xl mt-10">7. Confidentiality</h2>
            <p>
              Both sides will treat the other&rsquo;s confidential information with
              reasonable care and won&rsquo;t disclose it to third parties without
              consent, except where required by law. This obligation survives the end
              of the engagement.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              8. Warranties and limitations
            </h2>
            <p>
              I deliver work to a professional standard with reasonable care and skill.
              Beyond this, all warranties (express or implied) are excluded to the
              fullest extent permitted by law.
            </p>
            <p>
              My total liability for any engagement (whether in contract, tort, or
              otherwise) is limited to the fees actually paid to me under that
              engagement in the preceding twelve months. Nothing in these terms limits
              liability for death, personal injury caused by negligence, fraud, or
              anything else that cannot be limited under English law.
            </p>
            <p>
              I am not liable for indirect, consequential, or special losses (including
              loss of profit, loss of business, or loss of data) — even if I knew such
              losses were possible.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">9. Termination</h2>
            <p>
              Either party can terminate an engagement by giving written notice as set
              out in the relevant engagement agreement (typically 30 days for retainers;
              project-based work runs to its agreed end). Fees for work completed up to
              termination are payable in full.
            </p>
            <p>
              I reserve the right to suspend or terminate work immediately if invoices
              remain unpaid more than 30 days after the due date, after providing
              written notice.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              10. Governing law and disputes
            </h2>
            <p>
              These terms are governed by the laws of England and Wales. Any dispute is
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
            <p>
              If something goes wrong, I&rsquo;d much rather hear about it directly than
              receive a legal letter. Email{' '}
              <Link
                href="mailto:hello@terencemeghani.com"
                className="text-rocket hover:underline"
              >
                hello@terencemeghani.com
              </Link>{' '}
              and we&rsquo;ll find a sensible way to resolve it.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">
              11. Changes to these terms
            </h2>
            <p>
              These terms may change. The &ldquo;Last updated&rdquo; date at the top
              reflects the most recent change. The current version always lives at this
              URL.
            </p>

            <h2 className="font-display text-white text-2xl mt-10">Contact</h2>
            <p>
              <Link
                href="mailto:hello@terencemeghani.com"
                className="text-rocket hover:underline"
              >
                hello@terencemeghani.com
              </Link>
            </p>
          </div>
        </div>
      </section>
      <LaunchCTA headline="project" />
    </>
  );
}
