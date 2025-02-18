import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VerificationSectionProps {
  isVerifying: boolean;
  otp: string;
  otpSent: boolean;
  onOtpChange: (value: string) => void;
  onVerifyOTP: () => void;
  onSendOTP: () => void;
  onCancel: () => void;
}

export const VerificationSection = ({
  isVerifying,
  otp,
  otpSent,
  onOtpChange,
  onVerifyOTP,
  onSendOTP,
  onCancel,
}: VerificationSectionProps) => {
  return (
    <div className="mt-4">
      {!isVerifying ? (
        <Button onClick={onSendOTP} variant="default" className="w-full">
          Verify Phone Number
        </Button>
      ) : (
        <div className="space-y-4">
          <Input
            value={otp}
            onChange={(e) => onOtpChange(e.target.value)}
            placeholder="Enter OTP"
            type="text"
            maxLength={6}
          />
          <div className="flex gap-2">
            <Button onClick={onVerifyOTP} variant="default" className="flex-1">
              Verify OTP
            </Button>
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
          {otpSent && (
            <Button onClick={onSendOTP} variant="link" className="w-full">
              Resend OTP
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
