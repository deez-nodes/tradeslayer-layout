import { Component, type ReactNode } from 'react';

/** Catches render errors and shows a recoverable fallback. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('TradeSlayer error:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas p-8 text-center">
          <h1 className="text-xl font-bold text-fg">Something went wrong</h1>
          <pre className="max-w-xl overflow-auto rounded-lg border border-line bg-panel p-4 text-left text-xs text-down">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => location.reload()}
            className="rounded-lg border border-line bg-panel px-4 py-2 text-sm text-fg transition-colors hover:bg-panel-hi"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
