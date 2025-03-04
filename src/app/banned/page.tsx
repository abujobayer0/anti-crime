import { AlertOctagon, Ban } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BannedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="relative">
          <div className="absolute -inset-1 bg-red-500/20 rounded-full blur-xl" />
          <div className="relative bg-background p-4 rounded-full inline-block">
            <Ban className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Account Suspended
          </h1>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Your account has been suspended due to violation of our community
              guidelines.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertOctagon className="h-4 w-4 text-red-500" />
                <p>
                  If you believe this is a mistake, please contact our support
                  team.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild variant="default">
              <Link href="/support">Contact Support</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/login">Return to Login</Link>
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground pt-8">
          Crime Reporting Platform © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
