'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      href: '/admin',
    },
    {
      label: 'Products',
      icon: '📦',
      href: '/admin/products',
    },
    {
      label: 'Categories',
      icon: '🏷️',
      href: '/admin/categories',
    },
    {
      label: 'Orders',
      icon: '🛒',
      href: '/admin/orders',
    },
    {
      label: 'Customers',
      icon: '👥',
      href: '/admin/customers',
    },
  ];

  return (
    <aside className="absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/admin">
          <h1 className="text-2xl font-bold text-white">DSHOME</h1>
        </Link>
      </div>

      {/* Sidebar Menu */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname === item.href && 'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
