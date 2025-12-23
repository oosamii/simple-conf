"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SearchResultCard } from "@/components/search/SearchResultCard"
import { ExternalResultCard } from "@/components/search/ExternalResultCard"
import { SearchResultsSkeleton } from "@/components/search/SearchResultsSkeleton"
import { SearchX } from "lucide-react"
import { ProtectedRoute } from "@/lib/components/protected-route"

const searchResults = [
  {
    id: 1,
    title: "Razorpay Integration Guide",
    path: "Sales > Payment Gateways",
    snippet:
      "This guide covers the complete integration of <mark>Razorpay</mark> payment gateway including checkout flow, webhook handling, and error scenarios...",
    relevance: 0.92,
    views: 234,
    updatedAt: "2 days ago",
  },
  {
    id: 2,
    title: "Payment Gateway Comparison",
    path: "Sales > Research",
    snippet:
      "Comparing <mark>Razorpay</mark>, PhonePe, and Stripe for Indian market. <mark>Razorpay</mark> offers the best documentation and SDK support...",
    relevance: 0.78,
    views: 89,
    updatedAt: "1 week ago",
  },
  {
    id: 3,
    title: "E-commerce Checkout PRD",
    path: "Product > E-commerce",
    snippet:
      "The checkout flow should support multiple payment methods including <mark>Razorpay</mark> for cards and UPI...",
    relevance: 0.65,
    views: 156,
    updatedAt: "3 days ago",
  },
]

const externalResults = [
  {
    id: 1,
    title: "Razorpay Documentation - Getting Started",
    domain: "razorpay.com",
    snippet: "Official documentation for integrating Razorpay payment gateway...",
  },
  {
    id: 2,
    title: "Razorpay Node.js SDK - GitHub",
    domain: "github.com",
    snippet: "Official Node.js library for Razorpay API integration...",
  },
]

export default function SearchResultsPage() {
  const [searchEverywhere, setSearchEverywhere] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const query = "razorpay integration"
  const resultsCount = searchResults.length

  if (isLoading) {
    return <SearchResultsSkeleton />
  }

  const hasResults = searchResults.length > 0

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-semibold">
            {hasResults ? (
              <>
                {resultsCount} result{resultsCount !== 1 ? "s" : ""} for <span className="text-primary">'{query}'</span>
              </>
            ) : (
              <>
                No results for <span className="text-primary">'{query}'</span>
              </>
            )}
          </h1>

          <div className="flex items-center gap-3">
            <Label htmlFor="search-mode" className="text-sm text-slate-600">
              Internal only
            </Label>
            <Switch id="search-mode" checked={searchEverywhere} onCheckedChange={setSearchEverywhere} />
            <Label htmlFor="search-mode" className="text-sm text-slate-600">
              Search everywhere
            </Label>
          </div>
        </div>

        {/* Internal Results */}
        {hasResults ? (
          <div className="space-y-4">
            {searchResults.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchX className="w-16 h-16 text-slate-300 mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No results found for '{query}'</h2>
            <p className="text-slate-500 mb-4">Try different keywords or search everywhere for external resources</p>
          </div>
        )}

        {/* External Results Section */}
        {searchEverywhere && externalResults.length > 0 && (
          <div className="space-y-4 pt-8 border-t">
            <h2 className="text-xl font-semibold text-slate-900">External Resources</h2>
            <div className="space-y-3">
              {externalResults.map((result) => (
                <ExternalResultCard key={result.id} result={result} />
              ))}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
