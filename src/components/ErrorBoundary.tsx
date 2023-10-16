import * as React from "react";
import { FaSpinner } from "react-icons/fa";

type Props = React.PropsWithChildren & { fallback?: React.ReactNode };

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.log("Error boundary state deriving from", error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    //   logErrorToMyService(error, info.componentStack);
    console.log("Error caught by boundary", error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) return this.props.fallback;
      return <FaSpinner className="w-8 h-8 3xl:h-12 3xl:w-12 animate-spin" />;
    }

    return this.props.children;
  }
}
