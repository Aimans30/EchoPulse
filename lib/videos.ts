// ─── Shared portfolio video source-of-truth ─────────────────────────────────
// Used by both the homepage portfolio carousel (components/OurWork.tsx) and the
// per-ICP landing pages (app/[icp]/page.tsx → components/ICPPageClient.tsx).
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
  const w = orientation === 'horizontal' ? 1500 : 700;

  if (src.includes('player.cloudinary.com/embed')) {
    try {
      const url      = new URL(src);
      const publicId = url.searchParams.get('public_id');
      const cloud    = url.searchParams.get('cloud_name') || 'du6yx2h01';
      if (publicId) return `https://res.cloudinary.com/${cloud}/video/upload/c_scale,w_${w},q_auto:good,f_auto/${publicId}.mp4`;
    } catch { return null; }
  }
  if (src.includes('res.cloudinary.com') && src.includes('/video/upload/')) {
    if (/[,/]w_\d+/.test(src)) return src;
    return src.replace('/video/upload/', `/video/upload/c_scale,w_${w},q_auto:good/`);
  }
  if (src.includes('.mp4')) return src;
  return null;
}
