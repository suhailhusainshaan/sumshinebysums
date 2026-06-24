'use client';

import { useEffect, useState } from 'react';
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
  updateAddress,
} from '@/lib/api/checkoutApi';
import { Address, AddressPayload, CityOption, StateOption } from '@/types/checkout';

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

function toForm(address: Address): AddressFormState {
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

function toPayload(form: AddressFormState): AddressPayload {
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

function isAuthError(message: string): boolean {
  return /unauthorized|jwt|token/i.test(message);
}

interface AddressEditorProps {
  addressId?: number;
}

export default function AddressEditor({ addressId }: AddressEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [form, setForm] = useState<AddressFormState>(emptyAddressForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormState, string>>>({});
  const [pincodeStatus, setPincodeStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(addressId);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to manage addresses');
      router.push(
        `/login?redirect=${encodeURIComponent(
          addressId ? `/account/addresses/${addressId}/edit` : '/account/addresses/new'
        )}`
      );
      return;
    }

    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const [statesRes, addressesRes] = await Promise.all([getStates(), getAddresses()]);
        if (!isMounted) return;
        if (!statesRes.status) throw new Error(statesRes.message);
        if (!addressesRes.status) throw new Error(addressesRes.message);

        setStates(statesRes.data);

        if (addressId) {
          const address = addressesRes.data.find((item) => item.id === addressId);
          if (!address) {
            toast.error('Address not found');
            router.push('/account/addresses');
            return;
          }
          setForm(toForm(address));
        } else {
          setForm({ ...emptyAddressForm, isDefault: addressesRes.data.length === 0 });
        }
      } catch (error) {
        const message = getApiMessage(error, 'Failed to load address form');
        if (isAuthError(message)) {
          toast.error('Please sign in to manage addresses');
          router.push('/login?redirect=/account/addresses');
          return;
        }
        toast.error(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [addressId, router]);

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
        setCities(res.status ? res.data : []);
        if (!res.status) toast.error(res.message);
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
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof AddressFormState, string>> = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required';
    if (!form.phone.trim()) nextErrors.phone = 'Phone is required';
    if (form.phone.trim() && !/^[0-9+\-\s()]{8,20}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Enter a valid phone number';
    }
    if (!form.line1.trim()) nextErrors.line1 = 'Street address is required';
    if (!/^\d{6}$/.test(form.postalCode.trim())) {
      nextErrors.postalCode = 'Enter a valid 6-digit PIN code';
    }
    if (!form.stateId) nextErrors.stateId = 'State is required';
    if (!form.cityId) nextErrors.cityId = 'City is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = toPayload(form);
      const res = addressId
        ? await updateAddress(addressId, payload)
        : await createAddress(payload);

      if (!res.status) throw new Error(res.message);

      toast.success(isEditing ? 'Address updated' : 'Address added');
      router.push('/account/addresses');
    } catch (error) {
      toast.error(getApiMessage(error, 'Failed to save address'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-[620px] rounded-md bg-muted animate-pulse" />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-md p-5 shadow-warm"
    >
      <div className="mb-5">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {isEditing ? 'Edit Address' : 'Add Address'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use a 6-digit PIN to auto-fill city and state where available.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          id="label"
          label="Label"
          value={form.label}
          onChange={(value) => setField('label', value)}
          placeholder="Home"
          error={errors.label}
        />
        <Field
          id="fullName"
          label="Full Name"
          value={form.fullName}
          onChange={(value) => setField('fullName', value)}
          placeholder="Suhail Husain"
          error={errors.fullName}
          required
        />
        <Field
          id="phone"
          label="Phone"
          value={form.phone}
          onChange={(value) => setField('phone', value)}
          placeholder="9876543210"
          error={errors.phone}
          required
        />
        <div>
          <Field
            id="postalCode"
            label="PIN Code"
            value={form.postalCode}
            onChange={handlePostalCodeChange}
            placeholder="110001"
            error={errors.postalCode}
            required
          />
          {pincodeStatus && <p className="mt-1 text-xs text-muted-foreground">{pincodeStatus}</p>}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <Field
          id="line1"
          label="Street / Building"
          value={form.line1}
          onChange={(value) => setField('line1', value)}
          placeholder="123 Main Street"
          error={errors.line1}
          required
        />
        <Field
          id="line2"
          label="Flat / Floor"
          value={form.line2}
          onChange={(value) => setField('line2', value)}
          placeholder="Flat 4B"
          error={errors.line2}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          id="stateId"
          label="State"
          value={form.stateId}
          onChange={(value) => {
            setForm((current) => ({ ...current, stateId: value, cityId: '' }));
            setErrors((current) => ({ ...current, stateId: undefined }));
          }}
          error={errors.stateId}
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
          error={errors.cityId}
          disabled={!form.stateId}
          required
        >
          <option value="">{form.stateId ? 'Select city' : 'Select state first'}</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </SelectField>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(event) => setField('isDefault', event.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
        />
        Make this my default address
      </label>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 font-medium text-primary-foreground hover:scale-102 hover:shadow-warm-md transition-luxe disabled:opacity-60 disabled:hover:scale-100"
        >
          {saving ? 'Saving...' : isEditing ? 'Update Address' : 'Save Address'}
          <Icon name="CheckIcon" size={18} />
        </button>
        <button
          type="button"
          onClick={() => router.push('/account/addresses')}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-5 font-medium text-foreground hover:bg-muted transition-luxe"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

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
