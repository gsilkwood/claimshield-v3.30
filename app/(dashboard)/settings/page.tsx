import { UserProfile } from '@clerk/nextjs'

export default function SettingsPage() {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your profile and security preferences.</p>
      </div>
      
      <div className="flex justify-start">
        <UserProfile routing="hash" />
      </div>
    </div>
  )
}
