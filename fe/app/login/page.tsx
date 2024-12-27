import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-full">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
