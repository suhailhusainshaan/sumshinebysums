import axios from 'axios';
import api from '@/lib/axios';
import {
  Address,
  AddressPayload,
  ApiEnvelope,
  CheckoutOrder,
  CheckoutPreview,
  CityOption,
  PincodeLocation,
  StateOption,
} from '@/types/checkout';

export function getApiMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function getStates(): Promise<ApiEnvelope<StateOption[]>> {
  const res = await api.get<ApiEnvelope<StateOption[]>>('/locations/states');
  return res.data;
}

export async function getCities(stateId: number): Promise<ApiEnvelope<CityOption[]>> {
  const res = await api.get<ApiEnvelope<CityOption[]>>(`/locations/states/${stateId}/cities`);
  return res.data;
}

export async function lookupPincode(pincode: string): Promise<ApiEnvelope<PincodeLocation | null>> {
  const res = await api.get<ApiEnvelope<PincodeLocation | null>>(`/locations/pincode/${pincode}`);
  return res.data;
}

export async function getAddresses(): Promise<ApiEnvelope<Address[]>> {
  const res = await api.get<ApiEnvelope<Address[]>>('/addresses');
  return res.data;
}

export async function createAddress(payload: AddressPayload): Promise<ApiEnvelope<Address>> {
  const res = await api.post<ApiEnvelope<Address>>('/addresses', payload);
  return res.data;
}

export async function updateAddress(
  id: number,
  payload: AddressPayload
): Promise<ApiEnvelope<Address>> {
  const res = await api.put<ApiEnvelope<Address>>(`/addresses/${id}`, payload);
  return res.data;
}

export async function setDefaultAddress(id: number): Promise<ApiEnvelope<Address>> {
  const res = await api.patch<ApiEnvelope<Address>>(`/addresses/${id}/default`);
  return res.data;
}

export async function deleteAddress(id: number): Promise<ApiEnvelope<null>> {
  const res = await api.delete<ApiEnvelope<null>>(`/addresses/${id}`);
  return res.data;
}

export async function getCheckoutPreview(addressId: number): Promise<ApiEnvelope<CheckoutPreview>> {
  const res = await api.post<ApiEnvelope<CheckoutPreview>>('/checkout/preview', { addressId });
  return res.data;
}

export async function initiateCheckout(
  addressId: number,
  notes?: string
): Promise<ApiEnvelope<CheckoutOrder>> {
  const res = await api.post<ApiEnvelope<CheckoutOrder>>('/checkout/initiate', {
    addressId,
    notes: notes?.trim() || undefined,
  });
  return res.data;
}
