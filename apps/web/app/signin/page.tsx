import { SignIn } from "@/components/auth/sign-in";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <SignIn />
      </div>
    </div>
  );
}
