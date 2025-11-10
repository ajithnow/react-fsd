export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  return `${name[0]}${'*'.repeat(name.length - 1)}@${domain}`;
}

export const pascalToCamel = (string?: string) => {
  if (!string) return;
  return string.charAt(0).toLowerCase() + string.slice(1);
};
