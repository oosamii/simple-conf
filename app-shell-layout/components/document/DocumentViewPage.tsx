"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/folder/Breadcrumbs";
import { MetadataBar } from "./MetadataBar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CommentsSection } from "./CommentsSection";

const document = {
  id: 1,
  title: "Razorpay Integration Guide",
  path: ["Home", "Sales", "Payment Gateways"],
  content: `# Overview

This guide covers the complete integration of Razorpay payment gateway for our e-commerce platform.

## Prerequisites

- Node.js 18+
- Razorpay merchant account
- API keys from Razorpay dashboard

## Installation

\`\`\`bash
npm install razorpay
\`\`\`

## Basic Setup

\`\`\`typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
\`\`\`

## Creating an Order

| Field | Type | Required |
|-------|------|----------|
| amount | number | Yes |
| currency | string | Yes |
| receipt | string | No |

## Error Handling

Always wrap API calls in try-catch blocks to handle network failures and API errors gracefully.

\`\`\`javascript
try {
  const order = await razorpay.orders.create({
    amount: 50000,
    currency: "INR",
    receipt: "order_rcptid_11"
  });
  console.log(order);
} catch (error) {
  console.error('Error creating order:', error);
}
\`\`\`
`,
  createdBy: { name: "John Doe", avatar: "JD" },
  modifiedBy: { name: "Jane Smith", avatar: "JS" },
  updatedAt: "2 hours ago",
  views: 234,
  commentCount: 3,
  isOwner: true,
};

const initialComments = [
  {
    id: 1,
    author: { name: "Alex Chen", avatar: "AC" },
    content: "Great documentation! This helped me set up the checkout flow.",
    timestamp: "2 days ago",
    isAuthor: false,
  },
  {
    id: 2,
    author: { name: "Sarah Wilson", avatar: "SW" },
    content: "Can you add a section about handling webhooks?",
    timestamp: "1 day ago",
    isAuthor: false,
  },
  {
    id: 3,
    author: { name: "John Doe", avatar: "JD" },
    content: "Good suggestion Sarah, I'll add that this week.",
    timestamp: "5 hours ago",
    isAuthor: true,
  },
];

export function DocumentViewPage() {
  const [comments, setComments] = useState(initialComments);

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <Breadcrumbs path={[...document.path, document.title]} />

      {/* Document header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">{document.title}</h1>
        {document.isOwner && (
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {/* Metadata bar */}
      <MetadataBar
        createdBy={document.createdBy}
        modifiedBy={document.modifiedBy}
        updatedAt={document.updatedAt}
        views={document.views}
        commentCount={comments.length}
      />

      {/* Markdown content */}
      <div className="mt-8">
        <MarkdownRenderer content={document.content} />
      </div>

      {/* Comments section */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <CommentsSection comments={comments} />
      </div>
    </div>
  );
}
