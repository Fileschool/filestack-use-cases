import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '@/services/quote.service';
import { useQuoteStore } from '@/store/quoteStore';
import {
  ICreateQuoteDTO,
  IQuoteFilterParams,
  IQuoteResponse,
  IUpdateQuoteDTO,
} from '@/interfaces/quote.interface';

export const quoteKeys = {
  all: ['quotes'] as const,
  lists: () => [...quoteKeys.all, 'list'] as const,
  list: (params?: IQuoteFilterParams) => [...quoteKeys.lists(), params] as const,
  details: () => [...quoteKeys.all, 'detail'] as const,
  detail: (id: string) => [...quoteKeys.details(), id] as const,
};

export const useQuotes = (params?: IQuoteFilterParams) => {
  const setQuotes = useQuoteStore((state) => state.setQuotes);

  return useQuery({
    queryKey: quoteKeys.list(params),
    queryFn: async () => {
      const data = await quoteService.getQuotes(params);
      setQuotes(data);
      return data;
    },
  });
};

export const useQuote = (id: string) => {
  return useQuery({
    queryKey: quoteKeys.detail(id),
    queryFn: () => quoteService.getQuoteById(id),
    enabled: Boolean(id),
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  const addQuote = useQuoteStore((state) => state.addQuote);

  return useMutation({
    mutationFn: (dto: ICreateQuoteDTO) => quoteService.createQuote(dto),
    onSuccess: (newQuote) => {
      addQuote(newQuote);
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() });
    },
  });
};

export const useUpdateQuote = () => {
  const queryClient = useQueryClient();
  const updateQuoteInStore = useQuoteStore((state) => state.updateQuoteInStore);

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: IUpdateQuoteDTO }) =>
      quoteService.updateQuote(id, dto),
    onSuccess: (updated) => {
      updateQuoteInStore(updated);
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quoteKeys.detail(updated.id) });
    },
  });
};

export const useRespondToQuote = () => {
  const queryClient = useQueryClient();
  const updateQuoteInStore = useQuoteStore((state) => state.updateQuoteInStore);

  return useMutation({
    mutationFn: ({ id, response }: { id: string; response: IQuoteResponse }) =>
      quoteService.respondToQuote(id, response),
    onSuccess: (updated) => {
      updateQuoteInStore(updated);
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quoteKeys.detail(updated.id) });
    },
  });
};

export const useDeleteQuote = () => {
  const queryClient = useQueryClient();
  const removeQuoteFromStore = useQuoteStore((state) => state.removeQuoteFromStore);

  return useMutation({
    mutationFn: (id: string) => quoteService.deleteQuote(id),
    onSuccess: (_, id) => {
      removeQuoteFromStore(id);
      queryClient.invalidateQueries({ queryKey: quoteKeys.lists() });
    },
  });
};
