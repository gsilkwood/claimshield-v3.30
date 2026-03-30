import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center lg:hidden">
        <button type="button" className="-ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <span className="ml-2 text-lg font-bold tracking-tight text-gray-900">ClaimShield DV</span>
      </div>
      <div className="hidden lg:flex lg:flex-1" />
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <UserButton />
      </div>
    </header>
  )
}
