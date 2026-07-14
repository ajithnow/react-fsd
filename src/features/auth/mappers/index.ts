/**
 * Auth feature public adaptation points for host projects.
 *
 * Typical CaptureHire wiring later:
 *   setProfileMapper((raw) => mapCaptureHireProfile(raw));
 *   setRolePermissions({ Admin: ['profiles:approve', ...] });
 *   // and point ENDPOINTS.ME at `/api/profile/me`
 */
export {
  mapProfileToUser,
  setProfileMapper,
  resetProfileMapper,
  defaultMapProfileToUser,
} from './profile.mapper';
