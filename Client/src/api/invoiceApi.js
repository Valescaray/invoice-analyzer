import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = window.env?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Invoice', 'Dashboard'],
  endpoints: (builder) => ({
    // Get all invoices
    getInvoices: builder.query({
      query: ({ page = 1, per_page = 20, user_id } = {}) => {
        const params = new URLSearchParams({ 
          page: page.toString(), 
          per_page: per_page.toString() 
        });
        if (user_id) params.append('user_id', user_id);
        return `/api/invoices?${params.toString()}`;
      },
      transformResponse: (response) => {
        // Transform backend response to match frontend expectations
        return {
          ...response,
          invoices: response.invoices || []
        };
      },
      providesTags: ['Invoice'],
    }),
    
    // Get single invoice by ID
    getInvoiceById: builder.query({
      query: (invoiceId) => `/api/invoices/${invoiceId}`,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),
    
    // Upload file (step 1)
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: '/api/upload',
        method: 'POST',
        body: formData,
      }),
    }),
    
    // Analyze uploaded invoice (step 2 - can use file or file_id)
    analyzeInvoice: builder.mutation({
      query: (formData) => ({
        url: '/api/analyze',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Invoice', 'Dashboard'],
    }),
    
    // Delete invoice
    deleteInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: `/api/invoices/${invoiceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invoice', 'Dashboard'],
    }),
    
    // Get dashboard statistics
    getDashboardStats: builder.query({
      query: ({ user_id } = {}) => {
        const params = user_id ? `?user_id=${user_id}` : '';
        return `/api/dashboard/stats${params}`;
      },
      transformResponse: (response) => {
        // Transform backend field names to match frontend expectations
        return {
          total_invoices: response.total_invoices || 0,
          total_expenses: response.total_expenses || 0,
          top_vendors: (response.top_vendors || []).map(vendor => ({
            name: vendor.vendor_name,
            count: vendor.count,
            total: vendor.sum
          })),
          expenses_by_currency: (response.expenses_by_currency || []).map(item => ({
            currency: item.currency,
            total: item.sum
          }))
        };
      },
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useUploadFileMutation,
  useAnalyzeInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetDashboardStatsQuery,
} = invoiceApi;