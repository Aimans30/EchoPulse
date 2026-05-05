export interface ServiceData {
  slug: string;
  name: string;
  tagline: string;
  heroSub: string;
  accentColor: string;
  problemHeadline: string;
  problemBody: string;
  problemPoints: string[];
  solutionHeadline: string;
  solutionBody: string;
  steps: { num: string; title: string; body: string }[];
  deliverables: { icon: string; title: string; desc: string }[];
  result: { client: string; role: string; stat: string; statLabel: string; body: string };
  testimonial: { quote: string; name: string; role: string };
  faq: { q: string; a: string }[];
}

export const services: ServiceData[] = [
  {
    slug: 'video-editing',
    name: 'Video Editing',
    tagline: 'Content That Stops the Scroll.',
    heroSub: 'High-retention edits that turn raw footage into views, followers, and paying clients.',
    accentColor: '#E8541A',
    problemHeadline: 'Great footage. Terrible results.',
    problemBody: 'You show up, record, and post. But the views are low, the drop-off rate is brutal, and your content just disappears into the algorithm. The problem is not your content. It is the edit.',
    problemPoints: [
      'Slow intros that lose viewers in the first 3 seconds',
      'No retention hooks or pattern interrupts to keep people watching',
      'Generic captions and subtitles that add zero energy',
      'No platform-specific formatting for Reels, TikTok, or YouTube',
    ],
    solutionHeadline: 'We edit for retention, not just aesthetics.',
    solutionBody: 'Every edit we produce is engineered with one goal: keep people watching until the very last second. We use speed ramps, sound design, motion graphics, and storytelling structure to make your content impossible to scroll past.',
    steps: [
      { num: '01', title: 'You Send Raw Footage', body: 'Drop your footage into our shared drive with a short brief. Takes you under 10 minutes per video.' },
      { num: '02', title: 'We Edit for Your Platform', body: 'Our editors craft retention-first edits optimized for Instagram Reels, TikTok, YouTube Shorts, or long-form. Every format gets its own treatment.' },
      { num: '03', title: 'You Approve and Post', body: 'We deliver within 48 hours. Two rounds of revisions included. You approve, and we handle the export specs for every platform.' },
    ],
    deliverables: [
      { icon: '🎬', title: 'Short-Form Edits', desc: 'Reels, TikToks, and Shorts optimized for maximum watch time and shares.' },
      { icon: '📹', title: 'Long-Form Editing', desc: 'Podcasts, YouTube videos, and webinars cut for clarity and pacing.' },
      { icon: '⚡', title: 'Speed Ramps', desc: 'Cinematic transitions and speed effects that add premium production quality.' },
      { icon: '💬', title: 'Captions and Subtitles', desc: 'Animated, styled captions that keep mobile viewers watching on mute.' },
      { icon: '🎵', title: 'Sound Design', desc: 'Music, SFX, and audio mastering that makes your content feel professional.' },
      { icon: '🖼️', title: 'Thumbnails', desc: 'Click-worthy thumbnails built on proven formats that drive higher CTR.' },
    ],
    result: {
      client: 'Priya T.',
      role: 'Mindset Coach, UK',
      stat: '180K',
      statLabel: 'avg views per Reel',
      body: 'Priya was posting consistently but averaging under 2K views per video. After 60 days with our editing team, her Reels averaged 180K views and her DMs were full of inbound inquiries. She stopped running ads entirely.',
    },
    testimonial: {
      quote: 'The speed ramp edits they produce are on a completely different level. My Reels went from 2K average views to 180K consistently. Clients are already messaging.',
      name: 'Priya Thakur',
      role: 'Mindset Coach, UK',
    },
    faq: [
      { q: 'How fast is the turnaround?', a: 'Standard turnaround is 48 hours per video. Rush delivery is available for urgent content.' },
      { q: 'How do I send my footage?', a: 'We set up a shared Google Drive or Dropbox folder. You drop in footage and a brief, and we handle the rest.' },
      { q: 'Do you edit for all platforms?', a: 'Yes. We edit for Instagram Reels, TikTok, YouTube Shorts, YouTube long-form, LinkedIn, and podcast video.' },
      { q: 'How many revisions are included?', a: 'Every video includes two rounds of revisions at no extra charge.' },
    ],
  },
  {
    slug: 'automations',
    name: 'Automations',
    tagline: 'Your Business Runs While You Sleep.',
    heroSub: 'Full automation systems that handle DMs, book calls, and nurture leads without you lifting a finger.',
    accentColor: '#8b5cf6',
    problemHeadline: 'You are doing work that a system should handle.',
    problemBody: 'Every day you manually reply to the same DMs, chase leads who never respond, and watch warm prospects go cold because you forgot to follow up. This is not a people problem. It is a systems problem.',
    problemPoints: [
      'DMs and comments going unanswered for hours or days',
      'Leads falling through the cracks with no follow-up',
      'Manually sending the same welcome emails over and over',
      'No system to qualify leads before they hit your calendar',
    ],
    solutionHeadline: 'One system. Every lead captured. Every call booked.',
    solutionBody: 'We build your full automation stack using ManyChat, GoHighLevel, and email platforms. Every inquiry gets an instant response. Every interested prospect gets nurtured. Every qualified lead lands on your calendar.',
    steps: [
      { num: '01', title: 'Audit and Strategy', body: 'We map your entire customer journey from first touchpoint to booked call and identify every gap where leads are slipping through.' },
      { num: '02', title: 'Build and Integrate', body: 'We build your DM automation flows, email sequences, CRM pipelines, and lead qualification systems all connected to your calendar.' },
      { num: '03', title: 'Launch and Optimize', body: 'We go live, monitor performance for the first 30 days, and optimize open rates, response rates, and conversion rates.' },
    ],
    deliverables: [
      { icon: '💬', title: 'DM Automation', desc: 'ManyChat flows that respond instantly to comments and DMs, qualify leads, and drive them to book.' },
      { icon: '📧', title: 'Email Sequences', desc: 'Welcome flows, nurture sequences, and sales emails that convert on autopilot.' },
      { icon: '📅', title: 'Calendar Booking', desc: 'Automated booking flows that fill your calendar with qualified prospects only.' },
      { icon: '🔗', title: 'CRM Setup', desc: 'GoHighLevel or equivalent setup so every lead is tracked and no one falls through the cracks.' },
      { icon: '🎯', title: 'Lead Qualification', desc: 'Application forms and filters that ensure only serious buyers reach your calls.' },
      { icon: '📊', title: 'Analytics Dashboard', desc: 'Live reporting on open rates, booking rates, and revenue attributed to automation.' },
    ],
    result: {
      client: 'Laura B.',
      role: 'Business Coach, UK',
      stat: '30',
      statLabel: 'qualified leads per week',
      body: 'Laura was spending 3 hours daily on manual outreach with inconsistent results. We built her full automation stack in 2 weeks. Within 60 days she was receiving 20 to 30 qualified leads per week with zero paid ads and her close rate improved because every lead was pre-qualified.',
    },
    testimonial: {
      quote: 'They rebuilt my entire funnel and lead gen system. I am now getting 20 to 30 qualified leads per week without running a single ad. The ROI is insane.',
      name: 'Laura Bennett',
      role: 'Business Coach, UK',
    },
    faq: [
      { q: 'Which platforms do you build on?', a: 'We primarily build on ManyChat, GoHighLevel, ActiveCampaign, and Zapier. We work with your existing tools wherever possible.' },
      { q: 'How long does setup take?', a: 'Most automation systems are live within 10 to 14 business days. Complex multi-platform builds may take up to 21 days.' },
      { q: 'Do I need a large audience for automations to work?', a: 'No. Automations work with any audience size. We have built profitable systems for clients with under 1K followers.' },
      { q: 'Will the messages sound robotic?', a: 'No. We write all copy in your voice and run test conversations before going live. Most clients say their audience cannot tell the difference.' },
    ],
  },
  {
    slug: 'personal-branding',
    name: 'Personal Branding',
    tagline: 'Become the Name Everyone Knows.',
    heroSub: 'Strategic brand positioning that makes you the obvious choice in your niche and attracts premium clients.',
    accentColor: '#f59e0b',
    problemHeadline: 'You have the expertise. Nobody knows it.',
    problemBody: 'You are talented, experienced, and genuinely great at what you do. But your online presence does not reflect that. You blend in with everyone else in your space. When a potential client discovers you, nothing makes them stop and say "this is the one."',
    problemPoints: [
      'Inconsistent visual identity across all your platforms',
      'No clear positioning that separates you from competitors',
      'Content that does not reflect your premium value',
      'A bio that describes what you do but not why clients should choose you',
    ],
    solutionHeadline: 'A brand that commands attention and trust.',
    solutionBody: 'We build your personal brand from the positioning layer down. Strategy first, then visual identity, then content voice. The result is a brand that feels premium, attracts the right clients, and makes you impossible to ignore.',
    steps: [
      { num: '01', title: 'Brand Audit and Strategy', body: 'We analyze your current presence, your competitors, and your ideal client. We build your positioning strategy, core message, and brand pillars.' },
      { num: '02', title: 'Identity and Visual System', body: 'We design your visual identity including logo, colors, typography, and content templates so every post looks cohesive and high-end.' },
      { num: '03', title: 'Content Voice and Execution', body: 'We develop your content voice, your story, and your authority positioning. Then we produce content that reflects all of it.' },
    ],
    deliverables: [
      { icon: '🎯', title: 'Brand Positioning Strategy', desc: 'Your niche, differentiators, ideal client profile, and the exact message that makes you the obvious choice.' },
      { icon: '🎨', title: 'Visual Identity', desc: 'Logo, brand colors, typography system, and a complete style guide for every platform.' },
      { icon: '📱', title: 'Content Templates', desc: 'Custom Canva and After Effects templates that make every post look professionally designed.' },
      { icon: '✍️', title: 'Bio and Profile Optimization', desc: 'Optimized profiles across Instagram, LinkedIn, TikTok, and YouTube built to convert visitors into followers and followers into clients.' },
      { icon: '📖', title: 'Brand Story', desc: 'Your origin story, your mission, and your authority positioning written in a way that builds instant trust.' },
      { icon: '📈', title: 'Content Strategy', desc: 'A 90-day content plan aligned with your brand pillars and your business goals.' },
    ],
    result: {
      client: 'Daniel K.',
      role: 'Fitness Coach, Australia',
      stat: '41K',
      statLabel: 'followers in 4 months',
      body: 'Daniel had 3K followers and an inconsistent brand that looked like every other fitness coach online. We rebuilt his positioning, redesigned his visual identity, and aligned his content strategy. Four months later he had 41K followers and was turning away clients.',
    },
    testimonial: {
      quote: 'I went from 3K to 41K Instagram followers in 4 months. EchoPulse content strategy is unlike anything I have seen from other agencies. They actually understand creators.',
      name: 'Daniel Kim',
      role: 'Fitness Coach, Australia',
    },
    faq: [
      { q: 'Do I need to already have a following?', a: 'No. We have built personal brands from zero and helped established creators rebrand entirely. Both work well with our process.' },
      { q: 'How long until I see results?', a: 'Most clients see meaningful engagement improvements within 30 days. Significant follower and revenue growth typically happens in months 2 and 3.' },
      { q: 'Is this just about Instagram?', a: 'No. We build cross-platform brands. We prioritize the platforms most relevant to your business and audience.' },
      { q: 'Will I still sound like myself?', a: 'Always. Our strategy sessions are built around your personality and voice. We amplify what makes you unique, we do not replace it.' },
    ],
  },
  {
    slug: 'websites-funnels',
    name: 'Websites and Funnels',
    tagline: 'A Website That Actually Converts.',
    heroSub: 'Conversion-optimized websites and sales funnels that turn visitors into booked calls and paying clients.',
    accentColor: '#3b82f6',
    problemHeadline: 'Your website looks fine. It just does not convert.',
    problemBody: 'Traffic lands on your site, scrolls for a few seconds, and leaves. No inquiry, no booking, no sale. A beautiful website that does not convert is an expensive business card. What you need is a site built around one goal: getting people to take action.',
    problemPoints: [
      'Visitors land with no idea what you do or who you help',
      'No clear call to action above the fold',
      'Contact forms that kill momentum instead of booking calls',
      'Pages that inform but do not persuade',
    ],
    solutionHeadline: 'Built to convert. Not just to impress.',
    solutionBody: 'We design and build websites and funnels with conversion architecture at the center. Every section earns its place. Every button has a purpose. Every word is chosen to move the reader one step closer to working with you.',
    steps: [
      { num: '01', title: 'Strategy and Wireframe', body: 'We map the customer journey and design a conversion-optimized wireframe before a single pixel is designed.' },
      { num: '02', title: 'Design and Copy', body: 'We write the copy and design the visual layout simultaneously so the message and the design reinforce each other.' },
      { num: '03', title: 'Build, Launch, and Optimize', body: 'We build in your platform of choice, run pre-launch testing, go live, and monitor conversion rates for the first 30 days.' },
    ],
    deliverables: [
      { icon: '🌐', title: 'Brand Website', desc: 'A full website with home, about, services, and contact pages designed and built for conversions.' },
      { icon: '🎯', title: 'Sales Funnels', desc: 'Opt-in pages, sales pages, and checkout flows built to maximize conversion at every step.' },
      { icon: '📝', title: 'Landing Pages', desc: 'Standalone pages for lead magnets, webinars, launches, and campaigns.' },
      { icon: '✍️', title: 'Conversion Copywriting', desc: 'Every word written to move prospects through the funnel with clarity and persuasion.' },
      { icon: '🔗', title: 'Integrations', desc: 'Stripe, Kajabi, Teachable, GoHighLevel, Calendly, and email platform integration.' },
      { icon: '📊', title: 'Analytics Setup', desc: 'Google Analytics, Meta Pixel, and conversion tracking so you know exactly where revenue is coming from.' },
    ],
    result: {
      client: 'Amira R.',
      role: 'Course Creator, UAE',
      stat: '$80K',
      statLabel: 'course launch in 7 days',
      body: 'Amira had launched her course twice before and barely hit $10K. We rebuilt her sales page, redesigned her checkout flow, and rewrote every word of copy. Her third launch using our funnel generated $80K in 7 days with the same audience size.',
    },
    testimonial: {
      quote: 'My course launch made $80K in 7 days. I had tried twice before and barely hit $10K. The pre-launch content system EchoPulse built was the entire difference.',
      name: 'Amira Rahman',
      role: 'Course Creator, UAE',
    },
    faq: [
      { q: 'Which platforms do you build on?', a: 'We build on Webflow, Framer, WordPress, Kajabi, GoHighLevel, ClickFunnels, and custom Next.js. We recommend based on your needs.' },
      { q: 'Do you write the copy too?', a: 'Yes. Copywriting is included in every website and funnel project. We do not design around placeholder text.' },
      { q: 'How long does a website take?', a: 'A full brand website typically takes 3 to 4 weeks. Sales funnels and landing pages are usually 1 to 2 weeks.' },
      { q: 'Can you redesign my existing site?', a: 'Yes. Redesigns are common. We audit what is and is not working before starting so we keep what converts and fix what does not.' },
    ],
  },
  {
    slug: 'community-management',
    name: 'Community Management',
    tagline: 'A Community That Sells for You.',
    heroSub: 'Engaged, loyal communities that become your most powerful source of referrals, retention, and recurring revenue.',
    accentColor: '#10b981',
    problemHeadline: 'You have an audience. Not a community.',
    problemBody: 'You have members who joined, said nothing, and quietly disappeared. Engagement is low. No one refers anyone. The group feels like a ghost town and maintaining it feels like a second job with no measurable return.',
    problemPoints: [
      'Members joining and going silent within the first 48 hours',
      'No onboarding system to activate new members',
      'Engagement driven only when you personally show up',
      'No clear path from community member to paying client',
    ],
    solutionHeadline: 'An active community that runs and sells itself.',
    solutionBody: 'We take over your community operations entirely. We manage engagement, run programming, onboard new members, and build the systems that turn your community from a cost center into a conversion machine.',
    steps: [
      { num: '01', title: 'Community Audit', body: 'We assess your current community structure, engagement rates, member journey, and monetization pathways.' },
      { num: '02', title: 'Systems and Programming', body: 'We build your onboarding flow, weekly engagement calendar, content cadence, and member milestone system.' },
      { num: '03', title: 'Ongoing Management', body: 'Our team manages daily engagement, responds to members, runs events, and reports on growth and conversion metrics every month.' },
    ],
    deliverables: [
      { icon: '👋', title: 'Onboarding System', desc: 'A structured welcome sequence that activates new members within 24 hours of joining.' },
      { icon: '📅', title: 'Engagement Calendar', desc: 'A weekly content and engagement plan that keeps the community active without you.' },
      { icon: '🎯', title: 'Conversion Pathways', desc: 'Built-in funnels that move engaged members toward your paid offers naturally.' },
      { icon: '📊', title: 'Monthly Reports', desc: 'Detailed monthly reporting on growth, engagement, retention, and revenue attribution.' },
      { icon: '🎪', title: 'Live Events', desc: 'Monthly live sessions, Q and As, or challenges planned and facilitated by our team.' },
      { icon: '🔔', title: 'Moderation', desc: 'Daily moderation to keep the community safe, positive, and valuable for every member.' },
    ],
    result: {
      client: 'Ryan O.',
      role: 'Online Coach, Canada',
      stat: '340%',
      statLabel: 'engagement increase in 6 weeks',
      body: 'Ryan had 8,000 community members and barely 2% active engagement. We took over community management, redesigned the onboarding experience, and launched a monthly challenge series. Within 6 weeks engagement increased 340% and the community became his top source of upsells.',
    },
    testimonial: {
      quote: 'EchoPulse manages my community of 8,000 members and handles all my short-form content. My engagement went up 340% in the first 6 weeks.',
      name: 'Ryan O\'Brien',
      role: 'Online Coach, Canada',
    },
    faq: [
      { q: 'Which community platforms do you manage?', a: 'We manage Facebook Groups, Circle, Skool, Discord, Mighty Networks, and Slack communities.' },
      { q: 'Do I need a large community to start?', a: 'No. We work with communities of 200 members and communities of 200K. The systems scale.' },
      { q: 'How do you match the community voice?', a: 'We run a 2-week onboarding process with your team to learn your tone, values, and how you communicate with your audience.' },
      { q: 'Can you help grow the community too?', a: 'Yes. Community growth is part of our service. We connect community management with your content strategy to drive new members from your organic content.' },
    ],
  },
  {
    slug: 'lead-generation',
    name: 'Lead Generation',
    tagline: 'Leads Every Week. Zero Paid Ads.',
    heroSub: 'A content-powered lead generation system that fills your calendar with qualified prospects every single week.',
    accentColor: '#E8541A',
    problemHeadline: 'Your pipeline is unpredictable. That is killing your business.',
    problemBody: 'Some months the leads come in, other months you are scrambling. You are either burning cash on ads that stop working the moment you pause them, or you are relying on referrals that are inconsistent at best. Neither is a business. It is a gamble.',
    problemPoints: [
      'Leads drying up the moment you stop posting or advertising',
      'No system to capture and nurture people who are not yet ready to buy',
      'Relying on referrals with no way to predict or scale them',
      'Spending time on discovery calls with people who cannot afford your services',
    ],
    solutionHeadline: 'A lead machine that compounds every week.',
    solutionBody: 'We build a content-led lead generation system that attracts, captures, and nurtures your ideal client. Content drives them in. Lead magnets capture them. Automation nurtures them. Your calendar fills up without spending a dollar on ads.',
    steps: [
      { num: '01', title: 'Ideal Client Targeting', body: 'We define your ideal client in detail including their pain points, language patterns, and the content they cannot ignore.' },
      { num: '02', title: 'Content and Lead Magnet System', body: 'We create content designed to attract your ideal client and a lead magnet that captures their contact details in exchange for genuine value.' },
      { num: '03', title: 'Nurture and Convert', body: 'Captured leads enter an automated email and DM sequence that builds trust, handles objections, and books calls on your calendar.' },
    ],
    deliverables: [
      { icon: '🧲', title: 'Lead Magnet Creation', desc: 'A high-value free resource that your ideal client will give their email address to receive.' },
      { icon: '📱', title: 'Content Strategy', desc: 'A content plan engineered to attract and pre-sell your ideal client before they ever get on a call with you.' },
      { icon: '📧', title: 'Nurture Sequences', desc: 'Email and DM flows that build trust and move leads from aware to ready to buy.' },
      { icon: '🎯', title: 'Targeting Framework', desc: 'A defined ideal client profile and messaging guide that makes every piece of content laser-targeted.' },
      { icon: '📊', title: 'Pipeline Dashboard', desc: 'A live dashboard showing leads captured, emails opened, calls booked, and revenue generated.' },
      { icon: '🔁', title: 'Retargeting System', desc: 'Follow-up sequences for leads who went cold so no interested prospect is ever wasted.' },
    ],
    result: {
      client: 'Jake M.',
      role: 'Personal Brand Coach, USA',
      stat: '47%',
      statLabel: 'lower client acquisition cost',
      body: 'Jake was spending $4,000 per month on Facebook ads with a 12% close rate on low-quality leads. We built him a content-led lead generation system. Within 90 days he was generating more qualified leads organically, cut his ad spend to zero, and his close rate improved to 31% because leads arrived already educated and pre-sold.',
    },
    testimonial: {
      quote: 'EchoPulse turned my raw footage into scroll-stopping content. Within 60 days my DMs were full of people asking how to work with me. Best investment I have made in my brand.',
      name: 'Jake Morrison',
      role: 'Personal Brand, USA',
    },
    faq: [
      { q: 'How long until I see leads coming in?', a: 'Most clients see initial leads within 2 to 3 weeks of the system going live. Consistent, predictable lead flow typically builds over 60 to 90 days.' },
      { q: 'Do I need a big audience?', a: 'No. We have built lead generation systems for clients with under 500 followers. Audience size matters less than the quality of your targeting and content.' },
      { q: 'Is this just about Instagram?', a: 'No. We build cross-platform lead generation systems using the channels where your ideal clients already spend time.' },
      { q: 'What if my lead magnet does not convert?', a: 'We run a 30-day optimization phase after launch. If conversion rates are below benchmark, we test and iterate until they improve.' },
    ],
  },
];

export function getService(slug: string): ServiceData | undefined {
  return services.find(s => s.slug === slug);
}
