"use client"

import { useEffect } from "react"

const XFeed = () => {
  useEffect(() => {
    // Load Taggbox script
    const script = document.createElement('script')
    script.src = "https://widget.taggbox.com/embed-lite.min.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent mb-4">
          Community Feed
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Stay updated with the latest F1Meme community posts and discussions.
        </p>
      </div>
      <div 
        className="taggbox w-full overflow-y-auto rounded-xl shadow-lg mb-12" 
        data-widget-id="2161822" 
        data-tags="false"
        style={{
          height: '600px',
          maxHeight: '70vh',
          minHeight: '400px',
          margin: '0 auto',
          background: 'rgba(0,0,0,0.15)'
        }}
      />
    </div>
  )
}

export default XFeed
