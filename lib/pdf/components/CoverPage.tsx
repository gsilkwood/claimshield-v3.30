import React from 'react'
import { Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { styles } from '../shared/styles'

export const CoverPage = ({ data }: { data: any }) => (
  <Page size="A4" style={styles.page}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 36, fontWeight: 700, color: '#2563EB', marginBottom: 10 }}>ClaimShield DV</Text>
      <Text style={{ fontSize: 18, fontWeight: 500, color: '#4B5563', marginBottom: 40 }}>Diminished Value Appraisal Report</Text>
      
      <View style={{ width: '100%', height: 250, backgroundColor: '#F3F4F6', borderRadius: 12, marginBottom: 40, justifyContent: 'center', alignItems: 'center' }}>
        {data.vehiclePhoto ? (
          <Image src={data.vehiclePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
        ) : (
          <Text style={{ color: '#9CA3AF' }}>Vehicle Photo Not Available</Text>
        )}
      </View>

      <View style={{ width: '100%', padding: 30, backgroundColor: '#F0FDF4', borderRadius: 12, borderWidth: 1, borderColor: '#DCFCE7', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, fontWeight: 700, color: '#166534', marginBottom: 10, textTransform: 'uppercase' }}>Appraised Diminished Value</Text>
        <Text style={{ fontSize: 48, fontWeight: 700, color: '#15803D' }}>${Math.round(data.valuationResults.diminishedValue).toLocaleString()}</Text>
      </View>

      <View style={{ marginTop: 60, alignItems: 'center' }}>
        <Text style={{ fontSize: 10, color: '#6B7280', marginBottom: 4 }}>Report ID: {data.id.substring(0, 8).toUpperCase()}</Text>
        <Text style={{ fontSize: 10, color: '#6B7280', marginBottom: 4 }}>Date of Appraisal: {new Date().toLocaleDateString()}</Text>
        <Text style={{ fontSize: 10, color: '#6B7280' }}>Vehicle: {data.subjectVehicle.year} {data.subjectVehicle.make} {data.subjectVehicle.model}</Text>
      </View>
    </View>
    
    <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }}>
      <Text style={{ fontSize: 8, color: '#9CA3AF' }}>© 2026 ClaimShield DV. All rights reserved.</Text>
      <Text style={{ fontSize: 8, color: '#9CA3AF' }}>This report is a professional appraisal based on the comparable sales method.</Text>
    </View>
  </Page>
)
