export default function Footer() {
  return (
    <footer className="mt-12 text-center text-sm py-6 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
      <p>© {new Date().getFullYear()} PaiperSum. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
        <a href="/terms" className="hover:underline">Terms of Service</a>
        <a href="mailto:support@paipersum.com" className="hover:underline">Contact Support</a>
      </div>
    </footer>
  );
}