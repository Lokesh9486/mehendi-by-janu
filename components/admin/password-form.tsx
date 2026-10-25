"use client";

import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { postEncryptedJson } from "@/lib/secure-payload-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordFormProps = {
  onSessionExpired: () => void;
};

const fieldClass =
  "h-11 rounded-none border-burgundy/25 bg-ivory/70 px-3.5 text-[13px] focus-visible:ring-burgundy/20";

const labelClass =
  "font-mono text-[9px] tracking-[0.14em] text-burgundy uppercase";

export function PasswordForm({ onSessionExpired }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    setIsBusy(true);

    try {
      const response = await postEncryptedJson("/api/admin/password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (response.status === 401) {
        onSessionExpired();
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "The password could not be changed.");
        return;
      }

      setSuccess("Password updated. Use the new password the next time you sign in.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not reach the server. Please try again.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="max-w-[520px] border border-burgundy/20 bg-paper p-6 md:p-8">
      <h2 className="font-serif text-[28px] leading-tight font-normal text-burgundy">
        Change password
      </h2>
      <p className="mt-2 text-[12px] leading-[1.7] text-[#6d635a]">
        Enter your current password, then choose a new one of at least 8
        characters.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="current-password" className={labelClass}>
            Current password
          </Label>
          <Input
            id="current-password"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password" className={labelClass}>
            New password
          </Label>
          <Input
            id="new-password"
            name="newPassword"
            type="password"
            required
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className={labelClass}>
            Confirm new password
          </Label>
          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={fieldClass}
          />
        </div>

        {error ? (
          <p
            role="alert"
            aria-live="polite"
            className="border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-[11px] leading-[1.6] text-destructive"
          >
            {error}
          </p>
        ) : null}

        {success ? (
          <p
            role="status"
            aria-live="polite"
            className="border border-olive/30 bg-olive/5 px-3.5 py-3 text-[11px] leading-[1.6] text-olive"
          >
            {success}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isBusy}
          className="h-11 w-full rounded-none border border-burgundy bg-burgundy text-[11px] tracking-[0.08em] text-ivory transition-colors hover:border-olive hover:bg-olive sm:w-auto sm:px-6"
        >
          {isBusy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            <>
              <KeyRound className="size-4" aria-hidden="true" />
              Update password
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
