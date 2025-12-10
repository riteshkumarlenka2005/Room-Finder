import Link from "next/link"

export default function PostAdPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-4">Post Your Ad</h1>
      <p className="text-gray-600 mb-8">Choose what you want to list</p>

      <div className="flex gap-4">
        <Link href="/list-property">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            List Property
          </button>
        </Link>

        <Link href="/list-helper">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg">
            List Domestic Helper
          </button>
        </Link>
      </div>
    </div>
  )
}
