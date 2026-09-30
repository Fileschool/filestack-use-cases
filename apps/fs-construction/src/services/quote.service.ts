import { IQuoteRequest, ICreateQuoteDTO, IUpdateQuoteDTO, IQuoteFilterParams, IQuoteResponse } from '@/interfaces/quote.interface';
import { INITIAL_DEMO_QUOTES } from '@/lib/constants';

class QuoteService {
  private STORAGE_KEY = 'apexcad_quotes_v1';

  private getStoredQuotes(): IQuoteRequest[] {
    if (typeof window === 'undefined') return INITIAL_DEMO_QUOTES;
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(INITIAL_DEMO_QUOTES));
        return INITIAL_DEMO_QUOTES;
      }
      return JSON.parse(data) as IQuoteRequest[];
    } catch {
      return INITIAL_DEMO_QUOTES;
    }
  }

  private saveQuotes(quotes: IQuoteRequest[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(quotes));
    } catch (e) {
      console.error('Failed to persist quotes to localStorage:', e);
    }
  }

  async getQuotes(params?: IQuoteFilterParams): Promise<IQuoteRequest[]> {
    let quotes = this.getStoredQuotes();

    if (params?.status && params.status !== 'all') {
      quotes = quotes.filter((q) => q.status === params.status);
    }

    if (params?.projectType && params.projectType !== 'all') {
      quotes = quotes.filter((q) => q.projectType === params.projectType);
    }

    if (params?.search) {
      const query = params.search.toLowerCase();
      quotes = quotes.filter(
        (q) =>
          q.projectName.toLowerCase().includes(query) ||
          q.clientName.toLowerCase().includes(query) ||
          q.companyName?.toLowerCase().includes(query) ||
          q.location.toLowerCase().includes(query)
      );
    }

    // Return sorted by recent
    return quotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getQuoteById(id: string): Promise<IQuoteRequest | null> {
    const quotes = this.getStoredQuotes();
    return quotes.find((q) => q.id === id) || null;
  }

  async createQuote(dto: ICreateQuoteDTO): Promise<IQuoteRequest> {
    const quotes = this.getStoredQuotes();
    const newQuote: IQuoteRequest = {
      ...dto,
      id: `q-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newQuote, ...quotes];
    this.saveQuotes(updated);
    return newQuote;
  }

  async updateQuote(id: string, dto: IUpdateQuoteDTO): Promise<IQuoteRequest> {
    const quotes = this.getStoredQuotes();
    const index = quotes.findIndex((q) => q.id === id);

    if (index === -1) {
      throw new Error(`Quote with ID ${id} not found.`);
    }

    const updatedQuote: IQuoteRequest = {
      ...quotes[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    quotes[index] = updatedQuote;
    this.saveQuotes(quotes);
    return updatedQuote;
  }

  async respondToQuote(id: string, response: IQuoteResponse): Promise<IQuoteRequest> {
    return this.updateQuote(id, {
      response,
      status: 'quote_sent',
    });
  }

  async deleteQuote(id: string): Promise<void> {
    const quotes = this.getStoredQuotes();
    const filtered = quotes.filter((q) => q.id !== id);
    this.saveQuotes(filtered);
  }
}

export const quoteService = new QuoteService();
