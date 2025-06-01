import React from 'react';

interface ErrorBoundaryProps {
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        const { hasError, error } = this.state;

        if (hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="text-red-500 p-6 max-w-xl mx-auto">
                    <h2 className="text-xl font-semibold">เกิดข้อผิดพลาดในการโหลดหน้านี้</h2>
                    <pre className="bg-gray-100 text-sm p-3 mt-4 rounded">{error?.message}</pre>
                    <button
                        onClick={this.handleReload}
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        โหลดหน้าใหม่
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
