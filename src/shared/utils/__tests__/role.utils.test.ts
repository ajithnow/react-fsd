import { getUserTypeData, getUserStatusData } from '../role.utils';

describe('role.utils', () => {
  const t = (k: string) => `T:${k}`;

  it('returns type data with translated labels', () => {
    const types = getUserTypeData(t);
    expect(types).toBeDefined();
    const vals = Object.values(types);
    expect(vals.length).toBeGreaterThan(0);
    expect(vals[0].label.startsWith('T:users.')).toBe(true);
  });

  it('returns status data with translated labels', () => {
    const status = getUserStatusData(t);
    expect(status).toBeDefined();
    const vals = Object.values(status);
    expect(vals.length).toBeGreaterThan(0);
    expect(vals[0].label.startsWith('T:')).toBe(true);
  });
});
