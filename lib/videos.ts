// ─── Shared portfolio video source-of-truth ─────────────────────────────────
// Used by both the homepage portfolio carousel (components/OurWork.tsx) and the
// per-ICP landing pages (app/[icp]/page.tsx → components/icp/ICPWork.tsx).
//
// Each clip carries an `icp` array tagging which audience landing page(s) it
// belongs on. A clip can serve more than one ICP (a brand film fits both
// founders and business owners). The homepage carousel ignores `icp` and
// filters by `type` as before.

export type Orientation = 'vertical' | 'horizontal';

export type IcpKey = 'real-estate' | 'coaches' | 'founders' | 'business-owners' | 'dtc';

export type VideoEntry = {
  url:          string;
  type:         string;
  brand:        string;
  label:        string;
  orientation?: Orientation;
  /** Which ICP landing page(s) this clip should appear on. */
  icp?:         IcpKey[];
};

// ─── Single source-of-truth video list ──────────────────────────────────────
export const videos: VideoEntry[] = [
  // Longform
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=vsl1_1_aagaus',                                   type: 'longform', brand: 'Sales Video',    label: 'VSL',        orientation: 'horizontal', icp: ['founders', 'business-owners', 'coaches'] },
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=Untitled_video_-_Made_with_Clipchamp_1_1_spvlnf', type: 'longform', brand: 'Brand Film',     label: 'Cinematic',  orientation: 'horizontal', icp: ['founders', 'business-owners', 'dtc'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/f_mp4,q_auto/fn_1_xy7wfm.mp4',                                      type: 'longform', brand: 'Founder Film',   label: 'Story',      orientation: 'horizontal', icp: ['founders', 'business-owners'] },
  // Podcast
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=17_feb_xngenr',                                   type: 'podcast',  brand: 'Podcast',        label: 'Episode',                               icp: ['coaches', 'founders'] },
  { url: 'https://res.cloudinary.com/du6yx2h01/video/upload/v1765363520/Ep1_Clip18_corrected_xn2szx.mp4',                       type: 'podcast',  brand: 'Podcast Clip',   label: 'Hook',                                  icp: ['coaches', 'founders'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/f_mp4,q_auto/EP4_trailer_l6atpc.mp4',                               type: 'podcast',  brand: 'Podcast',        label: 'Trailer',    orientation: 'horizontal', icp: ['coaches'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/f_mp4,q_auto/mian_hlymvc.mp4',                                      type: 'podcast',  brand: 'Podcast Clip',   label: 'Highlight',  orientation: 'horizontal', icp: ['coaches'] },
  { url: 'https://res.cloudinary.com/du6yx2h01/video/upload/v1779111471/Clip_2_sy4gp8.mp4',                                     type: 'podcast',  brand: 'Podcast Clip',   label: 'Highlight',                             icp: ['coaches'] },
  // Talking head
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=patern_intrupt_sdrd8w',                           type: 'talking',  brand: 'Founder Reel',   label: 'Pattern Interrupt',                     icp: ['founders', 'coaches', 'dtc'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/f_mp4,q_auto/sample_1_j1b05r.mp4',                                  type: 'talking',  brand: 'B2B Brand',      label: 'Talking Head',                          icp: ['business-owners', 'founders'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/f_mp4,q_auto/c5_p3qm4j.mp4',                                        type: 'talking',  brand: 'Founder Reel',   label: 'Story',                                 icp: ['founders', 'coaches'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782370864/c4_auow1y.mp4',                                         type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head',                          icp: ['founders', 'business-owners'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782370930/c3_d6b0yo.mp4',                                         type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head',                          icp: ['founders', 'coaches'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782370996/c2_xxusow.mp4',                                         type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head',                          icp: ['founders', 'dtc'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782371012/milo_6_jycqyj.mp4',                                     type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head',                          icp: ['coaches', 'business-owners'] },
  // Long form — orientation omitted so it auto-detects from the real file
  // dimensions (these clips are actually vertical 9:16, not 16:9).
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1761292978/_mediamen-26-11-2023-0001_sycb1h.mp4',                  type: 'longform', brand: 'Brand Film',     label: 'Cinematic',                             icp: ['business-owners', 'dtc'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1761292973/_mediamen-26-11-2023-0002_hmkbwn.mp4',                  type: 'longform', brand: 'Brand Film',     label: 'Cinematic',                             icp: ['business-owners', 'dtc'] },
  // Real estate
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782371049/2426_fn_e4yyrc.mp4',                                    type: 'realestate', brand: 'Listing Reel', label: 'Property',                            icp: ['real-estate'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782371126/2458_fn_uphhrb.mp4',                                    type: 'realestate', brand: 'Listing Reel', label: 'Property',                            icp: ['real-estate'] },
  { url: 'https://res.cloudinary.com/dqqd9rq8s/video/upload/v1782372139/2438_fn_z6wry7.mp4',                                    type: 'realestate', brand: 'Listing Reel', label: 'Property',                            icp: ['real-estate'] },

  // ─── New clips ───────────────────────────────────────────────────────────
  // Real estate short: townhome listing in Terwillegar, Edmonton.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795128789/vidssave.com_330K_Townhome_in_Terwillegar_shorts_720P_vxpsxj.mp4', type: 'realestate', brand: 'Listing Reel', label: 'Townhome Tour', orientation: 'vertical', icp: ['real-estate'] },
  // Real estate short: investment opportunity.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795127894/vidssave.com_This_Could_Be_The_BEST_Investment_Opportunity_of_the_Year_shorts_720P_knwqlg.mp4', type: 'realestate', brand: 'Agent Reel', label: 'Investment Short', orientation: 'vertical', icp: ['real-estate'] },
  // Real estate short: what a budget buys in Edmonton.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795127895/vidssave.com_This_is_what_235K_gets_you_in_Edmonton_Canada_shorts_720P_w0dnl5.mp4', type: 'realestate', brand: 'Listing Reel', label: 'Market Short', orientation: 'vertical', icp: ['real-estate'] },
  // Business content reel that also fits real estate.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795126660/Full_video_qqft5a.mp4',                                  type: 'talking',  brand: 'Business Reel',  label: 'Business Content', orientation: 'vertical', icp: ['business-owners', 'real-estate'] },
  // DTC brand reel (LuxeGlow), also founder content.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795126626/LuxeGlow-Reel_01_ynozhc.mp4',                            type: 'talking',  brand: 'DTC Reel',       label: 'Brand Content', orientation: 'vertical', icp: ['dtc', 'founders'] },
  // Founder info content reel, also used for DTC.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795125954/Jan_v1_byEchoPulse_gkl6m6.mp4',                          type: 'talking',  brand: 'Founder Reel',   label: 'Info Content', orientation: 'vertical', icp: ['founders', 'dtc'] },
  // Real estate listing reel.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795125985/reel_1_bswr7q.mp4',                                      type: 'realestate', brand: 'Listing Reel', label: 'Property', orientation: 'vertical', icp: ['real-estate'] },
  // Coach personal brand reel, Hormozi-style captions and pacing.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795126002/FOREST_FIRE_hlwwy7.mp4',                                 type: 'talking',  brand: 'Coach Reel',     label: 'Personal Brand', orientation: 'vertical', icp: ['coaches'] },
  // DTC ad reel that also works as business owner content.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795122874/c16_h5bzrt.mp4',                                         type: 'talking',  brand: 'DTC Ad',         label: 'Ad Reel', orientation: 'vertical', icp: ['dtc', 'business-owners'] },
  // Ad reel mixing AI visuals and motion graphics.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795122876/c13_ttg4ix.mp4',                                         type: 'talking',  brand: 'Ad Reel',        label: 'AI Motion Graphics', orientation: 'vertical', icp: ['dtc', 'business-owners', 'founders'] },
  // DTC ad reel, business content for people and brand pages.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795122835/c8_xe62qr.mp4',                                          type: 'talking',  brand: 'DTC Ad',         label: 'Business Content', orientation: 'vertical', icp: ['dtc', 'business-owners'] },
  // Informational reel for business owners.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795122842/c10_crifo8.mp4',                                         type: 'talking',  brand: 'Business Reel',  label: 'Info Content', orientation: 'vertical', icp: ['business-owners'] },
  // SaaS ad reel for DTC-style paid social (Milo series).
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795122828/milo_5_zxyxwn.mp4',                                      type: 'talking',  brand: 'SaaS Ad',        label: 'Ad Reel', orientation: 'vertical', icp: ['dtc', 'founders'] },
  // MagicBNB SaaS ad reel (DTC-style paid social), also fits business owners.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795122800/c4_eoefnr.mp4',                                          type: 'talking',  brand: 'SaaS Ad',        label: 'MagicBNB Reel', orientation: 'vertical', icp: ['dtc', 'business-owners', 'founders'] },
  // Founder and coach talking-head content, also used by DTC brands.
  { url: 'https://res.cloudinary.com/dkzhqy2od/video/upload/v1795116227/main_video_x4dgug.mp4',                                   type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head', orientation: 'vertical', icp: ['dtc', 'coaches', 'founders'] },
  // Podcast trailer clip for Instagram, cut from a client episode (DTC).
  { url: 'https://player.cloudinary.com/embed/?cloud_name=dkzhqy2od&public_id=EP5_ig_trailer_rosazz',                             type: 'podcast',  brand: 'Podcast Clip',   label: 'Episode Trailer', orientation: 'vertical', icp: ['dtc', 'founders'] },
  // Founder info reel with motion graphics (MagicBNB, Nov 2026).
  { url: 'https://player.cloudinary.com/embed/?cloud_name=dkzhqy2od&public_id=MagicBnB_Profit_Reel_1_caarnr',                   type: 'talking',  brand: 'Founder Reel',   label: 'Motion Graphics', orientation: 'vertical', icp: ['founders', 'business-owners'] },
  // General vertical reel — shows across the home carousel ("All" + Talking).
  { url: 'https://res.cloudinary.com/du6yx2h01/video/upload/v1782821858/c20_xv9ahv.mp4',                                        type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head', orientation: 'vertical', icp: ['founders', 'coaches', 'business-owners', 'dtc'] },
  // Talking-head reel that also fits real estate agents → tagged on both tabs
  // (one entry per tab so each portfolio tab + ICP page picks it up).
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=vx_lpxdya',                                       type: 'talking',  brand: 'Founder Reel',   label: 'Talking Head', orientation: 'vertical', icp: ['founders', 'coaches'] },
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=vx_lpxdya',                                       type: 'realestate', brand: 'Agent Reel',   label: 'Talking Head', orientation: 'vertical', icp: ['real-estate'] },
  // Additional real-estate listing reels
  { url: 'https://player.cloudinary.com/embed/?cloud_name=du6yx2h01&public_id=sample6_xv4so8',                                  type: 'realestate', brand: 'Listing Reel', label: 'Property',     orientation: 'vertical', icp: ['real-estate'] },
  { url: 'https://res.cloudinary.com/du6yx2h01/video/upload/v1782822621/reel_1_lyznya.mp4',                                     type: 'realestate', brand: 'Listing Reel', label: 'Property',     orientation: 'vertical', icp: ['real-estate'] },
];

/** All clips tagged for a given ICP landing page. */
export function videosForIcp(icp: IcpKey): VideoEntry[] {
  return videos.filter((v) => v.icp?.includes(icp));
}

// ─── Cloudinary preview URL helper ──────────────────────────────────────────
// Converts embed-player links to direct .mp4 URLs sized for the card's display
// width (×2 for retina). Skips non-Cloudinary sources.
export function previewMp4Src(src: string, orientation?: Orientation): string | null {
  // Card previews are muted, looping and small on screen, so they do not need
  // the full file. A sweep in November 2026 found niche pages downloading 6 to
  // 10 MB per clip (about 28 MB on /real-estate). These settings give a silent
  // 8-second loop at card size instead; the full clip still plays in the
  // modal, which uses the original URL.
  const w = orientation === 'horizontal' ? 854 : 480;
  const t = `c_scale,w_${w},q_auto:low,ac_none,du_8`;

  if (src.includes('player.cloudinary.com/embed')) {
    try {
      const url      = new URL(src);
      const publicId = url.searchParams.get('public_id');
      const cloud    = url.searchParams.get('cloud_name') || 'du6yx2h01';
      if (publicId) return `https://res.cloudinary.com/${cloud}/video/upload/${t},f_auto/${publicId}.mp4`;
    } catch { return null; }
  }
  if (src.includes('res.cloudinary.com') && src.includes('/video/upload/')) {
    if (/[,/]w_\d+/.test(src)) return src;
    return src.replace('/video/upload/', `/video/upload/${t}/`);
  }
  if (src.includes('.mp4')) return src;
  return null;
}

// ─── /work wall helpers ─────────────────────────────────────────────────────
// The wall shows every clip once (several clips are listed twice above, once
// per portfolio tab), with three renditions of each from Cloudinary:
//   poster   a still frame, the only thing loaded until the cursor comes near
//   preview  a small muted loop for the tile (480px wide, low bitrate)
//   full     the proper file, loaded only when a tile is opened

/** Resolve an embed-player or delivery URL to { cloud, rest } on res.cloudinary.com. */
function cloudinaryParts(src: string): { cloud: string; path: string } | null {
  if (src.includes('player.cloudinary.com/embed')) {
    try {
      const u = new URL(src);
      const id = u.searchParams.get('public_id');
      const cloud = u.searchParams.get('cloud_name') || 'du6yx2h01';
      return id ? { cloud, path: `${id}.mp4` } : null;
    } catch {
      return null;
    }
  }
  const m = src.match(/res\.cloudinary\.com\/([^/]+)\/video\/upload\/(.+)$/);
  if (!m) return null;
  // Drop any existing transformation segment (contains a comma or "x_y" pairs
  // before the version/public id) so ours is the only one applied.
  const segs = m[2].split('/');
  while (segs.length > 1 && /^[a-z]{1,3}_[^/]+(,[a-z]{1,3}_[^/]+)*$/.test(segs[0]) && !/^v\d+$/.test(segs[0])) segs.shift();
  return { cloud: m[1], path: segs.join('/') };
}

export type WallClip = {
  id: string;
  brand: string;
  label: string;
  types: string[];
  icps: IcpKey[];
  /** Declared orientation; when absent the wall reads it off the poster. */
  orientation?: Orientation;
  poster: string;
  /** Smaller poster (w_320) for phone-sized tiles; used in the wall's srcSet only. */
  posterSm: string;
  preview: string;
  full: string;
  /**
   * Set for samples hosted on a client's YouTube channel. Those tiles show a
   * still frame (no hover preview) and open YouTube's own player, so every
   * play counts as a view and watch time on the client's channel. The video
   * is never downloaded or re-hosted.
   */
  youtube?: { id: string; start: number; watchUrl: string };
};

export function wallClips(): WallClip[] {
  const byId = new Map<string, WallClip>();
  for (const v of videos) {
    const p = cloudinaryParts(v.url);
    if (!p) continue;
    const id = `${p.cloud}/${p.path}`;
    const base = `https://res.cloudinary.com/${p.cloud}/video/upload`;
    const existing = byId.get(id);
    if (existing) {
      if (!existing.types.includes(v.type)) existing.types.push(v.type);
      for (const k of v.icp ?? []) if (!existing.icps.includes(k)) existing.icps.push(k);
      existing.orientation ??= v.orientation;
      continue;
    }
    byId.set(id, {
      id,
      brand: v.brand,
      label: v.label,
      types: [v.type],
      icps: [...(v.icp ?? [])],
      orientation: v.orientation,
      poster: `${base}/so_3,c_scale,w_520,q_auto,f_jpg/${p.path.replace(/\.mp4$/, '.jpg')}`,
      posterSm: `${base}/so_3,c_scale,w_320,q_auto,f_jpg/${p.path.replace(/\.mp4$/, '.jpg')}`,
      preview: `${base}/c_scale,w_480,q_auto:low,f_mp4,ac_none,du_12/${p.path}`,
      full: `${base}/q_auto:good,f_mp4/${p.path}`,
    });
  }
  return [...byId.values()];
}

/**
 * Work samples published on clients' YouTube channels. Each entry is one
 * section of a video: the tile shows a frame YouTube itself generates for that
 * point (frame "0" is the custom thumbnail, "1", "2", "3" are at 25, 50 and
 * 75 percent of the running time) and opens the YouTube player at `start`.
 * Only shown on /work, because the other sections that use wallClips() play
 * hover previews that YouTube samples do not have.
 */
type YouTubeSample = {
  id: string;
  start: number;
  frame: '0' | '1' | '2' | '3';
  vertical?: boolean;
  type: string;
  brand: string;
  label: string;
  icp: IcpKey[];
};

const YOUTUBE_SAMPLES: YouTubeSample[] = [
  // "Why Normal Airbnb Pricing Breaks During Big Events" (8:17), Geo Pedro.
  { id: 'yyRL4NTlwrw', start: 0, frame: '0', type: 'longform', brand: 'YouTube Long-form', label: 'Event pricing explainer', icp: ['founders', 'business-owners', 'coaches'] },
  { id: 'yyRL4NTlwrw', start: 248, frame: '2', type: 'longform', brand: 'YouTube Long-form', label: 'Motion graphics: LA 2028', icp: ['founders', 'business-owners'] },
  // "Airbnb changed two policies on October 20..." Geo Pedro. Running time
  // not known here, so the graphic frame opens the video from the start.
  { id: '9FL4FP3U2XE', start: 0, frame: '2', type: 'longform', brand: 'YouTube Long-form', label: 'Policy explainer with graphics', icp: ['founders', 'business-owners', 'coaches'] },
  // "Setting up my 10th Six Figure Airbnb listing p2", Geo Pedro (Short).
  { id: 'JjsDOq4rqM8', start: 0, frame: '0', vertical: true, type: 'talking', brand: 'YouTube Short', label: 'Founder story', icp: ['founders', 'business-owners'] },
  // "How 2 Top-Producing Realtors Scaled To Over $4 Million in GCI | EP 1",
  // Market Pulse real estate podcast on the Virtual Xposure channel. Full
  // multi-camera episode edited by Lakshya Soni.
  { id: 'OrmfrIxWhes', start: 0, frame: '0', type: 'podcast', brand: 'Real Estate Podcast', label: 'Multi-cam episode', icp: ['real-estate', 'founders'] },
  { id: 'OrmfrIxWhes', start: 0, frame: '2', type: 'podcast', brand: 'Real Estate Podcast', label: 'Multi-cam edit', icp: ['real-estate', 'founders'] },
];

export function youtubeWallClips(): WallClip[] {
  return YOUTUBE_SAMPLES.map((y) => {
    const img = y.vertical
      ? `https://i.ytimg.com/vi/${y.id}/${y.frame === '0' ? 'oardefault' : `oar${y.frame}`}.jpg`
      : `https://i.ytimg.com/vi/${y.id}/${y.frame === '0' ? 'maxresdefault' : `maxres${y.frame}`}.jpg`;
    const imgSm = y.vertical
      ? img
      : `https://i.ytimg.com/vi/${y.id}/${y.frame === '0' ? 'sddefault' : `sd${y.frame}`}.jpg`;
    const watchUrl = y.vertical
      ? `https://www.youtube.com/shorts/${y.id}`
      : `https://www.youtube.com/watch?v=${y.id}${y.start ? `&t=${y.start}s` : ''}`;
    return {
      id: `yt/${y.id}/${y.start}/${y.frame}`,
      brand: y.brand,
      label: y.label,
      types: [y.type],
      icps: [...y.icp],
      orientation: y.vertical ? 'vertical' : 'horizontal',
      poster: img,
      posterSm: imgSm,
      preview: '',
      full: `https://www.youtube.com/embed/${y.id}?autoplay=1&rel=0&playsinline=1${y.start ? `&start=${y.start}` : ''}`,
      youtube: { id: y.id, start: y.start, watchUrl },
    };
  });
}
