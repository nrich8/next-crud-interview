"use server"
import axios from "axios"

const API_BASE_URL = "https://api.denaroai.com"
const API_KEY = process.env.INTERVIEW_KEY

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

// Write the functions here
// 1. GET ALL CUSTOMERS
export async function getCustomers(): Promise<DemoCustomer[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/interview/customers`, {
      headers: { 'interview-api-key': API_KEY }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

// 2. CREATE A NEW CUSTOMER
export async function createCustomer(input: CreateCustomerInput): Promise<DemoCustomer[]> {
  try {
    const response = await axios.post(`${API_BASE_URL}/interview/customers`, input, {
      headers: { 'interview-api-key': API_KEY }
    });
    // API returns the full updated list
    return response.data;
  } catch (error: any) {
    console.error("API Error Details:", error.response?.data || error.message);
    throw new Error("Failed to create customer");
  }
}

// 3. UPDATE AN EXISTING CUSTOMER
export async function updateCustomer(customerId: string, input: UpdateCustomerInput): Promise<DemoCustomer[]> {
  try {
    const response = await axios.post(`${API_BASE_URL}/interview/customers/${customerId}`, input, {
      headers: { 'interview-api-key': API_KEY }
    });
    // API returns the full updated list
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw new Error("Failed to update customer");
  }
}

// 4. DELETE A CUSTOMER
export async function deleteCustomer(customerId: string): Promise<DemoCustomer[]> {
  try {
    const response = await axios.delete(`${API_BASE_URL}/interview/customers/${customerId}`, {
      headers: { 'interview-api-key': API_KEY }
    });
    // API returns { success: true, customers: [...] }
    return response.data.customers;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw new Error("Failed to delete customer");
  }
}