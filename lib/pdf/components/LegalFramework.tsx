import React from 'react'
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { styles } from '../shared/styles'
import { GA_LEGAL_CITATIONS } from '../../constants'

export const LegalFramework = ({ data }: { data: any }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.header}>
      <Text style={styles.logo}>ClaimShield DV</Text>
      <Text style={styles.reportId}>Report ID: {data.id.substring(0, 8).toUpperCase()}</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Georgia Legal Framework</Text>
      
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.h2}>Legal Precedents & Statutes</Text>
        <Text style={{ marginBottom: 10 }}>This appraisal is prepared in accordance with Georgia law and established legal precedents regarding diminished value claims.</Text>
        
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.h3}>First-Party Claims</Text>
          <Text style={{ marginBottom: 4 }}>For claims against your own insurance company, the landmark case is <Text style={styles.bold}>{GA_LEGAL_CITATIONS.LANDMARK_FIRST_PARTY}</Text>, which established that insurance companies must compensate for the loss in value of a vehicle after an accident, even if it has been fully repaired.</Text>
          <Text style={styles.legalText}>Statutory Authority: {GA_LEGAL_CITATIONS.FIRST_PARTY_STATUTE}</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={styles.h3}>Third-Party Claims</Text>
          <Text style={{ marginBottom: 4 }}>For claims against an at-fault driver's insurance company, the case of <Text style={styles.bold}>{GA_LEGAL_CITATIONS.LANDMARK_THIRD_PARTY}</Text> confirms that the measure of damages is the difference between the fair market value of the vehicle immediately before the collision and its fair market value immediately after the collision.</Text>
          <Text style={styles.legalText}>Statutory Authority: {GA_LEGAL_CITATIONS.THIRD_PARTY_STATUTE}</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={styles.h3}>Valuation Methodology</Text>
          <Text style={{ marginBottom: 4 }}>The <Text style={styles.bold}>17c formula</Text> is <Text style={styles.bold}>NOT</Text> endorsed by the Georgia Department of Insurance as the sole method for determining diminished value. The Georgia DOI Directive (December 2008) indicates that insurance companies must use a method that accurately reflects the actual loss in value.</Text>
          <Text style={styles.legalText}>Methodology Citation: {GA_LEGAL_CITATIONS.METHOD_CITATION}</Text>
        </View>

        <View style={{ backgroundColor: '#FEF2F2', borderLeftWidth: 4, borderLeftColor: '#EF4444', padding: 10, marginTop: 20 }}>
          <Text style={{ fontSize: 9, fontWeight: 700, color: '#991B1B', marginBottom: 4 }}>Important Note on Bad Faith</Text>
          <Text style={{ fontSize: 8, color: '#991B1B' }}>Under Georgia law, failure to pay a valid diminished value claim in good faith can result in penalties of {GA_LEGAL_CITATIONS.BAD_FAITH_PENALTY}.</Text>
        </View>
      </View>
    </View>

    <View style={styles.footer}>
      <Text>© 2026 ClaimShield DV</Text>
      <Text>Page 11 of 15</Text>
    </View>
  </Page>
)
