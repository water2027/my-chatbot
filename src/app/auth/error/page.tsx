interface PageProps {
  searchParams: {
    error?: string;
    error_detail?: string;
    redirect_uri?: string;
  }
}

export default async function ErrorPage({ searchParams }: PageProps) {
    // 这里居然要await吗? 
    const { error, error_detail, redirect_uri } = await searchParams;

    if (!error && !error_detail) {
        return <div>No error information provided.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <p className="text-lg text-gray-700">{error || 'An unknown error occurred.'}</p>
            {error_detail && <p className="text-sm text-gray-500 mt-2">{error_detail}</p>}
            {redirect_uri && (
                <a href={redirect_uri} className="mt-4 text-blue-500 hover:underline">
                    返回
                </a>
            )}
        </div>
    );
}
