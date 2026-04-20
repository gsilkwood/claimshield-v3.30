import {
  Body,
  Button,
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

interface DraftNudgeEmailProps {
  userName: string;
  vehicleName: string;
  resumeUrl: string;
}

export const DraftNudgeEmail = ({
  userName = 'Valued Customer',
  vehicleName = 'your vehicle',
  resumeUrl = '#',
}: DraftNudgeEmailProps) => (
  <Html>
    <Head />
    <Preview>Finish your diminished value appraisal for your {vehicleName}</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-10 px-5">
          <Heading className="text-2xl font-bold text-blue-600 mb-5">ClaimShield DV</Heading>
          <Text className="text-lg text-gray-800">Hi {userName},</Text>
          <Text className="text-gray-600 leading-relaxed">
            We noticed you started a diminished value appraisal for your <span className="font-bold">{vehicleName}</span> but haven't finished it yet.
          </Text>
          
          <Text className="text-gray-600 mt-4">
            Don't leave money on the table. Most insurance companies won't offer you diminished value unless you ask for it with a professional appraisal.
          </Text>

          <Section className="text-center mt-8">
            <Button
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-md"
              href={resumeUrl}
            >
              Resume My Appraisal
            </Button>
          </Section>

          <Text className="text-gray-600 mt-8">
            It only takes a few more minutes to complete your report and get the documentation you need to support your claim.
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

export default DraftNudgeEmail;
