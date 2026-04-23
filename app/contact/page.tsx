import type { Metadata } from 'next';
import { ContactForm } from '@/components/sections/ContactForm';
import { LaunchCTA } from '@/components/launch/LaunchCTA';

export const metadata: Metadata = {
  title: 'Contact — Terence Meghani',
  description:
    "Got a brief? Drop the details below — or book a 30-minute call. I read every enquiry personally and reply within 48 hours.",
};

export default function ContactPage() {
  return (
    <div className="pt-20">
      <ContactForm />
      <LaunchCTA headline="brief" />
    </div>
  );
}
