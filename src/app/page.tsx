'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  getCustomers, 
  createCustomer, 
  deleteCustomer,
  type DemoCustomer 
} from './server/interview'
import { Trash2, UserPlus, Loader2, DollarSign, Calendar } from 'lucide-react'

export default function CustomerDashboard() {
  const [customers, setCustomers] = useState<DemoCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Fetch data on initial load
  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error("Failed to load customers")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const payload = {
      name: formData.get('name') as string,
      balance: formData.get('balance') as string,
      balanceAge: Number(formData.get('balanceAge')),
    }

    try {
      const updatedList = await createCustomer(payload)
      setCustomers(updatedList)
      form.reset()
    } catch (error) {
      alert("Error adding customer. Check your API key and network.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return
    
    try {
      const updatedList = await deleteCustomer(id)
      setCustomers(updatedList)
    } catch (error) {
      alert("Failed to delete customer")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="font-medium">Loading records...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Customer Management</h1>
          <p className="text-slate-500">Create and manage client balance records.</p>
        </div>

        {/* CREATE FORM CARD */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus size={20} className="text-blue-600" /> Add New Entry
          </h2>
          <form ref={formRef} onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              name="name" 
              placeholder="Customer Name" 
              className="border border-slate-300 p-2 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
            <div className="relative">
              <span className="absolute left-2 top-2.5 text-slate-400 text-sm">$</span>
              <input 
                name="balance" 
                type="number" 
                step="0.01" 
                min="0"
                placeholder="0.00" 
                className="w-full border border-slate-300 p-2 pl-5 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" 
                required 
              />
            </div>
            <input 
              name="balanceAge" 
              type="number" 
              placeholder="Age (Days)" 
              className="border border-slate-300 p-2 rounded-md bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Record'}
            </button>
          </form>
        </section>

        {/* DATA TABLE CONTAINER */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">Client Name</th>
                  <th className="p-4 font-semibold text-slate-600">Balance</th>
                  <th className="p-4 font-semibold text-slate-600">Days Active</th>
                  <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{customer.name}</td>
                    <td className="p-4 font-mono text-slate-700">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-slate-400" />
                        {parseFloat(customer.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {customer.balanceAge}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(customer.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete customer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {customers.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-400 italic">No customer data found. Start by adding one above.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}