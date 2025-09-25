import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center">
                <div className="mb-8">
                    <div className="w-32 h-32 mx-auto mb-6 text-muted/30">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0.3"/>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z"/>
                        </svg>
                    </div>
                </div>
                
                <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Story Not Found
                </h2>
                <p className="text-muted mb-8 max-w-md mx-auto">
                    The story you&apos;re looking for doesn&apos;t exist or may have been removed. 
                    Let&apos;s find you something else to read.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium"
                    >
                        Browse Stories
                    </Link>
                    <Link
                        href="/archive"
                        className="px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium"
                    >
                        View Archive
                    </Link>
                </div>
            </div>
        </div>
    );
}