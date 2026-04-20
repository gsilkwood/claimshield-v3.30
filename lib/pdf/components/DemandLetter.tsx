import React from 'react'
import { Page, Text, View, StyleSheet, Document } from '@react-pdf/renderer'
import { styles } from '../shared/styles'
import { GA_LEGAL_CITATIONS } from '../../constants'

export const DemandLetterDocument = ({ data }: { data: any }) => {
  const owner = data.ownerInfo || {}
  const insurance = data.insuranceInfo || {}
  const vehicle = data.subjectVehicle || {}
  const results = data.valuationResults || {}
  const partner = data.partner || null

  // Determine tone based on partner type if available
  const isAttorney = partner?.type === 'attorney'
  const isBodyShop = partner?.type === 'body_shop'
  
  const salutation = isAttorney ? `Dear Claims Representative,` : `To Whom It May Concern,`
  
  const openingStatement = isAttorney 
    ? `Our firm represents ${owner.name} in connection with a claim for diminished value resulting from a collision on ${data.accidentDate || '[Accident Date]'}.`
    : isBodyShop
    ? `As the repair facility for ${owner.name}, we are assisting our client in documenting the inherent diminished value of their vehicle following the collision on ${data.accidentDate || '[Accident Date]'}.`
    : `I am writing to formally submit a claim for the inherent diminished value of my vehicle resulting from the collision on ${data.accidentDate || '[Accident Date]'}.`

  return (
    <Document
      title={`Demand Letter - ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      author="ClaimShield DV"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={{ marginBottom: 30 }}>
          {isAttorney ? (
            <>
              <Text style={{ fontSize: 10, fontWeight: 700 }}>{partner.companyName}</Text>
              <Text style={{ fontSize: 10 }}>{partner.contactName}</Text>
            </>
          ) : isBodyShop ? (
            <>
              <Text style={{ fontSize: 10, fontWeight: 700 }}>{partner.companyName}</Text>
              <Text style={{ fontSize: 10 }}>Collision Repair Specialists</Text>
            </>
          ) : (
            <Text style={{ fontSize: 10 }}>{owner.name || 'Vehicle Owner'}</Text>
          )}
          <Text style={{ fontSize: 10, marginTop: 2 }}>{owner.address?.street || ''}</Text>
          <Text style={{ fontSize: 10 }}>{owner.address?.city || ''}, {owner.address?.state || ''} {owner.address?.zip || ''}</Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 10 }}>Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 10, fontWeight: 700 }}>{insurance.company || 'Insurance Company'}</Text>
          <Text style={{ fontSize: 10 }}>Attn: Claims Department</Text>
          <Text style={{ fontSize: 10 }}>Claim Number: {data.claimNumber || 'N/A'}</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: 700, textDecoration: 'underline' }}>
            RE: FORMAL DEMAND FOR PAYMENT OF DIMINISHED VALUE
          </Text>
          <Text style={{ fontSize: 10, marginTop: 10 }}>
            Vehicle: {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={{ fontSize: 10 }}>
            VIN: {vehicle.vin || 'N/A'}
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 10 }}>{salutation}</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 10 }}>
            {openingStatement} Although the vehicle has been restored to its pre-accident physical condition, it now suffers from "inherent diminished value" due to its permanent accident history.
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 10 }}>
            Enclosed is a professional appraisal report prepared by ClaimShield DV. This appraisal utilizes the <Text style={styles.bold}>Comparable Sales Method</Text>—the industry standard for establishing actual market loss—rather than arbitrary formulas. Our analysis confirms the following:
          </Text>
        </View>

        <View style={{ marginBottom: 20, paddingLeft: 20, borderLeftWidth: 2, borderLeftColor: '#eee' }}>
          <Text style={{ fontSize: 10, marginBottom: 4 }}>• Pre-Accident Fair Market Value: ${Math.round(results.preAccidentFMV).toLocaleString()}</Text>
          <Text style={{ fontSize: 10, marginBottom: 4 }}>• Post-Repair Actual Cash Value: ${Math.round(results.postRepairACV).toLocaleString()}</Text>
          <Text style={{ fontSize: 10, fontWeight: 700, marginTop: 4 }}>• Total Diminished Value Loss: ${Math.round(results.diminishedValue).toLocaleString()}</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 10 }}>
            Under Georgia law, specifically the landmark ruling in <Text style={styles.bold}>{GA_LEGAL_CITATIONS.LANDMARK_FIRST_PARTY}</Text>, insurers are required to compensate for the loss in value that repairs cannot restore. Furthermore, the Georgia Department of Insurance has clarified that the "17c" formula is not a mandatory method and often fails to reflect true market conditions.
          </Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 10 }}>
            We hereby demand payment in the amount of <Text style={styles.bold}>${Math.round(results.diminishedValue).toLocaleString()}</Text> within thirty (30) days. Please be advised that O.C.G.A. § 33-4-6 and § 33-4-7 provide for significant penalties and attorney fees in cases of bad faith refusal to pay a covered loss.
          </Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 10 }}>We look forward to your prompt resolution of this claim.</Text>
        </View>

        <View>
          <Text style={{ fontSize: 10, marginBottom: 20 }}>Sincerely,</Text>
          <Text style={{ fontSize: 10, borderTopWidth: 1, borderTopColor: '#000', width: 200, paddingTop: 5 }}>
            {isAttorney ? partner.contactName : isBodyShop ? partner.companyName : owner.name}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
