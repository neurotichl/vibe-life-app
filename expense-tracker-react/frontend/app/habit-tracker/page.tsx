'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HabitTrackerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" className="mb-6">
            ← Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            ✅ Habit Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Build and maintain healthy habits
          </p>
        </div>

        {/* Placeholder Card */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <CardTitle className="text-2xl">Coming Soon!</CardTitle>
            <CardDescription className="text-base">
              This module is under development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-green-700">Planned Features:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Daily habit tracking with streaks</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Visual calendar view of habit completion</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Customizable habit categories and goals</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Statistics and progress analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Habit reminders and notifications</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-green-200">
              <p className="text-sm text-gray-500 italic">
                This page will be implemented next. Stay tuned!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
