export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100">
        {children}
    </div>
  )
}
