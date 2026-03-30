import React from 'react'
import { Page, Text, View, StyleSheet, Document } from '@react-pdf/renderer'
import { styles } from '../shared/styles'
import { GA_LEGAL_CITATIONS } from '../../constants'

export const DemandLetterDocument = ({ data }: { data: any }) => {
  const owner = data.ownerInfo || {}
  const insurance = data.insuranceInfo || {}
  const vehicle = data.subjectVehicle || {}
  const results = data.valuationResults || {}

  return (
    <Document
      title={`Demand Letter - ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      author="ClaimShield DV"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>{owner.name || 'Vehicle Owner'}</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>{owner.address?.street || ''}</Text>
          <Text style={{ fontSize: 10 }}>{owner.address?.city || ''}, {owner.address?.state || ''} {owner.address?.zip || ''}</Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>{insurance.company || 'Insurance Company'}</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>Attn: Claims Department</Text>
          <Text style={{ fontSize: 10, marginBottom: 2 }}>Claim Number: {data.claimNumber || 'N/A'}</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: 700, textDecoration: 'underline' }}>
            RE: NOTICE OF CLAIM FOR DIMINISHED VALUE
          </Text>
          <Text style={{ fontSize: 10, marginTop: 10 }}>
            Vehicle: {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={{ fontSize: 10 }}>
            VIN: {vehicle.vin || 'N/A'}
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 10 }}>To Whom It May Concern,</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 10 }}>
            I am writing to formally submit a claim for the inherent diminished value of my vehicle resulting from the collision on {data.accidentDate || '[Accident Date]'}. Although my vehicle has been repaired, it now carries a permanent accident history which significantly reduces its resale value in the open market.
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 10 }}>
            Enclosed is a professional appraisal report prepared by ClaimShield DV. This appraisal utilizes the <Text style={styles.bold}>Comparable Sales Method</Text> to establish the actual market loss. Our analysis confirms the following:
          </Text>
        </View>

        <View style={{ marginBottom: 20, paddingLeft: 20 }}>
          <Text style={{ fontSize: 10, marginBottom: 4 }}>• Pre-Accident Fair Market Value: ${Math.round(results.preAccidentFMV).toLocaleString()}</Text>
          <Text style={{ fontSize: 10, marginBottom: 4 }}>• Post-Repair Actual Cash Value: ${Math.round(results.postRepairACV).toLocaleString()}</Text>
          <Text style={{ fontSize: 10, fontWeight: 700 }}>• Total Diminished Value: ${Math.round(results.diminishedValue).toLocaleString()}</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 10 }}>
            Under Georgia law, specifically <Text style={styles.bold}>{GA_LEGAL_CITATIONS.LANDMARK_FIRST_PARTY}</Text> (for first-party claims) and <Text style={styles.bold}>{GA_LEGAL_CITATIONS.LANDMARK_THIRD_PARTY}</Text> (for third-party claims), I am entitled to compensation for this loss in value. The Georgia Department of Insurance has explicitly stated that the "17c formula" is not a mandatory or exclusive method for determining diminished value, and that insurers must use a method that accurately reflects the actual loss.
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 10 }}>
            I hereby demand payment in the amount of <Text style={styles.bold}>${Math.round(results.diminishedValue).toLocaleString()}</Text> within thirty (30) days of the date of this letter. Failure to resolve this claim in good faith may result in further legal action, including potential penalties under {GA_LEGAL_CITATIONS.FIRST_PARTY_STATUTE} or {GA_LEGAL_CITATIONS.THIRD_PARTY_STATUTE}.
          </Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 10 }}>Thank you for your prompt attention to this matter.</Text>
        </View>

        <View>
          <Text style={{ fontSize: 10, marginBottom: 20 }}>Sincerely,</Text>
          <Text style={{ fontSize: 10, borderTopWidth: 1, borderTopColor: '#000', width: 200, paddingTop: 5 }}>
            {owner.name || 'Vehicle Owner'}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
