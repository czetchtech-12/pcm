"use client"

import { AdminResourcePage } from '@/components/admin/AdminResourcePage'

const fields: any[] = [
  { name: 'donor_name', label: 'Donor Name', type: 'text' },
  { name: 'donor_email', label: 'Donor Email', type: 'email' },
  { name: 'donor_phone', label: 'Donor Phone', type: 'tel' },
  { name: 'amount', label: 'Amount', type: 'number' },
  { name: 'type', label: 'Type', type: 'select', options: ['monthly', 'one_time', 'event_sponsorship', 'student_support'] },
  { name: 'purpose', label: 'Purpose', type: 'text' },
  { name: 'payment_provider', label: 'Payment Provider', type: 'select', options: ['manual', 'mtn_mobile_money', 'airtel_money', 'zamtel_money', 'bank_transfer', 'flutterwave', 'paypal', 'dpo_pay'] },
  { name: 'transaction_reference', label: 'Transaction Reference', type: 'text' },
  { name: 'status', label: 'Verification Status', type: 'select', options: ['pending', 'completed', 'failed'] },
  { name: 'admin_note', label: 'Admin Note', type: 'textarea' }
]

const filters: any[] = [
  { name: 'status', label: 'status', options: ['pending', 'completed', 'failed'] },
  { name: 'payment_provider', label: 'method', options: ['manual', 'mtn_mobile_money', 'airtel_money', 'zamtel_money', 'bank_transfer', 'flutterwave', 'paypal', 'dpo_pay'] }
]

export default function Page() {
  return <AdminResourcePage title="Giving Records" description="Verify giving records manually. Public users can only submit pending records; only admins can mark them completed after payment confirmation." endpoint="/forms/donations" fields={fields as any} columns={['donor_name', 'donor_phone', 'amount', 'payment_provider', 'transaction_reference', 'purpose', 'status']} filters={filters as any} readOnlyCreate={true} allowDelete={false} />
}
