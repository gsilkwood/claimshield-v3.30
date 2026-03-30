import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface ReportReadyEmailProps {
  userName: string;
  vehicleName: string;
  reportUrl: string;
  dvAmount: number;
}

export const ReportReadyEmail = ({
  userName = 'Valued Customer',
  vehicleName = 'your vehicle',
  reportUrl = '#',
  dvAmount = 0,
}: ReportReadyEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Diminished Value Report is Ready</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-10 px-5">
          <Heading className="text-2xl font-bold text-blue-600 mb-5">ClaimShield DV</Heading>
          <Text className="text-lg text-gray-800">Hi {userName},</Text>
          <Text className="text-gray-600 leading-relaxed">
            Great news! Your professional diminished value appraisal for your <span className="font-bold">{vehicleName}</span> is complete and ready for download.
          </Text>
          
          <Section className="bg-gray-50 rounded-lg p-6 my-8 border border-gray-100">
            <Text className="text-sm font-semibold text-gray-500 uppercase mb-2">Appraised Diminished Value</Text>
            <Text className="text-3xl font-bold text-green-600">${Math.round(dvAmount).toLocaleString()}</Text>
          </Section>

          <Section className="text-center mt-8">
            <Button
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-md"
              href={reportUrl}
            >
              Download PDF Report
            </Button>
          </Section>

          <Text className="text-gray-600 mt-8">
            This report includes all necessary Georgia legal citations and comparable market data to support your claim. We recommend submitting this to the insurance company along with the enclosed demand letter.
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

export default ReportReadyEmail;
