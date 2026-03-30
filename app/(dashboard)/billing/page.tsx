import { Check } from 'lucide-react'
import { PRICING } from '@/lib/constants'

const tiers = [
  {
    name: 'Individual Report',
    id: 'tier-individual',
    href: '#',
    price: `$${(PRICING.INDIVIDUAL_REPORT / 100).toFixed(2)}`,
    description: 'Perfect for vehicle owners needing a single appraisal.',
    features: ['1 USPAP-compliant report', 'Georgia legal citations', 'Demand letter included', 'Email delivery'],
    mostPopular: false,
  },
  {
    name: 'Pro Individual',
    id: 'tier-sub-individual',
    href: '#',
    price: `$${(PRICING.SUBSCRIPTION_INDIVIDUAL / 100).toFixed(2)}/mo`,
    description: 'For enthusiasts and frequent buyers.',
    features: ['Up to 3 reports per month', 'Georgia legal citations', 'Demand letters included', 'Priority email support'],
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'tier-sub-professional',
    href: '#',
    price: `$${(PRICING.SUBSCRIPTION_PROFESSIONAL / 100).toFixed(2)}/mo`,
    description: 'Designed for independent appraisers.',
    features: ['Up to 10 reports per month', 'Appraiser certification section', 'White-glove support', 'Draft saving'],
    mostPopular: true,
  },
  {
    name: 'Attorney',
    id: 'tier-sub-attorney',
    href: '#',
    price: `$${(PRICING.SUBSCRIPTION_ATTORNEY / 100).toFixed(2)}/mo`,
    description: 'For personal injury law firms.',
    features: ['Up to 25 reports per month', 'Bulk export', 'Paralegal access (coming soon)', 'Dedicated account manager'],
    mostPopular: false,
  },
  {
    name: 'Body Shop',
    id: 'tier-sub-body-shop',
    href: '#',
    price: `$${(PRICING.SUBSCRIPTION_BODY_SHOP / 100).toFixed(2)}/mo`,
    description: 'Unlimited volume for collision centers.',
    features: ['Unlimited reports', 'Partner portal access', 'API access (coming soon)', 'Custom branding options'],
    mostPopular: false,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function BillingPage() {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscriptions</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your plan and billing details.</p>
      </div>

      <div className="mb-12 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Current Plan: Free Tier</h2>
        <p className="mt-2 text-sm text-gray-500">You are currently on the pay-as-you-go plan. You will be prompted to pay $129.00 per report generated.</p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900">Available Plans</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200',
                'rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={classNames(
                      tier.mostPopular ? 'text-blue-600' : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                      Popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-3xl font-bold tracking-tight text-gray-900 font-mono">{tier.price}</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
                    : 'text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300',
                  'mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full'
                )}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
