'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Icon from '@/components/ui/AppIcon';
import {
  createAddress,
  getAddresses,
  getApiMessage,
  getCities,
  getStates,
  lookupPincode,
  setDefaultAddress,
  updateAddress,
} from '@/lib/api/checkoutApi';
import { Address, AddressPayload, CityOption, StateOption } from '@/types/checkout';
import { useCartStore } from '@/store/cartStore';

type AddressFormState = {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  postalCode: string;
  stateId: string;
  cityId: string;
  isDefault: boolean;
};

const emptyAddressForm: AddressFormState = {
  label: '',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  postalCode: '',
  stateId: '',
  cityId: '',
  isDefault: false,
};

function toAddressForm(address: Address): AddressFormState {
  return {
    label: address.label || '',
    fullName: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2 || '',
    postalCode: address.postalCode,
    stateId: String(address.stateId),
    cityId: String(address.cityId),
    isDefault: address.isDefault,
  };
}

function addressPayload(form: AddressFormState): AddressPayload {
  return {
    label: form.label.trim() || undefined,
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    line1: form.line1.trim(),
    line2: form.line2.trim() || undefined,
    stateId: Number(form.stateId),
    cityId: Number(form.cityId),
    postalCode: form.postalCode.trim(),
    country: 'India',
    isDefault: form.isDefault,
  };
}

function needsAuth(errorMessage: string): boolean {
  return /unauthorized|jwt|token/i.test(errorMessage);
}

const CheckoutInteractive = () => {
  const router = useRouter();
  const { fetchCart } = useCartStore();
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [form, setForm] = useState<AddressFormState>(emptyAddressForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddressFormState, string>>>({});
  const [pincodeStatus, setPincodeStatus] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState<number | null>(null);

  const loadAddresses = useCallback(async () => {
    const res = await getAddresses();
    if (!res.status) {
      throw new Error(res.message);
    }

    setAddresses(res.data);
    const defaultAddress = res.data.find((address) => address.isDefault) || res.data[0] || null;
    setSelectedAddressId((current) => {
      if (current && res.data.some((address) => address.id === current)) return current;
      return defaultAddress?.id || null;
    });
    setFormOpen(res.data.length === 0);
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in before checkout');
      router.push('/login?redirect=/checkout-process');
      return;
    }

    let isMounted = true;
    async function loadCheckout() {
      setLoading(true);
      try {
        const [statesRes] = await Promise.all([getStates(), loadAddresses(), fetchCart()]);
        if (!isMounted) return;

        if (!statesRes.status) {
          throw new Error(statesRes.message);
        }
        setStates(statesRes.data);
      } catch (error) {
        const message = getApiMessage(error, 'Failed to load checkout');
        if (needsAuth(message)) {
          toast.error('Please sign in before checkout');
          router.push('/login?redirect=/checkout-process');
          return;
        }
        toast.error(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCheckout();

    return () => {
      isMounted = false;
    };
  }, [fetchCart, hydrated, loadAddresses, router]);

  useEffect(() => {
    if (!form.stateId) {
      setCities([]);
      return;
    }

    let isMounted = true;
    async function loadCities() {
      try {
        const res = await getCities(Number(form.stateId));
        if (!isMounted) return;
        if (res.status) {
          setCities(res.data);
        } else {
          setCities([]);
          toast.error(res.message);
        }
      } catch (error) {
        if (isMounted) toast.error(getApiMessage(error, 'Failed to load cities'));
      }
    }

    loadCities();

    return () => {
      isMounted = false;
    };
  }, [form.stateId]);

  const setField = (field: keyof AddressFormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateAddress = (): boolean => {
    const errors: Partial<Record<keyof AddressFormState, string>> = {};
    if (!form.fullName.trim()) errors.fullName = 'Full name is required';
    if (!form.phone.trim()) errors.phone = 'Phone is required';
    if (form.phone.trim() && !/^[0-9+\-\s()]{8,20}$/.test(form.phone.trim())) {
      errors.phone = 'Enter a valid phone number';
    }
    if (!form.line1.trim()) errors.line1 = 'Street address is required';
    if (!/^\d{6}$/.test(form.postalCode.trim())) {
      errors.postalCode = 'Enter a valid 6-digit PIN code';
    }
    if (!form.stateId) errors.stateId = 'State is required';
    if (!form.cityId) errors.cityId = 'City is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setForm({ ...emptyAddressForm, isDefault: addresses.length === 0 });
    setFormErrors({});
    setPincodeStatus('');
    setFormOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setForm(toAddressForm(address));
    setFormErrors({});
    setPincodeStatus('');
    setFormOpen(true);
  };

  const handlePostalCodeChange = async (value: string) => {
    const pincode = value.replace(/\D/g, '').slice(0, 6);
    setField('postalCode', pincode);
    setPincodeStatus('');

    if (pincode.length !== 6) return;

    try {
      const res = await lookupPincode(pincode);
      if (res.status && res.data) {
        setForm((current) => ({
          ...current,
          postalCode: pincode,
          stateId: String(res.data!.stateId),
          cityId: String(res.data!.cityId),
        }));
        setPincodeStatus(`Matched ${res.data.cityName}, ${res.data.stateName}`);
      } else {
        setPincodeStatus('PIN not found. Pick state and city manually.');
      }
    } catch {
      setPincodeStatus('PIN not found. Pick state and city manually.');
    }
  };

  const handleSubmitAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateAddress()) return;

    setIsSavingAddress(true);
    try {
      const payload = addressPayload(form);
      const res = editingAddressId
        ? await updateAddress(editingAddressId, payload)
        : await createAddress(payload);

      if (!res.status) {
        throw new Error(res.message);
      }

      toast.success(editingAddressId ? 'Address updated' : 'Address saved');
      setFormOpen(false);
      setEditingAddressId(null);
      await loadAddresses();
      setSelectedAddressId(res.data.id);
    } catch (error) {
      toast.error(getApiMessage(error, 'Failed to save address'));
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    setIsSettingDefault(id);
    try {
      const res = await setDefaultAddress(id);
      if (!res.status) throw new Error(res.message);
      toast.success('Default address updated');
      await loadAddresses();
      setSelectedAddressId(id);
    } catch (error) {
      toast.error(getApiMessage(error, 'Failed to update default address'));
    } finally {
      setIsSettingDefault(null);
    }
  };

  const handleContinueToSummary = () => {
    if (!selectedAddressId) {
      toast.error('Select a delivery address');
      return;
    }

    router.push(`/checkout-process/summary?addressId=${selectedAddressId}`);
  };

  if (!hydrated || loading) {
    return (
      <div className="space-y-4">
        <div className="h-44 rounded-md bg-muted animate-pulse" />
        <div className="h-72 rounded-md bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="bg-card border border-border rounded-md p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Delivery Address</h2>
            <p className="text-sm text-muted-foreground">
              Choose a saved address or add a new Indian delivery address.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAddressForm}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-foreground hover:bg-muted transition-luxe"
          >
            <Icon name="PlusIcon" size={18} />
            Add Address
          </button>
        </div>

        {addresses.length > 0 ? (
          <div className="space-y-3">
            {addresses.map((address) => {
              const isSelected = selectedAddressId === address.id;
              return (
                <label
                  key={address.id}
                  className={`block cursor-pointer rounded-md border p-4 transition-luxe ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="address"
                      checked={isSelected}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1 h-4 w-4 text-primary focus:ring-ring"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-foreground">{address.fullName}</p>
                        {address.label && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {address.label}
                          </span>
                        )}
                        {address.isDefault && (
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            handleEditAddress(address);
                          }}
                          className="font-medium text-primary hover:text-primary/80"
                        >
                          Edit
                        </button>
                        {!address.isDefault && (
                          <button
                            type="button"
                            disabled={isSettingDefault === address.id}
                            onClick={(event) => {
                              event.preventDefault();
                              handleSetDefault(address.id);
                            }}
                            className="font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            {isSettingDefault === address.id ? 'Saving...' : 'Set default'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border p-5 text-sm text-muted-foreground">
            No saved addresses yet. Add one to continue to order summary.
          </div>
        )}
      </section>

      {formOpen && (
        <section className="bg-card border border-border rounded-md p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {editingAddressId ? 'Edit Address' : 'Add Address'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter the PIN first to auto-fill state and city where available.
              </p>
            </div>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitAddress} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                id="label"
                label="Label"
                value={form.label}
                onChange={(value) => setField('label', value)}
                placeholder="Home"
                error={formErrors.label}
              />
              <Field
                id="fullName"
                label="Full Name"
                value={form.fullName}
                onChange={(value) => setField('fullName', value)}
                placeholder="Suhail Husain"
                error={formErrors.fullName}
                required
              />
              <Field
                id="phone"
                label="Phone"
                value={form.phone}
                onChange={(value) => setField('phone', value)}
                placeholder="9876543210"
                error={formErrors.phone}
                required
              />
              <div>
                <Field
                  id="postalCode"
                  label="PIN Code"
                  value={form.postalCode}
                  onChange={handlePostalCodeChange}
                  placeholder="110001"
                  error={formErrors.postalCode}
                  required
                />
                {pincodeStatus && (
                  <p className="mt-1 text-xs text-muted-foreground">{pincodeStatus}</p>
                )}
              </div>
            </div>

            <Field
              id="line1"
              label="Street / Building"
              value={form.line1}
              onChange={(value) => setField('line1', value)}
              placeholder="123 Main Street"
              error={formErrors.line1}
              required
            />
            <Field
              id="line2"
              label="Flat / Floor"
              value={form.line2}
              onChange={(value) => setField('line2', value)}
              placeholder="Flat 4B"
              error={formErrors.line2}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                id="stateId"
                label="State"
                value={form.stateId}
                onChange={(value) => {
                  setForm((current) => ({ ...current, stateId: value, cityId: '' }));
                  setFormErrors((current) => ({ ...current, stateId: undefined }));
                }}
                error={formErrors.stateId}
                required
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                id="cityId"
                label="City"
                value={form.cityId}
                onChange={(value) => setField('cityId', value)}
                error={formErrors.cityId}
                required
                disabled={!form.stateId}
              >
                <option value="">{form.stateId ? 'Select city' : 'Select state first'}</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </SelectField>
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) => setField('isDefault', event.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
              />
              Make this my default address
            </label>

            <button
              type="submit"
              disabled={isSavingAddress}
              className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary px-6 font-medium text-primary-foreground hover:scale-102 hover:shadow-warm-md transition-luxe disabled:opacity-60 disabled:hover:scale-100"
            >
              {isSavingAddress ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
              <Icon name="CheckIcon" size={18} />
            </button>
          </form>
        </section>
      )}

      <section className="bg-card border border-border rounded-md p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Review before payment
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You will see item availability, delivery address, order notes, and totals next.
            </p>
          </div>
          <button
            type="button"
            onClick={handleContinueToSummary}
            disabled={!selectedAddressId}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 font-medium text-primary-foreground hover:scale-102 hover:shadow-warm-md transition-luxe disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            Continue to Order Summary
            <Icon name="ArrowRightIcon" size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

function Field({ id, label, value, onChange, placeholder, error, required }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-md border bg-input px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe ${
          error ? 'border-error' : 'border-border'
        }`}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

function SelectField({
  id,
  label,
  value,
  onChange,
  children,
  error,
  required,
  disabled,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={`h-11 w-full rounded-md border bg-input px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-luxe disabled:opacity-60 ${
          error ? 'border-error' : 'border-border'
        }`}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}

export default CheckoutInteractive;
