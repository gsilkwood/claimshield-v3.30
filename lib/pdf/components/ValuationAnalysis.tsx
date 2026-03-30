import React from 'react'
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { styles } from '../shared/styles'

export const ValuationAnalysis = ({ data, chart }: { data: any, chart: any }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.header}>
      <Text style={styles.logo}>ClaimShield DV</Text>
      <Text style={styles.reportId}>Report ID: {data.id.substring(0, 8).toUpperCase()}</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Valuation Analysis</Text>
      
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.h2}>Diminished Value Summary</Text>
        <Text style={{ marginBottom: 10 }}>Based on our analysis of clean-history and accident-history comparable vehicles, we have established the following valuation for the subject vehicle:</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ width: '30%', padding: 10, backgroundColor: '#F9FAFB', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>Pre-Accident FMV</Text>
            <Text style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>${Math.round(data.valuationResults.preAccidentFMV).toLocaleString()}</Text>
          </View>
          <View style={{ width: '30%', padding: 10, backgroundColor: '#F9FAFB', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>Post-Repair ACV</Text>
            <Text style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>${Math.round(data.valuationResults.postRepairACV).toLocaleString()}</Text>
          </View>
          <View style={{ width: '30%', padding: 10, backgroundColor: '#EFF6FF', borderRadius: 8, borderWidth: 1, borderColor: '#DBEAFE' }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: '#2563EB', marginBottom: 4 }}>Diminished Value</Text>
            <Text style={{ fontSize: 14, fontWeight: 700, color: '#1D4ED8' }}>${Math.round(data.valuationResults.diminishedValue).toLocaleString()}</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {chart}
        </View>

        <Text style={styles.h3}>Calculation Methodology</Text>
        <Text style={{ marginBottom: 10 }}>This appraisal uses the <Text style={styles.bold}>Comparable Sales Method</Text>, which is the industry standard for establishing diminished value. By comparing the subject vehicle to similar vehicles with and without accident histories, we can isolate the market stigma impact resulting from the accident.</Text>
        
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Defensible Valuation Range</Text>
          <Text style={{ fontSize: 10, color: '#166534' }}>
            Based on market distribution, the diminished value ranges from 
            <Text style={styles.bold}> ${Math.round(data.valuationResults.confidenceRange.low).toLocaleString()} </Text> 
            to 
            <Text style={styles.bold}> ${Math.round(data.valuationResults.confidenceRange.high).toLocaleString()}</Text>.
          </Text>
        </View>
      </View>
    </View>

    <View style={styles.footer}>
      <Text>© 2026 ClaimShield DV</Text>
      <Text>Page 8 of 15</Text>
    </View>
  </Page>
)
