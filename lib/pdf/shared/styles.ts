import { Font, StyleSheet, Text, View, Image } from '@react-pdf/renderer'
import path from 'path'

// Register Inter fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'), fontWeight: 400 },
    { src: path.join(process.cwd(), 'public/fonts/Inter-Medium.ttf'), fontWeight: 500 },
    { src: path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'), fontWeight: 700 },
  ],
})

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#1F2937',
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
  },
  logo: {
    fontSize: 14,
    fontWeight: 700,
    color: '#2563EB',
  },
  reportId: {
    fontSize: 8,
    color: '#6B7280',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#FFFFFF',
    backgroundColor: '#2563EB',
    padding: '4 8',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  h1: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
    color: '#111827',
  },
  h2: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
    color: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  h3: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    color: '#374151',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#F9FAFB',
    padding: 5,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: 700,
    color: '#4B5563',
  },
  tableCell: {
    fontSize: 8,
  },
  callout: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  calloutTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#166534',
    marginBottom: 4,
  },
  calloutValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#15803D',
  },
  legalText: {
    fontSize: 8,
    color: '#4B5563',
    fontStyle: 'italic',
    marginTop: 10,
  },
  bold: {
    fontWeight: 700,
  },
})
