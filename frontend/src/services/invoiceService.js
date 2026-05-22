import axios from '@/lib/axios';

export const invoiceService = {
    getInvoices: async (page = 1, limit = 1000) => {
        return axios.get('/transactions', {
            params: {
                page,
                limit,
            },
        });
    },

    getInvoiceById: async (id) => {
        return axios.get(`/transactions/${id}`);
    },

    createInvoice: async (data) => {
        return axios.post('/transactions', data);
    },

    updateInvoice: async (id, data) => {
        return axios.put(`/transactions/${id}`, data);
    },

    deleteInvoice: async (id) => {
        return axios.delete(`/transactions/${id}`);
    },
};
