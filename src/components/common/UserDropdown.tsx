'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { Dropdown } from '../admin/ui/dropdown/Dropdown';
import { DropdownItem } from '../admin/ui/dropdown/DropdownItem';
import useAuth from '@/hooks/useAuth';
import Icon from '@/components/ui/AppIcon';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  if (isLoading) {
    return <nav>Loading...</nav>; // Prevents flicker
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-foreground transition-luxe hover:text-primary dropdown-toggle"
      >
        <span className="mr-1 lg:mr-3 overflow-hidden rounded-full h-8 w-8 lg:h-11 lg:w-11 shrink-0">
          <Image
            width={44}
            height={44}
            src={
              user?.avatar
                ? `${process.env.NEXT_PUBLIC_IMG_URL}${user.avatar}`
                : '/images/user/owner.jpg'
            }
            alt="User"
            className="object-cover w-full h-full"
          />
        </span>

        <span className="hidden sm:block mr-1 font-medium text-theme-sm truncate max-w-[120px]">
          {user?.firstName} {user?.lastName}
        </span>

        <svg
          className={`hidden sm:block stroke-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-border bg-popover p-3 shadow-warm-lg backdrop-blur-xl"
      >
        <div>
          <span className="block font-medium text-foreground text-theme-sm">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-muted-foreground">{user?.email}</span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-border">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/account/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-foreground rounded-lg group text-theme-sm transition-luxe hover:bg-muted hover:text-primary"
            >
              <Icon
                name="UserIcon"
                size={24}
                className="text-muted-foreground transition-luxe group-hover:text-primary"
              />
              My Profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/account/orders"
              className="flex items-center gap-3 px-3 py-2 font-medium text-foreground rounded-lg group text-theme-sm transition-luxe hover:bg-muted hover:text-primary"
            >
              <Icon
                name="ClipboardDocumentListIcon"
                size={24}
                className="text-muted-foreground transition-luxe group-hover:text-primary"
              />
              My Orders
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/account/addresses"
              className="flex items-center gap-3 px-3 py-2 font-medium text-foreground rounded-lg group text-theme-sm transition-luxe hover:bg-muted hover:text-primary"
            >
              <Icon
                name="MapPinIcon"
                size={24}
                className="text-muted-foreground transition-luxe group-hover:text-primary"
              />
              Addresses
            </DropdownItem>
          </li>
        </ul>
        <DropdownItem
          onItemClick={logout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-foreground rounded-lg group text-theme-sm transition-luxe hover:bg-muted hover:text-primary"
        >
          <Icon
            name="ArrowRightOnRectangleIcon"
            size={24}
            className="text-muted-foreground transition-luxe group-hover:text-primary"
          />
          Sign out
        </DropdownItem>
      </Dropdown>
    </div>
  );
}
