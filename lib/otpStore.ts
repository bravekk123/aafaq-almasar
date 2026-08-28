type OtpRecord = {
  code: string;
  expires: number;
};

const otpStore = new Map<string, OtpRecord>();

export function saveOtp(
  email: string,
  code: string
) {
  otpStore.set(email, {
    code,
    expires:
      Date.now() +
      10 * 60 * 1000,
  });
}

export function verifyOtp(
  email: string,
  code: string
) {
  const record =
    otpStore.get(email);

  if (!record) return false;

  if (
    Date.now() >
    record.expires
  ) {
    otpStore.delete(email);
    return false;
  }

  if (record.code !== code) {
    return false;
  }

  otpStore.delete(email);
  return true;
}