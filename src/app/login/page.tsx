import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import LoginForm from './login-form';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
