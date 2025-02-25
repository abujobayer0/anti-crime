import dynamic from "next/dynamic";
import { Suspense } from "react";

export function dynamicImport(
  component: () => Promise<any>,
  loading?: React.ReactNode
) {
  const Component = dynamic(component, {
    loading: () => <>{loading}</>,
    ssr: false,
  });

  return function DynamicComponent(props: any) {
    return (
      <Suspense fallback={loading}>
        <Component {...props} />
      </Suspense>
    );
  };
}
