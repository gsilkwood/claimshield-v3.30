import React from 'react'
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { CoverPage } from './components/CoverPage'
import { ValuationAnalysis } from './components/ValuationAnalysis'
import { LegalFramework } from './components/LegalFramework'
import { generateValuationChart } from './charts/ValuationChart'
import { put } from '@vercel/blob'
import { db } from '../db'
import { appraisals } from '../db/schema'
import { eq } from 'drizzle-orm'
import { DemandLetterDocument } from './components/DemandLetter'

// Main Report Document
export const ReportDocument = ({ data, valuationChart }: { data: any, valuationChart: any }) => (
  <Document
    title={`Diminished Value Report - ${data.subjectVehicle.year} ${data.subjectVehicle.make} ${data.subjectVehicle.model}`}
    author="ClaimShield DV"
    subject="Diminished Value Appraisal"
    keywords="diminished value, appraisal, georgia, vehicle valuation"
  >
    <CoverPage data={data} />
    <ValuationAnalysis data={data} chart={valuationChart} />
    <LegalFramework data={data} />
    {/* Add more pages as needed for 15-25 page structure */}
  </Document>
)

export async function generateDemandLetter(appraisalId: string) {
  // 1. Fetch appraisal data
  const appraisal = await db.query.appraisals.findFirst({
    where: (appraisals, { eq }) => eq(appraisals.id, appraisalId)
  })
  if (!appraisal) throw new Error('Appraisal not found')

  // 2. Render PDF to buffer
  const buffer = await renderToBuffer(
    <DemandLetterDocument data={appraisal} />
  )

  // 3. Upload to Vercel Blob
  const fileName = `reports/${appraisalId}/demand-letter-${Date.now()}.pdf`
  const blob = await put(fileName, buffer, {
    access: 'public',
    contentType: 'application/pdf',
  })

  // 4. Persist URL to database
  await db.update(appraisals)
    .set({
      demandLetterUrl: blob.url,
      updatedAt: new Date(),
    })
    .where(eq(appraisals.id, appraisalId))

  return blob.url
}

export async function generateAppraisalReport(appraisalId: string) {
  // 1. Fetch appraisal data
  const appraisal = await db.query.appraisals.findFirst({
    where: (appraisals, { eq }) => eq(appraisals.id, appraisalId)
  })
  if (!appraisal) throw new Error('Appraisal not found')

  // 2. Generate charts
  const valuationChart = await generateValuationChart({
    preFMV: (appraisal.valuationResults as any).preAccidentFMV,
    postACV: (appraisal.valuationResults as any).postRepairACV,
    dv: (appraisal.valuationResults as any).diminishedValue,
  })

  // 3. Render PDF to buffer
  const buffer = await renderToBuffer(
    <ReportDocument data={appraisal} valuationChart={valuationChart} />
  )

  // 4. Upload to Vercel Blob
  const fileName = `reports/${appraisalId}/diminished-value-report-${Date.now()}.pdf`
  const blob = await put(fileName, buffer, {
    access: 'public',
    contentType: 'application/pdf',
  })

  // 5. Persist URL to database
  await db.update(appraisals)
    .set({
      reportPdfUrl: blob.url,
      reportGeneratedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(appraisals.id, appraisalId))

  return blob.url
}
