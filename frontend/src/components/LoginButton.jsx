import { useAuth } from "../context/AuthContext";

export default function LoginButton({ className = "" }) {
  const { user, login, logout } = useAuth();

  return user ? (
    <button
      onClick={logout}
      className={`text-sm font-medium text-red-500 hover:underline ${className}`}
    >
      Sign out ({user.displayName.split(" ")[0]})
    </button>
  ) : (
    <button
      onClick={login}
      className={`text-sm font-medium text-blue-600 hover:underline ${className}`}
    >
      Sign in with Google
    </button>
  );
}
