import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/$-locale/calc/$slug')({
  component: CalculatorPage,
})

function CalculatorPage() {
  const { slug } = Route.useParams()
  const [value, setValue] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 text-center">
      <h1 className="text-3xl font-bold mb-8">حاسبة {slug.replace(/-/g, ' ')} الفورية</h1>
      <input 
        type="number" 
        className="bg-slate-800 p-4 rounded-lg text-white w-full max-w-sm" 
        onChange={(e) => setValue(Number(e.target.value))} 
        placeholder="أدخل الكمية..."
      />
      <div className="mt-8 text-2xl font-bold text-green-400">القيمة: {value * 50} وحدة</div>
    </div>
  )
}
