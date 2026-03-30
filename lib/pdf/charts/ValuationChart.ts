import satori from 'satori'
import { parse } from 'svg-parser'
import React from 'react'
import { Svg, Path, Rect, Text, G, Circle, Line } from '@react-pdf/renderer'
import fs from 'fs'
import path from 'path'

// Load fonts for Satori
const interRegular = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'))
const interBold = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'))

/**
 * Converts an SVG string (from Satori) into @react-pdf/renderer components.
 */
export function convertSvgToReactPdf(svgString: string): any {
  const parsed = parse(svgString)
  return renderNode(parsed.children[0])
}

function renderNode(node: any, index: number = 0): any {
  if (node.type === 'text') return null // Text is usually handled by <text> tags in SVG

  const { tagName, properties, children } = node
  if (!tagName) return null

  const props: any = { key: index }
  
  // Map SVG properties to react-pdf properties
  if (properties) {
    if (properties.fill) props.fill = properties.fill
    if (properties.stroke) props.stroke = properties.stroke
    if (properties['stroke-width']) props.strokeWidth = properties['stroke-width']
    if (properties.d) props.d = properties.d
    if (properties.x) props.x = properties.x
    if (properties.y) props.y = properties.y
    if (properties.width) props.width = properties.width
    if (properties.height) props.height = properties.height
    if (properties.r) props.r = properties.r
    if (properties.cx) props.cx = properties.cx
    if (properties.cy) props.cy = properties.cy
    if (properties.x1) props.x1 = properties.x1
    if (properties.y1) props.y1 = properties.y1
    if (properties.x2) props.x2 = properties.x2
    if (properties.y2) props.y2 = properties.y2
    if (properties.transform) props.transform = properties.transform
    if (properties['font-family']) props.fontFamily = properties['font-family']
    if (properties['font-size']) props.fontSize = properties['font-size']
    if (properties['font-weight']) props.fontWeight = properties['font-weight']
    if (properties['text-anchor']) props.textAnchor = properties['text-anchor']
  }

  const childElements = children?.map((child: any, i: number) => renderNode(child, i)).filter(Boolean)

  switch (tagName.toLowerCase()) {
    case 'svg':
      return React.createElement(Svg, { ...props, viewBox: properties.viewBox }, childElements)
    case 'path':
      return React.createElement(Path, props)
    case 'rect':
      return React.createElement(Rect, props)
    case 'circle':
      return React.createElement(Circle, props)
    case 'line':
      return React.createElement(Line, props)
    case 'g':
      return React.createElement(G, props, childElements)
    case 'text':
      // Satori often outputs text as paths, but if it outputs <text>:
      const textContent = children?.find((c: any) => c.type === 'text')?.value || ''
      return React.createElement(Text, props, textContent)
    default:
      return null
  }
}

export async function generateValuationChart(data: { preFMV: number, postACV: number, dv: number }) {
  const width = 400
  const height = 200
  const maxVal = Math.max(data.preFMV, data.postACV) * 1.1

  const barWidth = 60
  const spacing = 40
  
  const h1 = (data.preFMV / maxVal) * (height - 40)
  const h2 = (data.postACV / maxVal) * (height - 40)
  const h3 = (data.dv / maxVal) * (height - 40)

  const svg = await satori(
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: 'white',
        padding: '20px',
        fontFamily: 'Inter',
      }
    }, [
      // Pre-FMV Bar
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }
      }, [
        React.createElement('div', {
          style: {
            width: `${barWidth}px`,
            height: `${h1}px`,
            backgroundColor: '#2563EB',
            borderRadius: '4px 4px 0 0',
          }
        }),
        React.createElement('span', { style: { fontSize: '10px', marginTop: '4px', fontWeight: 'bold' } }, 'Pre-Accident'),
        React.createElement('span', { style: { fontSize: '10px' } }, `$${Math.round(data.preFMV).toLocaleString()}`)
      ]),
      // Post-ACV Bar
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }
      }, [
        React.createElement('div', {
          style: {
            width: `${barWidth}px`,
            height: `${h2}px`,
            backgroundColor: '#64748B',
            borderRadius: '4px 4px 0 0',
          }
        }),
        React.createElement('span', { style: { fontSize: '10px', marginTop: '4px', fontWeight: 'bold' } }, 'Post-Repair'),
        React.createElement('span', { style: { fontSize: '10px' } }, `$${Math.round(data.postACV).toLocaleString()}`)
      ]),
      // DV Bar
      React.createElement('div', {
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }
      }, [
        React.createElement('div', {
          style: {
            width: `${barWidth}px`,
            height: `${h3}px`,
            backgroundColor: '#10B981',
            borderRadius: '4px 4px 0 0',
          }
        }),
        React.createElement('span', { style: { fontSize: '10px', marginTop: '4px', fontWeight: 'bold', color: '#10B981' } }, 'Diminished Value'),
        React.createElement('span', { style: { fontSize: '10px', color: '#10B981' } }, `$${Math.round(data.dv).toLocaleString()}`)
      ])
    ]),
    {
      width,
      height,
      fonts: [
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
      ],
    }
  )

  return convertSvgToReactPdf(svg)
}
