import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget: string;
  message: string;
}

export function ContactEmail({
  name,
  email,
  company,
  service,
  budget,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New enquiry from {name} — {service}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>New enquiry 🚀</Heading>
          <Text style={lede}>A new contact-form submission from terencemeghani.com.</Text>
          <Hr style={hr} />

          <Row label="Name" value={name} />
          <Row label="Email" value={email} isEmail />
          {company ? <Row label="Company" value={company} /> : null}
          <Row label="Service" value={service} />
          <Row label="Budget" value={budget} />

          <Hr style={hr} />
          <Section>
            <Text style={label}>MESSAGE</Text>
            <Text style={messageStyle}>{message}</Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Reply directly to this email to respond to {name.split(' ')[0]}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function Row({
  label: lab,
  value,
  isEmail,
}: {
  label: string;
  value: string;
  isEmail?: boolean;
}) {
  return (
    <Section style={row}>
      <Text style={label}>{lab.toUpperCase()}</Text>
      <Text style={valueStyle}>
        {isEmail ? <a href={`mailto:${value}`} style={link}>{value}</a> : value}
      </Text>
    </Section>
  );
}

const body = {
  backgroundColor: '#f6f6f6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: 0,
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '40px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const h1 = {
  color: '#242627',
  fontSize: '28px',
  fontWeight: 600,
  margin: '0 0 8px',
};

const lede = { color: '#555', fontSize: '14px', margin: '0 0 16px' };

const hr = { borderTop: '1px solid #e7e7e7', margin: '20px 0' };

const row = { margin: '12px 0' };

const label = {
  color: '#8a8a8a',
  fontSize: '11px',
  letterSpacing: '0.15em',
  margin: '0 0 4px',
  fontWeight: 700,
};

const valueStyle = {
  color: '#242627',
  fontSize: '15px',
  margin: 0,
};

const messageStyle = {
  color: '#242627',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: 0,
  whiteSpace: 'pre-line' as const,
};

const link = { color: '#FF4D17', textDecoration: 'underline' };

const footer = {
  color: '#8a8a8a',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '16px 0 0',
};

export default ContactEmail;
