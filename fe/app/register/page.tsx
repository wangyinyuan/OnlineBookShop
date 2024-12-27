import { RegisterForm } from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-full">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
