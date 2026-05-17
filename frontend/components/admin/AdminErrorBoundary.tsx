"use client"

import React from 'react'
import { Button } from '@/components/ui/button'

export class AdminErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; message: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message || 'Something went wrong in the admin panel.' }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Admin panel render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="p-6 lg:p-8">
          <div className="rounded-[2rem] border border-red-200 bg-white p-8 shadow-sm">
            <div className="inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700 ring-1 ring-red-100">Admin page error</div>
            <h1 className="mt-4 text-3xl font-black text-slate-900">This section could not load.</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">{this.state.message}</p>
            <Button className="mt-5 rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => this.setState({ hasError: false, message: '' })}>Try again</Button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
