'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import useAuth from '@/hooks/useAuth';

type AccountSection = 'profile' | 'orders' | 'addresses' | 'wishlist';

interface AccountSidebarProps {
  active: AccountSection;
}

const navItems: Array<{
  key: AccountSection;
  label: string;
  href: string;
  icon: string;
  solid?: boolean;
}> = [
  {
    key: 'orders',
    label: 'My Orders',
    href: '/account/orders',
    icon: 'ClipboardDocumentListIcon',
  },
  {
    key: 'addresses',
    label: 'Addresses',
    href: '/account/addresses',
    icon: 'MapPinIcon',
  },
  {
    key: 'wishlist',
    label: 'Favourites',
    href: '/wishlist',
    icon: 'HeartIcon',
    solid: true,
  },
];

export default function AccountSidebar({ active }: AccountSidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="lg:w-72 shrink-0 border-r border-border bg-background px-4 pt-8 pb-12 lg:px-6">
      <div className="bg-card rounded-lg shadow-warm mb-3 overflow-hidden">
        <Link
          href="/account/profile"
          className={`relative flex items-center gap-3 px-5 py-4 transition-luxe ${
            active === 'profile' ? 'bg-muted/40' : 'hover:bg-muted'
          }`}
        >
          {active === 'profile' && (
            <span className="absolute left-0 top-0 h-full w-[3px] bg-primary rounded-r-full" />
          )}
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              active === 'profile' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}
          >
            <Icon name="UserIcon" size={18} />
          </span>
          <span
            className={`font-medium ${active === 'profile' ? 'text-primary' : 'text-foreground'}`}
          >
            My Profile
          </span>
        </Link>
      </div>

      <div className="bg-card rounded-lg shadow-warm mb-3 overflow-hidden divide-y divide-border">
        {navItems.map((item) => {
          const isActive = active === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex items-center gap-3 px-5 py-4 transition-luxe group ${
                isActive ? 'bg-muted/40' : 'hover:bg-muted'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-[3px] bg-primary rounded-r-full" />
              )}
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-luxe ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground group-hover:text-primary'
                }`}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  variant={isActive && item.solid ? 'solid' : 'outline'}
                />
              </span>
              <span className={`font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="bg-card rounded-lg shadow-warm overflow-hidden">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted transition-luxe group"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground group-hover:text-error transition-luxe">
            <Icon name="ArrowRightOnRectangleIcon" size={18} />
          </span>
          <span className="font-medium text-foreground group-hover:text-error transition-luxe">
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
}
