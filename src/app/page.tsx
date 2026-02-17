'use client'

import { useState, useEffect } from 'react'
import { 
  getCustomers, 
  createCustomer, 
  deleteCustomer,
  updateCustomer,
  type DemoCustomer 
} from './server/interview'
import { Trash2, UserPlus, Loader2, DollarSign, Calendar, Edit2, Check, X } from 'lucide-react'

export default function CustomerDashboard() {
  const [customers, setCustomers] = useState<DemoCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // States for Editing
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<DemoCustomer>>({})

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const data = await getCustomers()
      setCustomers(data)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      const updatedList = await createCustomer({
        name: formData.get('name') as string,
        balance: formData.get('balance') as string,
        balanceAge: Number(formData.get('balanceAge')),
      })
      setCustomers(updatedList)
      form.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEdit = (customer: DemoCustomer) => {
    setEditingId(customer.id)
    setEditForm(customer)
  }

  const handleSaveUpdate = async (id: string) => {
    try {
      const updatedList = await updateCustomer(id, {
        name: editForm.name!,
        balance: editForm.balance!,
        balanceAge: Number(editForm.balanceAge),
      })
      setCustomers(updatedList)
      setEditingId(null)
    } catch (error) {
      alert("Failed to update")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer?")) return
    const updatedList = await deleteCustomer(id)
    setCustomers(updatedList)
  }

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" /></div>

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header>
          <h1 className="text-3xl font-extrabold text-slate-900">Customer Management</h1>
          <p className="text-slate-500">Full CRUD interface for customer balance records.</p>
        </header>

        {/* ADD CUSTOMER FORM */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input name="name" placeholder="Name" className="border p-2 rounded-md bg-white text-slate-900" required />
            <input name="balance" type="number" step="0.01" placeholder="Balance" className="border p-2 rounded-md bg-white text-slate-900" required />
            <input name="balanceAge" type="number" placeholder="Age" className="border p-2 rounded-md bg-white text-slate-900" required />
            <button disabled={isSubmitting} className="bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 disabled:bg-blue-300">
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Add Customer'}
            </button>
          </form>
        </section>

        {/* TABLE */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-slate-600">Name</th>
                  <th className="p-4 text-slate-600">Balance</th>
                  <th className="p-4 text-slate-600">Age</th>
                  <th className="p-4 text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-slate-50">
                    {editingId === c.id ? (
                      <>
                        <td className="p-4"><input className="border p-1 rounded w-full bg-white text-slate-900" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                        <td className="p-4"><input type="number" step="0.01" className="border p-1 rounded w-full bg-white text-slate-900" value={editForm.balance} onChange={e => setEditForm({...editForm, balance: e.target.value})} /></td>
                        <td className="p-4"><input type="number" className="border p-1 rounded w-full bg-white text-slate-900" value={editForm.balanceAge} onChange={e => setEditForm({...editForm, balanceAge: Number(e.target.value)})} /></td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleSaveUpdate(c.id)} className="text-green-600 hover:bg-green-50 p-2 rounded"><Check size={20}/></button>
                          <button onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-50 p-2 rounded"><X size={20}/></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4 font-medium">{c.name}</td>
                        <td className="p-4 font-mono text-slate-600">${parseFloat(c.balance).toFixed(2)}</td>
                        <td className="p-4 text-slate-600">{c.balanceAge} days</td>
                        <td className="p-4 text-right space-x-1">
                          <button onClick={() => startEdit(c)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 size={18} /></button>
                          <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}