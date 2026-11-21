/**
 * Offcut: the free Windows tool EchoPulse gives away. Everything the page at
 * /resources/offcut says about downloads lives here, so a release only needs
 * this file changed.
 *
 * SAFETY RULE: never host the installer on echopulse.media. It is unsigned, so
 * Windows SmartScreen and Chrome warn on it; a flagged file on our own domain
 * could get echopulse.media itself flagged by Google Safe Browsing. The file
 * lives on GitHub Releases (or another separate host) and this page links out.
 *
 * Until `downloadUrl` and `sha256` are both set, the page shows a "notify me"
 * form instead of a download button, so nothing half-finished ships.
 */
export const OFFCUT = {
  name: 'Offcut',
  version: '', // e.g. '1.0.0'
  releasedISO: '', // e.g. '2026-11-25'
  downloadUrl: '', // GitHub Releases asset URL for the installer (.exe)
  sha256: '', // SHA-256 of that exact installer file, uppercase or lowercase hex
  downloadSizeLabel: 'about 200 MB',
  installedSizeLabel: 'about 0.8 GB',
  speechModelLabel: 'about 140 MB, downloaded once',
  /** Real screenshots only (no mockups), placed in public/resources/offcut/. */
  screenshots: [] as { src: string; alt: string; width: number; height: number; caption: string }[],
};

export const OFFCUT_READY = Boolean(OFFCUT.downloadUrl && OFFCUT.sha256);
