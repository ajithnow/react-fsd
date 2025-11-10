
const USER_STATUS ="deleted"

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  return `${name[0]}${'*'.repeat(name.length - 1)}@${domain}`;
}

export function getDisplayEmail(status: string, email: string): string {
  return status === USER_STATUS ? maskEmail(email) : email;
}
