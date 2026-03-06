import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
                    <div className="glass rounded-3xl p-12 max-w-lg w-full text-center space-y-6">
                        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 flex items-center justify-center mx-auto">
                            <AlertTriangle className="text-rose-500" size={36} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white">Something Went Wrong</h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            An unexpected error occurred. Our team has been notified. You can try refreshing the page or returning to the dashboard.
                        </p>
                        <pre className="text-xs text-rose-400/60 bg-slate-900/50 p-4 rounded-xl overflow-auto max-h-32 text-left">
                            {this.state.error?.message}
                        </pre>
                        <button
                            onClick={this.handleReset}
                            className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 mx-auto transition-all hover:scale-105"
                        >
                            <RefreshCw size={18} />
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
