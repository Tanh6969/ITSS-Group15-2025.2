import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '@/services/invoiceService';

export const useInvoices = (page = 1, limit = 1000) => {
    return useQuery({
        queryKey: ['invoices', page, limit],
        queryFn: () => invoiceService.getInvoices(page, limit),
    });
};

export const useInvoiceById = (id) => {
    return useQuery({
        queryKey: ['invoices', id],
        queryFn: () => invoiceService.getInvoiceById(id),
        enabled: !!id,
    });
};
