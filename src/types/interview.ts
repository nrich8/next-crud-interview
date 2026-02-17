export interface DemoCustomer {
  id: string
  name: string
  balance: string
  balanceAge: number
  createdAt: number
  updatedAt: number
}

export interface CreateCustomerInput {
  name: string
  balance: string
  balanceAge: number
}

export interface UpdateCustomerInput {
  name: string
  balance: string
  balanceAge: number
}

export interface DeleteCustomersResponse {
  success: boolean
  customers: DemoCustomer[]
}

export type CustomersList = DemoCustomer[]

export default undefined
