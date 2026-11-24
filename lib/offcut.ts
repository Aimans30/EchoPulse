/**
 * Offcut: the free Windows tool EchoPulse gives away. Everything the page at
 * /resources/offcut says about downloads lives here, so a release only needs
 * this file changed.
 *
 * SAFETY RULE: never host the installer on echopulse.media. It is unsigned, so
 * Windows SmartScreen and Chrome warn on it; a flagged file on our own domain
 * could get echopulse.media itself flagged by Google Safe Browsing. The file
 * lives on a separate host (Google Drive for 1.0.0) and this page links out.
 *
 * Until `downloadUrl` and `sha256` are both set, the page shows a "notify me"
 * form instead of a download button, so nothing half-finished ships.
 */
export const OFFCUT = {
  name: 'Offcut',
  version: '1.0.0',
  installerName: 'Offcut-Setup-1.0.0.exe',
  extensionFolder: '%LOCALAPPDATA%\\Programs\\Offcut\\extension',
  releasedISO: '2026-11-22',
  /** Page people open in the browser (Google Drive file page with its Download button). */
  downloadUrl: 'https://drive.google.com/file/d/1V-THVCI44dtWuo1SbltFumA4-LXahcv_/view?usp=sharing',
  /** Direct file URL for agents and PowerShell (skips the Drive page). Same file. */
  directDownloadUrl: 'https://drive.usercontent.google.com/download?id=1V-THVCI44dtWuo1SbltFumA4-LXahcv_&export=download&confirm=t',
  /** Where the file is hosted, shown next to the button. */
  hostLabel: 'Google Drive',
  sha256: '7C103FF74D2C075BEEDAF17B447E27647E2908D10449CD60836AAE08ADBA5F7A', // SHA-256 of Offcut-Setup-1.0.0.exe (206,598,116 bytes)
  downloadSizeLabel: 'about 197 MB',
  installedSizeLabel: 'about 0.8 GB',
  speechModelLabel: 'about 140 MB, downloaded once',
  /** Real screenshots only (no mockups), placed in public/resources/offcut/. */
  screenshots: [] as { src: string; alt: string; width: number; height: number; caption: string }[],
  /**
   * Real screenshots for the extension guide, keyed by step (1 to 6) or
   * 'prompt' for the "Disable developer mode extensions" message. Files go in
   * public/resources/offcut/extension/. Empty until real captures exist.
   */
  extensionShots: {} as Partial<Record<'1' | '2' | '3' | '4' | '5' | '6' | 'prompt', { src: string; alt: string; width: number; height: number }>>,
  /** Optional ~20 second screen recording of the six steps (mp4 in public/ or an outside host). */
  extensionVideo: '',
  /**
   * Real screenshots for the "What people use it for" frames on
   * /resources/offcut, keyed by use case. Files go in public/resources/offcut/.
   * Absent keys show a plain skeleton sketch instead (no invented UI).
   */
  useCaseShots: {
    instagram: {
      src: '/resources/offcut/offcut-instagram-panel-sample.webp',
      alt: 'The Offcut panel open beside a reel in the browser, with the transcript ready to copy, save or open in the app. The page around it is a plain sketch. Sample data: the creator and numbers are made up.',
      width: 1576,
      height: 984,
    },
    youtube: {
      src: '/resources/offcut/offcut-reader-youtube-sample.webp',
      alt: 'The Offcut app showing a saved YouTube transcript with the hook pulled out, views, length and a Copy button. Sample data: the creator, title and numbers are made up.',
      width: 2000,
      height: 1250,
    },
    breakdown: {
      src: '/resources/offcut/offcut-reader-instagram-sample.webp',
      alt: 'The Offcut app showing a saved Instagram reel script, with the hook from the first 15 seconds highlighted above the full transcript. Sample data: the creator, title and numbers are made up.',
      width: 2000,
      height: 1250,
    },
    library: {
      src: '/resources/offcut/offcut-library.webp',
      alt: 'The Offcut library listing six saved scripts from Instagram, YouTube, TikTok, LinkedIn and Facebook with views, dates, length and word counts, plus Export CSV. Sample data: the creators, titles and numbers are made up.',
      width: 2000,
      height: 775,
    },
    clips: {
      src: '/resources/offcut/offcut-reader-youtube-sample.webp',
      alt: 'The Offcut app showing a full saved transcript, read line by line to pick the moments worth clipping. Sample data: the creator, title and numbers are made up.',
      width: 2000,
      height: 1250,
    },
  } as Partial<Record<'youtube' | 'instagram' | 'breakdown' | 'library' | 'clips', { src: string; alt: string; width: number; height: number }>>,
};

/**
 * Prompt people paste into Claude, ChatGPT agents, Cursor or any assistant
 * that can run commands on their PC. It always points the agent at the
 * official page for the link and checksum, so it never goes stale, and it
 * forbids touching security settings.
 */
export const OFFCUT_AGENT_PROMPT = `Help me install Offcut, a free Windows app from EchoPulse Media, on this PC. Explain each step in plain words and ask me before anything that needs my click.

1. Read https://echopulse.media/resources/offcut/agent.md (plain text). It has the official download link, the SHA-256 checksum and the exact commands. Only use the download link from that file. If it says the download is not live yet, stop and tell me.
2. Check this PC: Windows 10 or 11, 64-bit, and at least 1 GB of free disk space.
3. Download the installer to my Downloads folder.
4. Verify it in PowerShell: Get-FileHash "<path to the installer>" -Algorithm SHA256. Compare the result with the checksum on the page. If they do not match exactly, stop, delete the file and tell me. Do not run it.
5. If it matches, run the installer. It does not need admin rights. If Windows shows "Windows protected your PC", tell me to click "More info" and then "Run anyway" (the installer is not code-signed yet).
6. Optional browser extension: walk me through https://echopulse.media/resources/offcut/extension one step at a time. Copy this folder path to my clipboard with Set-Clipboard and tell me when to paste it: ${OFFCUT.extensionFolder}
7. When done, tell me what was installed and where.

Rules: never disable antivirus, Windows Defender, SmartScreen or any other security setting; never download from any other website; never run anything except this installer; never change browser settings for me unless I ask.`;

export const OFFCUT_READY = Boolean(OFFCUT.downloadUrl && OFFCUT.sha256);
