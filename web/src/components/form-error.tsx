// Outlined black box for form-level errors (no red, per the design).
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <div role="alert" className="mb-5 rounded-xl border border-black px-4 py-3 text-sm font-medium text-black">
      {message}
    </div>
  )
}
