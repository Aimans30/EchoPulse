import { OFFCUT, OFFCUT_READY } from '@/lib/offcut';

/**
 * Install runbook for AI agents, at /resources/offcut/agent.md.
 *
 * The one-line pill on /resources/offcut tells an agent to read this file, so
 * everything an agent needs is here in plain markdown: the exact download URL
 * and SHA-256 (from lib/offcut.ts, the same values the page shows), the exact
 * PowerShell to run, what to say to the person at each click, a path for
 * chat-only assistants that cannot run commands, and failure handling.
 * Agents never have to scrape the HTML page.
 */
export const dynamic = 'force-static';

const PAGE = 'https://echopulse.media/resources/offcut';
const GUIDE = 'https://echopulse.media/resources/offcut/extension';

function notReady() {
  return `# Install Offcut (instructions for AI agents)

Offcut is a free Windows app from EchoPulse Media: ${PAGE}

## Status: the download is NOT live yet

Do not search for Offcut anywhere else and do not download anything. Tell the person, in plain words:

"Offcut is not available to download yet. You can leave your email at ${PAGE} and EchoPulse Media will email you once when it is live."

Then stop.
`;
}

function ready() {
  const file = OFFCUT.installerName;
  const hash = OFFCUT.sha256.toUpperCase();
  return `# Install Offcut (instructions for AI agents)

You are helping a person install Offcut, a free Windows app from EchoPulse Media, on their own PC.
Official page: ${PAGE}
This file is the source of truth. Follow it exactly. Talk to the person in short, plain sentences and tell them what you are about to do before each step.

## Facts you need

- Version: ${OFFCUT.version}
- Installer file name: ${file}
- Official download URL (the only allowed source, direct file on Google Drive): ${OFFCUT.directDownloadUrl}
- Same file, as a page a person opens in the browser: ${OFFCUT.downloadUrl}
- SHA-256 of that exact file: ${hash}
- Needs: Windows 10 or 11, 64-bit, no admin rights, about 1 GB free disk space (download ${OFFCUT.downloadSizeLabel}, ${OFFCUT.installedSizeLabel} after install, plus a speech model of ${OFFCUT.speechModelLabel})
- The installer is not code-signed yet, so Windows SmartScreen shows "Windows protected your PC". That is expected for this file. The SHA-256 check below is how the person knows the file is the genuine one.
- Offcut has no account, uploads nothing, and adds no startup entry.

## Safety rules (always)

- Download only from the official URL above. Never use any other site, mirror or search result.
- Never run the installer unless the SHA-256 matches exactly.
- Never disable or change antivirus, Windows Defender, SmartScreen, firewall or any other security setting.
- Never run anything except this installer. Never change browser settings unless the person asks.
- Ask the person before any step that needs their click, and wait for them to confirm.

## Choose your path

- If you can run PowerShell commands on this PC, use Path A and do the whole setup yourself: check, download, verify, start the installer, then the extension. The person only clicks where Windows or the browser requires a human (the SmartScreen screen, the installer, and browser screens you cannot control).
- If you are a chat assistant that cannot run commands, use Path B and give the person clear manual steps, including the extension.

## Path A: you can run commands

Step 1. Check the PC. Run:

    [Environment]::Is64BitOperatingSystem
    (Get-CimInstance Win32_OperatingSystem).Caption
    "{0:N1} GB free" -f ((Get-PSDrive C).Free / 1GB)

It must be 64-bit Windows 10 or 11 with at least 1 GB free. If not, stop and explain what is missing.

Step 2. Download to the person's Downloads folder:

    $dl = Join-Path $env:USERPROFILE "Downloads\\${file}"
    Invoke-WebRequest -Uri "${OFFCUT.directDownloadUrl}" -OutFile $dl -UseBasicParsing

If the saved file is much smaller than ${OFFCUT.downloadSizeLabel} (Google Drive sometimes returns a web page instead of the file), delete it and use Path B step 1 instead.

Step 3. Verify the file:

    (Get-FileHash $dl -Algorithm SHA256).Hash

The result must be exactly: ${hash}
If it does not match, delete the file (Remove-Item $dl), tell the person the download did not verify, and stop. Do not run it.

Step 4. Tell the person: "The file checks out. I am going to start the installer. Windows will probably show a blue screen that says Windows protected your PC. Click More info, then Run anyway. Then follow the installer's steps." Wait for them to say they are ready, then run:

    Start-Process -FilePath $dl

Wait for the person to tell you the installer has finished. If they want the browser extension, ask them to tick "Add the browser extension now" on the installer's last page.

Step 5 (optional, only if the person wants the browser extension). Copy the folder path to their clipboard:

    $ext = Join-Path $env:LOCALAPPDATA "Programs\\Offcut\\extension"
    Test-Path (Join-Path $ext "manifest.json")
    Set-Clipboard -Value $ext

If Test-Path prints False, the extension files are missing: ask the person to run the installer again, then repeat this step.

If you can control this PC's screen or browser (computer use or a browser tool), ask the person: "Do you want me to add the extension for you?" If they say yes, do these six steps yourself and show them each screen. Otherwise walk them through the steps one at a time, waiting after each:
1. Open Chrome and paste chrome://extensions into the address bar, then press Enter. (Edge: edge://extensions. Brave: brave://extensions.)
2. Turn on Developer mode (top right in Chrome and Brave, left sidebar in Edge).
3. Click "Load unpacked".
4. In the folder picker, paste the path that is now on their clipboard into the address bar, press Enter, then click Select Folder.
5. Click the puzzle-piece icon in the toolbar, then the pin next to Offcut.
6. On the welcome page, press "Test the connection". It should say "Working".
If the browser later shows "Disable developer mode extensions", tell them to close it with the X and not click Disable.
Full guide with troubleshooting: ${GUIDE}

Step 6. Finish by telling the person: Offcut ${OFFCUT.version} is installed for their Windows user (no admin needed), how to open it from the Start menu, and whether the extension was added.

## Path B: you cannot run commands

Give the person these steps, one at a time, and wait for them after each:
1. Open ${PAGE} and click "Download for Windows". It opens Google Drive: click Download, and if Drive says it can't scan the file for viruses (normal for large files), click "Download anyway". If Chrome says the file isn't commonly downloaded, open the menu on the download and click "Keep".
2. Optional check: open PowerShell in the Downloads folder and run Get-FileHash .\\${file} -Algorithm SHA256. The result must be ${hash}. If it is different, delete the file and do not run it.
3. Double-click ${file}. If Windows says "Windows protected your PC", click More info, then Run anyway. Follow the installer.
4. Optional browser extension (adds a Transcribe button on videos):
   a. Open Chrome and paste chrome://extensions into the address bar, then press Enter. (Edge: edge://extensions. Brave: brave://extensions.)
   b. Turn on Developer mode (top right in Chrome and Brave, left sidebar in Edge).
   c. Click "Load unpacked".
   d. In the folder picker's address bar, paste ${OFFCUT.extensionFolder} then press Enter and click Select Folder.
   e. Click the puzzle-piece icon in the toolbar, then the pin next to Offcut.
   f. On the welcome page, press "Test the connection". It should say "Working".
   If Chrome later shows "Disable developer mode extensions", close it with the X. Do not click Disable.
   Pictures and troubleshooting: ${GUIDE}

## If something goes wrong

- Download fails or is blocked: tell the person to download it from ${PAGE} in their browser, then continue from the verify step.
- Hash does not match: delete the file and stop. Tell the person to try again later or contact EchoPulse Media from ${PAGE}.
- Installer does not start or closes: run it again. It keeps the person's data.
- Extension says Offcut is not installed: open the Offcut app once, then press Test the connection again. More fixes: ${GUIDE}
`;
}

export function GET() {
  return new Response(OFFCUT_READY ? ready() : notReady(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  });
}
