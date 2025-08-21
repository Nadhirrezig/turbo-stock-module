import { Supplier, CreateSupplierData, PaginatedResponse, BaseFilters } from '@/lib/types';
import { apiClient, ServiceError } from './client';
import { API_CONFIG, simulateApiDelay, simulateApiError, getCurrentTimestamp, generateId } from './config';
import { mockSuppliers } from '@/lib/mock-data';
import { filterBySearch, sortItems, paginateItems } from '@/lib/utils';

class SuppliersService {
  private readonly endpoint = '/suppliers';
  private mockData: Supplier[] = [...mockSuppliers];

  async getAll(filters: BaseFilters = {}): Promise<PaginatedResponse<Supplier>> {
    if (API_CONFIG.useMockData) {
      return this.getAllMock(filters);
    }

    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.per_page) queryParams.append('per_page', filters.per_page.toString());
      if (filters.sort_field) queryParams.append('sort_field', filters.sort_field);
      if (filters.sort_direction) queryParams.append('sort_direction', filters.sort_direction);

      const response = await apiClient.get<PaginatedResponse<Supplier>>(
        `${this.endpoint}?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      throw new ServiceError(
        `Failed to fetch suppliers: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500,
        'FETCH_SUPPLIERS_ERROR'
      );
    }
  }

  async getById(id: string): Promise<Supplier> {
    if (API_CONFIG.useMockData) {
      return this.getByIdMock(id);
    }

    try {
      const response = await apiClient.get<Supplier>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw new ServiceError(
        `Failed to fetch supplier: ${error instanceof Error ? error.message : 'Unknown error'}`,
        404,
        'SUPPLIER_NOT_FOUND'
      );
    }
  }

  async create(data: CreateSupplierData): Promise<Supplier> {
    if (API_CONFIG.useMockData) {
      return this.createMock(data);
    }

    try {
      const response = await apiClient.post<Supplier>(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw new ServiceError(
        `Failed to create supplier: ${error instanceof Error ? error.message : 'Unknown error'}`,
        400,
        'CREATE_SUPPLIER_ERROR'
      );
    }
  }

  async update(id: string, data: CreateSupplierData): Promise<Supplier> {
    if (API_CONFIG.useMockData) {
      return this.updateMock(id, data);
    }

    try {
      const response = await apiClient.put<Supplier>(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new ServiceError(
        `Failed to update supplier: ${error instanceof Error ? error.message : 'Unknown error'}`,
        400,
        'UPDATE_SUPPLIER_ERROR'
      );
    }
  }

  async delete(id: string): Promise<void> {
    if (API_CONFIG.useMockData) {
      return this.deleteMock(id);
    }

    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw new ServiceError(
        `Failed to delete supplier: ${error instanceof Error ? error.message : 'Unknown error'}`,
        400,
        'DELETE_SUPPLIER_ERROR'
      );
    }
  }

  private async getAllMock(filters: BaseFilters = {}): Promise<PaginatedResponse<Supplier>> {
    await simulateApiDelay();
    simulateApiError();

    let filtered = [...this.mockData];

    if (filters.search) {
      filtered = filterBySearch(filtered, filters.search, ['name', 'email', 'phone', 'address', 'description']);
    }

    if (filters.sort_field && filters.sort_direction) {
      filtered = sortItems(filtered, filters.sort_field as keyof Supplier, filters.sort_direction);
    }

    return paginateItems(filtered, filters.page || 1, filters.per_page || 10);
  }

  private async getByIdMock(id: string): Promise<Supplier> {
    await simulateApiDelay();
    simulateApiError();

    const supplier = this.mockData.find(s => s.id === id);
    if (!supplier) {
      throw new ServiceError('Supplier not found', 404, 'SUPPLIER_NOT_FOUND');
    }
    return supplier;
  }

  private async createMock(data: CreateSupplierData): Promise<Supplier> {
    await simulateApiDelay();
    simulateApiError();

    const newSupplier: Supplier = {
      id: generateId(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      description: data.description,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    };

    this.mockData.unshift(newSupplier);
    return newSupplier;
  }

  private async updateMock(id: string, data: CreateSupplierData): Promise<Supplier> {
    await simulateApiDelay();
    simulateApiError();

    const index = this.mockData.findIndex(s => s.id === id);
    if (index === -1) {
      throw new ServiceError('Supplier not found', 404, 'SUPPLIER_NOT_FOUND');
    }

    const updated: Supplier = {
      ...this.mockData[index],
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      description: data.description,
      updated_at: getCurrentTimestamp(),
    };

    this.mockData[index] = updated;
    return updated;
  }

  private async deleteMock(id: string): Promise<void> {
    await simulateApiDelay();
    simulateApiError();

    const index = this.mockData.findIndex(s => s.id === id);
    if (index === -1) {
      throw new ServiceError('Supplier not found', 404, 'SUPPLIER_NOT_FOUND');
    }

    this.mockData.splice(index, 1);
  }

  resetMockData(): void {
    this.mockData = [...mockSuppliers];
  }
}

export const suppliersService = new SuppliersService();
export { SuppliersService };


