'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export function SiteNav() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">SB</span>
        </div>
        <span className="font-bold text-xl text-slate-900">ScholarBeacon</span>
      </Link>

      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Link>
            <UserButton />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer">
                Get Started Free
              </button>
            </SignUpButton>
          </>
        )}
      </div>
    </nav>
  );
}
