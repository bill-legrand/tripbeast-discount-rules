/**
 * Global setup - runs before all tests.
 * Removes NO_COLOR from env to avoid "NO_COLOR is ignored due to FORCE_COLOR" warnings.
 */
export default async function globalSetup() {
  delete process.env.NO_COLOR;
}
