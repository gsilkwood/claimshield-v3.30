'use server'

import { db } from '@/lib/db';
import { notifications, users, appraisals } from '@/lib/db/schema';
import { resend, FROM_EMAIL, FROM_NAME } from '@/lib/email/resend-client';
import { twilioClient, TWILIO_PHONE_NUMBER } from '@/lib/sms/twilio-client';
import { ReportReadyEmail } from '@/lib/email/templates/ReportReady';
import { DraftNudgeEmail } from '@/lib/email/templates/DraftNudge';
import { PurchaseConfirmationEmail } from '@/lib/email/templates/PurchaseConfirmation';
import { render } from '@react-email/render';
import { eq } from 'drizzle-orm';
import React from 'react';

export async function sendReportReadyNotification(appraisalId: string) {
  const appraisal = await db.query.appraisals.findFirst({
    where: (appraisals, { eq }) => eq(appraisals.id, appraisalId),
    with: {
      user: true,
    }
  });

  if (!appraisal || !appraisal.userId) throw new Error('Appraisal or User not found');
  const user = (appraisal as any).user;
  const results = appraisal.valuationResults as any;
  const vehicle = appraisal.subjectVehicle as any;

  // 1. Send Email via Resend
  if (resend && user.email) {
    try {
      const emailHtml = await render(
        <ReportReadyEmail
          userName={user.name || 'Valued Customer'}
          vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          reportUrl={appraisal.reportPdfUrl || '#'}
          dvAmount={results.diminishedValue}
        />
      );

      const { data, error } = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [user.email],
        subject: `Your Diminished Value Report is Ready - ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        html: emailHtml,
      });

      await db.insert(notifications).values({
        userId: user.id,
        appraisalId: appraisal.id,
        type: 'email',
        event: 'report_ready',
        recipient: user.email,
        status: error ? 'failed' : 'sent',
        providerMessageId: data?.id || null,
        error: error ? JSON.stringify(error) : null,
      });
    } catch (err) {
      console.error('Email send failed:', err);
      await db.insert(notifications).values({
        userId: user.id,
        appraisalId: appraisal.id,
        type: 'email',
        event: 'report_ready',
        recipient: user.email,
        status: 'failed',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // 2. Send SMS via Twilio (if opted in)
  if (twilioClient && TWILIO_PHONE_NUMBER && user.phone && user.smsOptIn) {
    try {
      const message = await twilioClient.messages.create({
        body: `ClaimShield DV: Your report for your ${vehicle.year} ${vehicle.make} ${vehicle.model} is ready! Download it here: ${appraisal.reportPdfUrl}`,
        from: TWILIO_PHONE_NUMBER,
        to: user.phone,
      });

      await db.insert(notifications).values({
        userId: user.id,
        appraisalId: appraisal.id,
        type: 'sms',
        event: 'report_ready',
        recipient: user.phone,
        status: 'sent',
        providerMessageId: message.sid,
      });
    } catch (err) {
      console.error('SMS send failed:', err);
      await db.insert(notifications).values({
        userId: user.id,
        appraisalId: appraisal.id,
        type: 'sms',
        event: 'report_ready',
        recipient: user.phone,
        status: 'failed',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

export async function sendDraftNudgeNotification(appraisalId: string) {
  const appraisal = await db.query.appraisals.findFirst({
    where: (appraisals, { eq }) => eq(appraisals.id, appraisalId),
    with: {
      user: true,
    }
  });

  if (!appraisal || !appraisal.userId) throw new Error('Appraisal or User not found');
  const user = (appraisal as any).user;
  const vehicle = appraisal.subjectVehicle as any;

  if (resend && user.email) {
    try {
      const emailHtml = await render(
        <DraftNudgeEmail
          userName={user.name || 'Valued Customer'}
          vehicleName={vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'your vehicle'}
          resumeUrl={`${process.env.NEXT_PUBLIC_APP_URL}/drafts/${appraisal.id}`}
        />
      );

      const { data, error } = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [user.email],
        subject: `Finish your diminished value appraisal`,
        html: emailHtml,
      });

      await db.insert(notifications).values({
        userId: user.id,
        appraisalId: appraisal.id,
        type: 'email',
        event: 'draft_nudge',
        recipient: user.email,
        status: error ? 'failed' : 'sent',
        providerMessageId: data?.id || null,
        error: error ? JSON.stringify(error) : null,
      });
    } catch (err) {
      console.error('Draft nudge email failed:', err);
    }
  }
}

export async function sendPurchaseConfirmationNotification(appraisalId: string, amount: number) {
  const appraisal = await db.query.appraisals.findFirst({
    where: (appraisals, { eq }) => eq(appraisals.id, appraisalId),
    with: {
      user: true,
    }
  });

  if (!appraisal || !appraisal.userId) throw new Error('Appraisal or User not found');
  const user = (appraisal as any).user;
  const vehicle = appraisal.subjectVehicle as any;

  if (resend && user.email) {
    try {
      const emailHtml = await render(
        <PurchaseConfirmationEmail
          userName={user.name || 'Valued Customer'}
          vehicleName={vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'your vehicle'}
          orderId={appraisal.id}
          amount={amount}
        />
      );

      const { data, error } = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [user.email],
        subject: `Payment Confirmed - ClaimShield DV`,
        html: emailHtml,
      });

      await db.insert(notifications).values({
        userId: user.id,
        appraisalId: appraisal.id,
        type: 'email',
        event: 'purchase_confirmation',
        recipient: user.email,
        status: error ? 'failed' : 'sent',
        providerMessageId: data?.id || null,
        error: error ? JSON.stringify(error) : null,
      });
    } catch (err) {
      console.error('Purchase confirmation email failed:', err);
    }
  }
}
