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
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface PurchaseConfirmationEmailProps {
  userName: string;
  vehicleName: string;
  orderId: string;
  amount: number;
}

export const PurchaseConfirmationEmail = ({
  userName = 'Valued Customer',
  vehicleName = 'your vehicle',
  orderId = '',
  amount = 0,
}: PurchaseConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirmation of your ClaimShield DV Purchase</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-10 px-5">
          <Heading className="text-2xl font-bold text-blue-600 mb-5">ClaimShield DV</Heading>
          <Text className="text-lg text-gray-800">Hi {userName},</Text>
          <Text className="text-gray-600 leading-relaxed">
            Thank you for your purchase! This email confirms your payment for a professional diminished value appraisal for your <span className="font-bold">{vehicleName}</span>.
          </Text>
          
          <Section className="bg-gray-50 rounded-lg p-6 my-8 border border-gray-100">
            <Text className="text-sm font-semibold text-gray-500 uppercase mb-2">Order Summary</Text>
            <Text className="text-gray-700">Order ID: <span className="font-mono">{orderId}</span></Text>
            <Text className="text-gray-700">Amount Paid: <span className="font-bold">${(amount / 100).toFixed(2)}</span></Text>
          </Section>

          <Text className="text-gray-600 mt-4">
            Our system is now generating your comprehensive report. You will receive another notification as soon as it&apos;s ready for download.
          </Text>

          <Hr className="border-gray-200 my-8" />
          
          <Text className="text-xs text-gray-400">
            © 2026 ClaimShield DV. All rights reserved.
            If you have any questions, please reply to this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default PurchaseConfirmationEmail;
