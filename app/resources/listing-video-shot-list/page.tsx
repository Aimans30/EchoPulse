import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ShotListCapture from '@/components/ShotListCapture';

/**
 * /resources/listing-video-shot-list: lead magnet for real estate agents.
 * The whole list is on the page. The email form only sends a printable copy.
 * Server component; the one client island is ShotListCapture.
 */

const SITE_URL = 'https://echopulse.media';
const URL_PATH = `${SITE_URL}/resources/listing-video-shot-list`;
const TITLE = 'Listing Video Shot List: 24 Phone Shots';
const DESCRIPTION =
  'A room-by-room list of 24 shots to film on your phone for a listing video. How to hold the phone, how long each shot runs, and why it earns its place.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL_PATH },
  openGraph: {
    title: `${TITLE} | EchoPulse Media`,
    description: DESCRIPTION,
    url: URL_PATH,
    siteName: 'EchoPulse Media',
    type: 'article',
    images: ['/og-echopulse-media.png'],
  },
};

type Shot = { name: string; how: string; why: string };
type Room = { id: string; title: string; intro: string; shots: Shot[] };

const ROOMS: Room[] = [
  {
    id: 'exterior',
    title: 'Exterior and arrival',
    intro: 'The opening shot gets the most attention. Start outside, in good light.',
    shots: [
      {
        name: 'Street approach',
        how: 'Chest height, walk slowly toward the house along the pavement. Hold 6 to 8 seconds.',
        why: 'It shows how the house sits on its street, which is the first thing a buyer checks.',
      },
      {
        name: 'Front facade, wide',
        how: 'Stand across the street or at the end of the drive, phone at chest height, no movement. Hold 4 seconds.',
        why: 'This is your opening frame and your cover image. Keep the roofline and both edges of the house in view.',
      },
      {
        name: 'Front door push-in',
        how: 'Walk from the path to the door with the phone at chest height. Finish with the door centred. 5 seconds.',
        why: 'The walk gives the viewer a reason to follow you inside.',
      },
      {
        name: 'Curb detail',
        how: 'Waist height, still. Frame the house number, the front garden or the porch light. 3 seconds.',
        why: 'A close frame breaks up the wide shots and gives the editor a clean place to cut.',
      },
    ],
  },
  {
    id: 'entry',
    title: 'Entry',
    intro: 'Open the door and film what a visitor sees first.',
    shots: [
      {
        name: 'Doorway reveal',
        how: 'Stand outside the open door at chest height and step in slowly. 5 seconds.',
        why: 'It copies the moment a buyer walks in, so the video feels like a visit.',
      },
      {
        name: 'Entry hall, looking in',
        how: 'Stand in the doorway, chest height, still. Aim down the longest line of sight. 4 seconds.',
        why: 'It shows the layout and how far the home runs back.',
      },
    ],
  },
  {
    id: 'living',
    title: 'Living areas',
    intro: 'These rooms carry most of the video. Turn every light on before you start.',
    shots: [
      {
        name: 'Living room, wide from the corner',
        how: 'Stand in the corner, phone at chest height and level, still. Hold 5 seconds.',
        why: 'A corner shot shows two walls and the whole floor, so the room reads as large as it is.',
      },
      {
        name: 'Living room, slow pan',
        how: 'Same spot, turn your body left to right over 8 seconds. Keep elbows tucked in.',
        why: 'A slow pan shows how the windows, seating area and exits relate to each other.',
      },
      {
        name: 'Feature detail',
        how: 'Waist to chest height, a slow step forward on the fireplace, built-ins or a statement window. 4 seconds.',
        why: 'Pick one feature per room and give it its own shot.',
      },
      {
        name: 'Dining area',
        how: 'Chest height from the edge of the room, still or a slow 3 second drift sideways. Hold 5 seconds in all.',
        why: 'It answers whether the table fits and how the room opens onto the kitchen.',
      },
    ],
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    intro: 'Clear the counters before you film.',
    shots: [
      {
        name: 'Kitchen, wide from the doorway',
        how: 'Chest height, level, still. Hold 5 seconds.',
        why: 'It shows the full layout: where the island is and how the cook moves.',
      },
      {
        name: 'Counter and cabinet detail',
        how: 'Slightly above counter height, glide 1 metre along the worktop. 5 seconds.',
        why: 'Finish and storage show up here, so keep the move slow.',
      },
      {
        name: 'Island or appliance walk',
        how: 'Chest height, walk a slow half circle around the island. 6 seconds.',
        why: 'Movement around a fixed object gives the edit depth that a still frame cannot.',
      },
    ],
  },
  {
    id: 'bedrooms',
    title: 'Bedrooms',
    intro: 'Open the blinds, turn on the lamps and make the beds first.',
    shots: [
      {
        name: 'Primary bedroom, wide',
        how: 'From the corner by the door, chest height, still. 5 seconds.',
        why: 'It shows whether a king bed and two side tables fit.',
      },
      {
        name: 'Primary bedroom, window or closet',
        how: 'Slow pan from the bed toward the window or walk-in closet. 6 seconds.',
        why: 'Light and storage are what a buyer looks for in this room.',
      },
      {
        name: 'Second bedroom',
        how: 'Doorway, chest height, still. 4 seconds. Film one more bedroom the same way if there are several.',
        why: 'It shows buyers with children or an office what each room can become.',
      },
    ],
  },
  {
    id: 'bathrooms',
    title: 'Bathrooms',
    intro: 'Lids down, towels folded, mirrors wiped. Check for your reflection before you press record.',
    shots: [
      {
        name: 'Primary bathroom, wide',
        how: 'From the doorway, chest height, still. 4 seconds. Step to the side if you are in the mirror.',
        why: 'It shows the size of the room and whether it has a shower, a tub or both.',
      },
      {
        name: 'Shower or vanity detail',
        how: 'Waist height, slow push-in of 1 metre toward the shower or double vanity. 4 seconds.',
        why: 'Tile and fittings are what separate an updated bathroom from an original one.',
      },
    ],
  },
  {
    id: 'outdoor',
    title: 'Outdoor space',
    intro: 'Film outside while the light is soft and the grass is dry.',
    shots: [
      {
        name: 'Backyard, from the back door',
        how: 'Chest height, step out slowly and stop at the edge of the patio. 6 seconds.',
        why: 'It gives the indoor to outdoor link, which is a selling point on its own.',
      },
      {
        name: 'Patio, deck or pool detail',
        how: 'Waist height, glide sideways 1 metre along the main outdoor feature. 5 seconds.',
        why: 'It records the main outdoor feature as it looks today, so buyers can judge it themselves.',
      },
    ],
  },
  {
    id: 'neighbourhood',
    title: 'Neighbourhood',
    intro: 'Keep this to one clip unless the area is the main selling point.',
    shots: [
      {
        name: 'Street or park nearby',
        how: 'Chest height, still, from the end of the street or at the nearest park entrance. 5 seconds.',
        why: 'It tells buyers what the walk to the shops or school looks like, which a map cannot.',
      },
    ],
  },
  {
    id: 'agent',
    title: 'Agent on camera',
    intro: 'Hand the phone to someone, or prop it on a tripod. Look at the lens, not the screen.',
    shots: [
      {
        name: 'Opening line, outside',
        how: 'Chest height, you in front of the house, one take of 6 to 8 seconds. Say the address and the one thing buyers will like most.',
        why: 'A face and a voice at the start turns a slideshow into a person talking to the viewer.',
      },
      {
        name: 'Walk and talk, inside',
        how: 'Hold the phone at chest height and walk backward through the living area while you talk, 8 seconds. Have someone watch the floor behind you.',
        why: 'It ties the rooms together and lets the viewer hear which room matters most to you.',
      },
      {
        name: 'Closing line, at the front door',
        how: 'Same height and spot as the opener, 5 to 6 seconds. Say how to book a viewing and your name.',
        why: 'The video needs an ending that tells the viewer what to do next.',
      },
    ],
  },
];

const TIPS: string[] = [
  'Film vertical (9:16) for Reels, TikTok and Shorts. If you also need a horizontal copy, film every shot twice rather than cropping later.',
  'Wipe the lens with a clean cloth before you start. It takes 5 seconds and fixes a hazy picture.',
  'Turn every light on and open every blind. Film in daylight where you can.',
  'Tap the screen to lock focus and exposure on the room, not the window.',
  'Move slower than feels natural. Cut anything that looks rushed.',
  'Film each shot for 2 seconds longer than the time listed. The editor trims the start and end.',
];

const TOTAL = ROOMS.reduce((n, r) => n + r.shots.length, 0);

// Running number at the start of each room, so the numbering carries across lists.
const STARTS: number[] = [];
{
  let n = 1;
  for (const r of ROOMS) {
    STARTS.push(n);
    n += r.shots.length;
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'HowTo',
      '@id': `${URL_PATH}#howto`,
      name: `How to film a listing video on your phone: ${TOTAL} shots`,
      description: DESCRIPTION,
      url: URL_PATH,
      tool: [
        { '@type': 'HowToTool', name: 'Smartphone' },
        { '@type': 'HowToTool', name: 'Microfibre cloth for the lens' },
        { '@type': 'HowToTool', name: 'Phone tripod or gimbal (optional)' },
      ],
      step: ROOMS.map((room, ri) => ({
        '@type': 'HowToSection',
        name: room.title,
        position: ri + 1,
        itemListElement: room.shots.map((s, si) => ({
          '@type': 'HowToStep',
          name: `Shot ${STARTS[ri] + si}: ${s.name}`,
          text: `${s.how} ${s.why}`,
          position: si + 1,
        })),
      })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${URL_PATH}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Resources', item: `${SITE_URL}/resources` },
        { '@type': 'ListItem', position: 3, name: 'Listing video shot list', item: URL_PATH },
      ],
    },
  ],
};

export default function ListingShotListPage() {
  return (
    <>
      <Nav />
      <main id="main" className="sl-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />

        <section className="sl-hero">
          <nav aria-label="Breadcrumb" className="sl-crumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/resources">Resources</Link>
          </nav>
          <p className="sl-eyebrow">Free resource for real estate agents</p>
          <h1 className="sl-h1">Listing video shot list: {TOTAL} shots to film on your phone</h1>
          <p className="sl-lede">
            Film these {TOTAL} shots in this order and an editor has enough to cut a listing video. Each one has the phone height, the movement, the length in seconds and the reason it is there.
          </p>
          <p className="sl-note">Our estimate is 30 to 45 minutes at the property once it is clean and the lights are on.</p>
        </section>

        <section className="sl-sec" aria-labelledby="sl-before">
          <h2 id="sl-before" className="sl-h2">Before you press record</h2>
          <ul className="sl-tips">
            {TIPS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        {ROOMS.map((room, ri) => (
          <section key={room.id} className="sl-sec" aria-labelledby={`sl-${room.id}`}>
            <h2 id={`sl-${room.id}`} className="sl-h2">{room.title}</h2>
            <p className="sl-intro">{room.intro}</p>
            <ol className="sl-shots" start={STARTS[ri]}>
              {room.shots.map((s, si) => (
                <li key={s.name} className="sl-shot" value={STARTS[ri] + si}>
                  <span className="sl-num" aria-hidden="true">{STARTS[ri] + si}</span>
                  <div className="sl-body">
                    <h3>{s.name}</h3>
                    <p><span className="sl-label">Film it</span> {s.how}</p>
                    <p><span className="sl-label">Why it matters</span> {s.why}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <section className="sl-sec" aria-labelledby="sl-done">
          <h2 id="sl-done" className="sl-h2">Get the edit done for you</h2>
          <p className="sl-intro">
            Send us the clips and we cut the listing video, with captions and music, back to you within 48 hours. Your first 2 edits are free.
          </p>
          <div className="sl-links">
            <Link href="/free-edits" className="sl-btn">Get 2 free edits</Link>
            <Link href="/real-estate" className="sl-link">How we work with real estate agents</Link>
          </div>
        </section>

        <section className="sl-sec sl-capture">
          <ShotListCapture />
        </section>
      </main>
      <Footer />

      <style>{`
        .sl-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
        .sl-page > section { max-width: 860px; margin: 0 auto; padding: 48px 24px; border-top: 1px solid rgba(12,12,11,0.08); }
        .sl-page p, .sl-page li { line-height: 1.65; color: #3E3D3A; font-size: 16px; }
        .sl-page a { overflow-wrap: anywhere; }
        .sl-hero { padding-top: 140px !important; border-top: none !important; }
        .sl-crumb { display: flex; gap: 10px; align-items: center; font-size: 13px; color: #A8A49B; margin-bottom: 28px; }
        .sl-crumb a { color: #6E6B63; text-decoration: none; display: inline-flex; align-items: center; min-height: 44px; }
        .sl-eyebrow { font-size: 11px !important; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #E8541A !important; margin: 0 0 14px; }
        .sl-h1 { font-size: clamp(34px, 5.4vw, 60px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.03; margin: 0 0 22px; overflow-wrap: break-word; }
        .sl-h2 { font-size: clamp(24px, 3.2vw, 34px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.12; margin: 0 0 12px; }
        .sl-lede { font-size: 19px !important; color: #2E2C28 !important; max-width: 700px; margin: 0 0 14px; }
        .sl-note { font-size: 14px !important; color: #6E6B63 !important; margin: 0; }
        .sl-intro { max-width: 640px; margin: 0 0 22px; }
        .sl-tips { margin: 0; padding: 0 0 0 20px; display: grid; gap: 10px; max-width: 680px; }
        .sl-shots { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; }
        .sl-shot { display: grid; grid-template-columns: 48px minmax(0, 1fr); gap: 16px; padding: 20px 0; border-top: 1px solid rgba(12,12,11,0.12); }
        .sl-shot:last-child { border-bottom: 1px solid rgba(12,12,11,0.12); }
        .sl-num { font-size: 32px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; color: #E8541A; font-variant-numeric: tabular-nums; }
        .sl-body h3 { font-size: 19px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.25; margin: 0 0 8px; color: #0C0C0B; }
        .sl-body p { margin: 0 0 6px; font-size: 15.5px; }
        .sl-body p:last-child { margin-bottom: 0; }
        .sl-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6E6B63; margin-bottom: 2px; }
        .sl-links { display: flex; flex-wrap: wrap; gap: 14px 24px; align-items: center; }
        .sl-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 12px 26px; border-radius: 100px; background: #0C0C0B; color: #F2EEE7 !important; font-weight: 800; font-size: 15px; text-decoration: none; }
        .sl-btn:hover { background: #E8541A; }
        .sl-link { display: inline-flex; align-items: center; min-height: 44px; color: #0C0C0B; font-weight: 600; text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 3px; }
        .sl-link:hover { color: #E8541A; }
        .sl-capture { padding-bottom: 96px !important; }
        .sl-page a:focus-visible { outline: 3px solid #E8541A; outline-offset: 2px; }
        @media (max-width: 640px) {
          .sl-page > section { padding: 36px 18px; }
          .sl-hero { padding-top: 110px !important; }
          .sl-shot { grid-template-columns: 36px minmax(0, 1fr); gap: 12px; }
          .sl-num { font-size: 26px; }
          .sl-btn { width: 100%; }
        }
      `}</style>
    </>
  );
}
