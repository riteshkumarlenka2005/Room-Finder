export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Verify Your Email</h1>
        <p className="text-gray-700 mb-6">
          A verification link has been sent to your email address.  
          Please check your inbox and click the link to complete your signup.
        </p>
        <p className="text-sm text-gray-500">Did not receive the email? Check your spam folder.</p>
      </div>
    </div>
  );
}
