import { PRESENCE, GROWTH } from './pricing';

const PRESENCE_P = PRESENCE.priceLabel;
const GROWTH_P = GROWTH.priceLabel;

export interface ServiceData {
  slug: string;
  name: string;
  tagline: string;
  heroSub: string;
  /**
   * <meta description>, 120 to 160 chars.
   *
   * Separate from `heroSub` on purpose. `heroSub` is a 2 to 4 sentence pitch
   * paragraph written for someone already on the page; it runs 251 to 448
   * characters. Google truncates snippets around 155, so using it as the
   * description meant every service page got cut mid-sentence and the actual
   * value proposition never reached the SERP. lib/icpData.ts already keeps
   * these fields separate; this matches that.
   */
  metaDescription: string;
  accentColor: string;
  problemHeadline: string;
  problemBody: string;
  problemPoints: string[];
  solutionHeadline: string;
  solutionBody: string;
  steps: { num: string; title: string; body: string }[];
  /**
   * The delivery time shown in the Method section header, e.g.
   * "48-HOUR TURNAROUND" or "2 TO 8 WEEKS BY SCOPE".
   *
   * This exists because the header used to compute the timeline as
   * `steps.length * 2` and print "6 TO 7 DAYS", which is arithmetic on a step
   * count rather than a delivery estimate. Every service has three steps, so
   * every page promised 6 to 7 days, including the one whose own FAQ says a
   * SaaS MVP takes 4 to 8 weeks and the one whose pricing table lists 4 to 6
   * week builds. A buyer who read both had been given two different answers by
   * the same page.
   *
   * Must match a claim this service already makes in its own copy. Check
   * `steps`, `faq` and `deliverables` before changing it.
   */
  methodTimeline: string;
  deliverables: { icon: string; title: string; desc: string }[];
  result: { client: string; role: string; stat: string; statLabel: string; body: string };
  testimonial: { quote: string; name: string; role: string };
  faq: { q: string; a: string }[];
}

export const services: ServiceData[] = [
  {
    slug: 'video-editing',
    name: 'Video Editing',
    tagline: 'Every Format. One Editor at Your Disposal.',
    heroSub: 'Whatever needs cutting, we cut it. YouTube long-form, podcast episodes and highlight cuts, course module edits, Reels and TikToks, cinematic property work, talking-head founder content. One team cuts all of it, paced for the platform each video is going to. Short-form edits come back in 48 hours; long-form depends on the length.',
    metaDescription: 'Video editing for founders: Reels, YouTube long-form, podcasts, and course modules. One team, every format. Short-form edits back in 48 hours.',
    accentColor: '#E8541A',
    problemHeadline: 'Great footage. Mediocre results.',
    problemBody: 'You record, post, and watch the views stall. The drop-off is brutal, the engagement is flat, and you cannot tell whether the content or the edit is the problem. In our experience it is almost always the edit.',
    problemPoints: [
      'Slow intros that lose viewers in the first 2 seconds on mobile',
      'No retention hooks, no pattern interrupts, no story arc',
      'Generic captions and static text overlays that add zero energy',
      'No platform-specific formatting for Reels, TikTok, Shorts, YouTube, or course modules',
    ],
    solutionHeadline: 'Every kind of edit. One team.',
    solutionBody: 'YouTube long-form, podcast cuts, course modules, short-form for the algorithm, cinematic real estate, talking-head founder content, motion graphic ads. Speed ramps, sound design, captions, color grade. Whatever the format demands, we cut it with the shot grammar tuned to where it is shipping, and you deal with one team for all of it.',
    methodTimeline: '48-HOUR TURNAROUND',
    steps: [
      { num: '01', title: 'You Send Footage', body: 'Upload anything: podcast episode, YouTube vlog, course module, drone footage, walkthrough, talking head, ad. Drop it in our shared folder with a 2-line brief on the goal.' },
      { num: '02', title: 'We Edit and Optimize', body: 'Editor cuts retention-first, applies sound design, color grade, and adds platform-specific captions. Optional motion graphic add-ons. 48-hour standard turnaround on short-form edits.' },
      { num: '03', title: 'You Approve and Ship', body: 'Revisions until you are satisfied. We deliver master file plus mobile-optimized exports for every platform you publish to.' },
    ],
    deliverables: [
      { icon: '🎬', title: 'Short-Form Edits', desc: 'Reels, TikToks, Shorts engineered for mobile feed. Speed ramps, hooks, captions burned in.' },
      { icon: '📺', title: 'YouTube Long-Form', desc: 'Vlogs, sponsored videos, educational long-form, video essays. Cut for watch-time retention.' },
      { icon: '🎙️', title: 'Podcast Edits + Highlights', desc: 'Full episode polish (cuts, levels, music) plus 8 to 12 short-form highlight clips per episode.' },
      { icon: '🎓', title: 'Course Module Editing', desc: 'Kajabi, Teachable, Thinkific, Skool. Lecture cuts, lower thirds, chapter markers, branded intros.' },
      { icon: '🏠', title: 'Cinematic + Brand Films', desc: 'Property tours, listing reels, brand films, founder portraits. Built on shot grammar refined at a Canadian production studio.' },
      { icon: '✨', title: 'Motion + Sound Design', desc: 'Animated logos, kinetic text, motion graphic ads. Music selection, SFX, audio mastering, color grading.' },
    ],
    result: {
      client: 'EchoPulse',
      role: 'Production benchmarks',
      stat: '48 hr',
      statLabel: 'turnaround on short-form edits',
      body: 'Our team learned property reels at Vizionary Focus, a Canadian production studio, before going independent. Standard production cycle is 48 hours per short-form edit, with revisions until you are satisfied. Rush 24-hour delivery can be arranged directly with us at a 30 percent surcharge when a date genuinely depends on it.',
    },
    testimonial: {
      quote: 'We are a young studio. Our first client testimonials are still in production. What we will not do is fabricate them. We will let you talk to a real client once we have one to introduce you to.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'How fast is the turnaround?', a: 'Standard is 48 hours per short-form edit. Long-form takes longer, depending on the length of the video. If something is genuinely time-sensitive, a launch date or a listing going live, ask on the call or in the shared folder and we will tell you honestly whether we can hit 24 hours that week. Rush carries a 30 percent surcharge and is arranged directly with us rather than through the self-serve order page.' },
      { q: 'How do I send footage?', a: 'We set up a shared Google Drive or Dropbox folder for each client. Upload your raw footage with a brief. We handle the rest.' },
      { q: 'Do you edit for all platforms?', a: 'Yes. Reels, TikTok, YouTube Shorts, YouTube long-form, LinkedIn video, podcast video, and listing-site MP4 exports are all standard.' },
      { q: 'What actually happens on the call?', a: '15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.' },
    ],
  },
  {
    slug: 'linkedin-ghostwriting',
    name: 'LinkedIn & Social',
    tagline: 'Posts your buyers actually stop scrolling for.',
    heroSub: 'Done-for-you LinkedIn and social content built around a recorded onboarding interview of about an hour. Written, edited, scheduled, shipped. No "Here is the thing," no em-dashes, no template energy. Just posts that fit your business and earn replies from real buyers.',
    metaDescription: 'Done-for-you LinkedIn ghostwriting for founders, written from a recorded interview of about an hour so posts sound like you. You approve every draft.',
    accentColor: '#8b5cf6',
    problemHeadline: 'Most LinkedIn content reads like a robot wrote it. Your audience knows.',
    problemBody: 'You hire a $5K per month agency. They send posts that sound exactly like every other agency. Your audience can tell. Replies dry up. The post gets likes from bots and nothing from real buyers, real prospects, or real referrals. Your name is on it, but nothing about it sounds like you.',
    problemPoints: [
      'Generic hooks anyone could have written ("Here is the thing...")',
      'Em-dashes stuffed in as commas, twelve to a post',
      'Recycled buzzwords (delve, leverage, navigate, tapestry) in every paragraph',
      'No real stories, no specific POVs, no business context, just bland advice',
    ],
    solutionHeadline: 'One onboarding session. Posts that fit your business.',
    solutionBody: 'Every client starts with a recorded onboarding interview of about an hour at kickoff. We cover your offer, your buyers, your competitors, your wins, and the way you already talk about what you do. That session becomes the brief our writers work from on every post. Every draft gets read by a human who knows the brief, and rewritten if it sounds generic. Result: posts that fit your business and your buyers.',
    methodTimeline: '48-HOUR TURNAROUND',
    steps: [
      { num: '01', title: 'Onboarding Interview', body: 'A recorded session of about an hour. We cover your offer, your buyers, your competitors, the wins you talk about, and the way you already describe your business. Compiled into a structured brief the whole team works from.' },
      { num: '02', title: 'Editorial Calendar', body: 'Monthly content calendar built from your brief, the questions your buyers actually ask, and what your audience responds to. We pick topics that earn replies, not just impressions. You approve each calendar before we write.' },
      { num: '03', title: 'Write, Edit, Ship', body: 'Drafts written against the brief. Read by a human editor who flags anything that sounds like generic LinkedIn. Rewritten until it fits. You approve every post before it publishes.' },
    ],
    deliverables: [
      { icon: '✍️', title: 'Short-Form Posts', desc: '8 photo or carousel posts a month on Presence Engine, 20 social posts a month on Growth. Story-driven, opinion-driven, or tactical. Never generic listicles.' },
      { icon: '📊', title: 'Carousel Posts', desc: 'Carousels count toward your monthly post total. 8 to 12 slides built for saves, shares, and DMs.' },
      { icon: '🎙️', title: 'Brand Brief Document', desc: 'Your brand brief. Interview transcript, audience map, offer breakdown, story bank, banned phrases. Yours forever, even if you cancel.' },
      { icon: '📝', title: 'Profile Optimization', desc: 'Headline, About, Featured section, and banner rewritten once per quarter to match your evolving positioning.' },
      { icon: '📈', title: 'Monthly Performance Review', desc: 'Impressions, comments, profile visits, DMs from buyers. Optimize the calendar based on what is working.' },
    ],
    result: {
      client: 'Onboarding Interview',
      role: 'Kickoff standard',
      stat: '1 hour',
      statLabel: 'recorded onboarding session',
      body: 'Every engagement starts with a recorded onboarding session of about an hour where we map your offer, your buyer, and the way you already talk about your business. The transcript becomes the source brief for every post we write for you, for as long as you stay. Refreshed quarterly to stay aligned with how the business is evolving.',
    },
    testimonial: {
      quote: 'The structured onboarding brief is the whole difference. Without it you are guessing at someone\'s voice. With it you are working from the way they already describe their own business.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'How is this different from a $200 per month content writer?', a: 'Cheap writers use templates. We use a structured brand brief built from a recorded interview of about an hour with you. The posts fit your business because we built a system around your actual offer and audience, not a template stuffed with industry buzzwords.' },
      { q: 'Will my audience know it is written by someone else?', a: 'That is the bar we write to. The brand brief is built from a recorded interview of about an hour, so every post is anchored to phrases and stories you have actually used, not to a template. You approve each draft before it goes out, so nothing publishes in a voice you would not use yourself.' },
      { q: 'How many posts per month?', a: 'Presence Engine at $399 a month includes 8 photo or carousel posts a month. Growth at $1,997 a month includes 20 social posts a month. Carousels count toward those totals.' },
      { q: 'Do I have to approve every post?', a: 'Yes. You see every draft before it publishes. Revisions are unlimited until you are satisfied with the post. Expect more changes on the first few posts while we learn how you talk, and fewer after that.' },
      { q: 'What actually happens on the call?', a: '15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.' },
    ],
  },
  {
    slug: 'blog-production',
    name: 'Blog Production',
    tagline: 'Sourced blogs written for Google and AI answers.',
    heroSub: 'Long-form blogs written to rank on Google and to be quoted by ChatGPT, Claude and Perplexity when your buyers ask the questions you sell the answers to. Every statistic has a working source link, and a person edits every draft before you see it.',
    metaDescription: 'SEO blog writing built to rank on Google and get cited by ChatGPT and Perplexity. Real research, real sources, edited by a human before it ships.',
    accentColor: '#f59e0b',
    problemHeadline: 'Your blog reads like a robot wrote it. Your readers can tell.',
    problemBody: 'You signed up for a content agency. They send you 4 blogs per month. 1,500 words each of vague, recycled prose with zero specific examples. Bounce rate is 80 percent. SEO is flat. Nobody is signing up.',
    problemPoints: [
      'Generic outlines with no specific angle or point of view',
      'Vague language: "many companies," "studies show," "experts say"',
      'Recycled buzzwords (delve, navigate, tapestry, in today\'s fast-paced world)',
      'No real examples, no real numbers, no real customer stories',
    ],
    solutionHeadline: 'Real research. Real writing. Human editing.',
    solutionBody: 'Every blog goes through eight steps: brand strategy, topic research, SERP analysis, outline approval, source research, draft, human edit, SEO and distribution. Real data, real customer examples, real expert quotes (with working source links). A human editor rewrites anything that sounds like generic AI output. The piece ships when it fits your business, not before.',
    methodTimeline: '48-HOUR TURNAROUND',
    steps: [
      { num: '01', title: 'Topic and Outline', body: 'Monthly topic calendar built from your brief, the questions your buyers are searching, and where you have real authority. You approve each outline before we research or write.' },
      { num: '02', title: 'Research and Draft', body: 'Real statistics with real source links. Real customer examples. Real expert quotes. The first draft is written against your brief, not pulled from a template.' },
      { num: '03', title: 'Edit and Ship', body: 'A human editor reads the draft, flags anything generic, rewrites until it sounds like your business. SEO and distribution pack included with every blog.' },
    ],
    deliverables: [
      { icon: '📝', title: 'Long-Form Blogs', desc: '1,500 to 2,500 words, up to 3,000 for pillar pieces. Real research, real examples, a specific point of view. Reads like a human wrote it because one did.' },
      { icon: '🔬', title: 'Source Verification', desc: 'Every statistic and quote has a working source link. We never fabricate data, even when AI would be faster.' },
      { icon: '🎯', title: 'SEO and Meta Pack', desc: 'Title, meta description, slug, internal link suggestions, schema recommendation, 5 authoritative external links per post.' },
      { icon: '📱', title: 'Distribution Pack', desc: 'LinkedIn post, Twitter thread, newsletter blurb, cold email pitch, and 3 quote graphics built from each blog.' },
      { icon: '🎨', title: 'Image Briefs', desc: 'Hero image concept plus 2 in-post image concepts. Written for your design team or generated by us.' },
      { icon: '📈', title: 'Performance Tracking', desc: 'Monthly review of organic traffic, time on page, and lead conversions. We tune the topic calendar to what is actually working.' },
    ],
    result: {
      client: 'How we keep the quality high',
      role: 'Three human checkpoints, every blog',
      stat: '3',
      statLabel: 'human checkpoints per blog',
      body: 'Three human checkpoints catch what AI misses: outline approval before research, source verification after research, and a final read for tone and fit before shipping. Those checks are what stop a draft you would never publish under your own name from reaching you.',
    },
    testimonial: {
      quote: 'The blog production process we use was modeled on Animalz, Foundation, and Grizzle workflows. We adapted it for operators who want every paragraph to actually fit their business.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'How long are the blogs?', a: 'Standard is 1,500 to 2,500 words. Pillar pieces and SEO-targeted long-form go to 3,000 words when the topic supports it. We do not pad.' },
      { q: 'Do you write generic listicles?', a: 'No. Every piece has a thesis. If we cannot find a specific angle or point of view your audience cares about, we propose a different topic.' },
      { q: 'How do you avoid blogs that sound like AI wrote them?', a: 'A human editor reads every draft and flags anything generic. We keep a running list of banned phrases (delve, navigate, in today\'s fast-paced world, and so on). If a draft does not fit your business, we rewrite until it does.' },
      { q: 'Do you provide SEO?', a: 'Yes. Every blog ships with full SEO package: title, meta description, slug, internal link suggestions, external authority links, schema markup recommendation.' },
      { q: 'What actually happens on the call?', a: '15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.' },
    ],
  },
  {
    slug: 'ad-creatives',
    name: 'Ad Creatives',
    tagline: 'Ad creative built for returns, not design awards.',
    heroSub: 'Static and video creative built for one job: stopping the scroll and getting the click. Six ad creatives a month on Growth, with new hooks cut from whatever is working, so your CPA stops creeping up and your ad spend keeps working. We ship the angle that converts, not the one that wins design contests.',
    metaDescription: 'Ad creative on subscription: 6 ads a month on Growth, 4 static and 2 video, 48-hour turnaround, so creative fatigue stops eating your ad spend.',
    accentColor: '#3b82f6',
    problemHeadline: 'Your ad creative goes stale every 14 days.',
    problemBody: 'You launch new ads, they perform for two weeks, then CPMs creep up and ROAS tanks. The fix is fresh creative. But your in-house designer is overwhelmed and your freelancer is slow, so the same three variations keep running long after they stopped working, and the budget keeps going out the door behind them.',
    problemPoints: [
      'Same 3 ad variations running for 6+ weeks while CPAs creep up',
      'No fresh hooks, no new angles, no new visual language',
      'Slow turnaround from designers means creative refresh is always behind',
      'Generic ad templates that look identical to every competitor in your category',
    ],
    solutionHeadline: 'A creative subscription that ships before fatigue hits.',
    solutionBody: 'Growth includes 6 ad creatives a month, 4 static and 2 video. Static images, video ads, motion graphic ads. Built around new hooks tested against your audience. 48-hour standard turnaround. Unlimited revisions per creative until you are satisfied.',
    methodTimeline: '48-HOUR TURNAROUND',
    steps: [
      { num: '01', title: 'Strategy and Hook Lab', body: 'Monthly creative kickoff: review last month\'s top performers, brainstorm new hooks, identify visual angles. Your team picks the angles you want produced.' },
      { num: '02', title: 'Production', body: 'Static designs in Figma, video ads cut from your existing footage or stock, motion graphic ads built in After Effects. 48-hour standard turnaround per creative.' },
      { num: '03', title: 'Iterate Based on Data', body: 'You ship. We monitor performance via your Meta or Google reports. Top performers get variations. Underperformers inform next month\'s creative direction.' },
    ],
    deliverables: [
      { icon: '🖼️', title: 'Static Image Ads', desc: 'Single-image and carousel ads built for Meta, Instagram, LinkedIn. 4 a month on Growth.' },
      { icon: '🎥', title: 'Video Ads', desc: '15 to 60 second video ads cut from your footage or stock. Hooks tested against your audience. 2 a month on Growth.' },
      { icon: '✨', title: 'Motion Graphic Ads', desc: 'Animated kinetic-text ads, product showcases, and explainer ads built in After Effects.' },
      { icon: '🎯', title: 'Hook Variations', desc: 'Each top-performing ad gets 3 to 5 hook variations to fight fatigue and find new audience pockets.' },
      { icon: '📊', title: 'Performance Pack', desc: 'Monthly report on which creatives won, why they won, and what to test next.' },
      { icon: '🚀', title: 'Rapid Iteration', desc: 'Fresh creative in your account every week. No more 6-week-old ads bleeding budget.' },
    ],
    result: {
      client: 'Subscription Model',
      role: 'Production rhythm',
      stat: '48 hr',
      statLabel: 'creative turnaround',
      body: 'Our creative subscription delivers 6 ad creatives a month on Growth, 4 static and 2 video, with a 48-hour turnaround on each piece. That cadence lets you refresh top performers as they tire instead of running the same three variations until CPMs climb.',
    },
    testimonial: {
      quote: 'Most DTC brands spend far more on media than on the ads that media shows. A creative subscription is the cheapest way to fix that.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'What platforms do you produce ads for?', a: 'Meta (Facebook + Instagram), TikTok, Google Display, LinkedIn, and Pinterest. Each ad is exported in the right specs and aspect ratios for the target platform.' },
      { q: 'Do I need to send you raw footage?', a: 'For video ads, yes. Though we can also use stock footage or existing UGC if you have it. For static and motion graphic ads, we work from your existing brand assets.' },
      // Replaces the two entries removed here in Sept 2026. Both restated the
      // "Our Promise" grid on the same page word for word (unlimited
      // revisions, month to month with 14 days notice), so the reader met the
      // same two facts twice within one scroll. This one answers the question
      // the page's whole argument rests on and is not answered anywhere else.
      { q: 'How do you actually stop creative fatigue?', a: 'Volume and rotation, not one hero ad. Growth gives you 6 fresh creatives a month, 4 static and 2 video, we pull 3 to 5 hook variations off whatever is performing, and we refresh as ads tire rather than every 4 to 6 weeks. Fatigue is a maths problem: the fix is having the next creative ready before the current one dies.' },
      { q: 'What actually happens on the call?', a: '15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.' },
    ],
  },
  {
    slug: 'websites-funnels',
    name: 'Websites and Funnels',
    tagline: 'Websites built to turn visitors into enquiries.',
    heroSub: 'Fast websites for founders, coaches, business owners, real estate agents, and DTC brands. Brand sites, e-commerce stores, landing pages, property listings, course platforms, sales funnels, portfolios. Copy and design are written together, every page points to one next step, and we build for under 2 seconds to load on mobile.',
    metaDescription: 'Websites and sales funnels built to convert, not just to look good. Sub-2-second mobile load, conversion copywriting included on every build.',
    accentColor: '#10b981',
    problemHeadline: 'A pretty website that does not get you customers.',
    problemBody: 'Traffic lands on your site, scrolls for 8 seconds, and leaves. No inquiry. No booking. No sale. Your designer made it look beautiful, but the layout is wrong, the copy is fluff, and the call-to-action is buried. A beautiful site that does not convert is an expensive business card.',
    problemPoints: [
      'Hero section that does not tell visitors what you do or who you help',
      'No clear call-to-action above the fold',
      'Long contact forms that kill momentum instead of booking calls',
      'Generic stock photography that screams "we did not have a budget for real visuals"',
    ],
    solutionHeadline: 'Built to convert. Not just to impress.',
    solutionBody: 'We design and build around the one action you want a visitor to take. Each section has a job, and anything that does not help a visitor get in touch comes out. Performance-tuned for sub-2-second load times so you do not lose mobile traffic to slow pages.',
    methodTimeline: '1 TO 6 WEEKS BY SCOPE',
    steps: [
      { num: '01', title: 'Strategy and Wireframe', body: 'We map your visitor journey, define the single most important action, and wireframe a conversion-optimized layout before a single pixel is designed.' },
      { num: '02', title: 'Design and Copywriting', body: 'Copy and design developed simultaneously so the message reinforces the visual hierarchy. Conversion-driven copywriting included on every project.' },
      { num: '03', title: 'Build, Launch, Optimize', body: 'Built in Next.js, Framer, Webflow, or your platform of choice. Pre-launch testing on real devices. Conversion tracking set up, then 14 days of free fixes after launch.' },
    ],
    deliverables: [
      { icon: '🌐', title: 'Brand Websites', desc: 'Full marketing sites with home, about, services, and contact pages designed around your buyer journey, not a template.' },
      { icon: '🛍️', title: 'E-commerce Stores', desc: 'Shopify, custom-built stores, product pages that sell. Cart flow tuned for fewer abandonments and more checkout completions.' },
      { icon: '🏠', title: 'Listings + Property Sites', desc: 'Real estate listing pages, property showcase sites, agent personal-brand sites. Built to make every listing book viewings.' },
      { icon: '🎯', title: 'Sales Funnels + Landing Pages', desc: 'Opt-in pages, sales pages, checkout flows, webinar pages, launch pages. Built to maximize conversion at every step.' },
      { icon: '✍️', title: 'Copy Written By Humans', desc: 'Every word written by a real copywriter who knows your business. No template prose, no AI fillers. Done together with design so message and visual reinforce each other.' },
      { icon: '🔗', title: 'Integrations', desc: 'Stripe, Calendly, Kajabi, Teachable, GoHighLevel, ActiveCampaign, Shopify, your CRM. Wired so leads and customers flow through your system automatically.' },
      { icon: '📊', title: 'Analytics + Tracking', desc: 'GA4, Meta Pixel, conversion events, a clean dashboard. You see exactly what is converting, where visitors are dropping, and where the budget is paying back.' },
    ],
    result: {
      client: 'Performance Standard',
      role: 'Build engineering',
      stat: '<2s',
      statLabel: 'mobile load time',
      body: 'We build every site to load in under 2 seconds on mobile, because slow pages lose visitors before they read anything. Performance comes from clean code, optimized images, lazy loading, and CDN delivery. Not from cramming more JavaScript onto the page.',
    },
    testimonial: {
      quote: 'My background is computer science engineering. Performance is not a feature for me. It is the baseline. A site that loads in 6 seconds has already lost.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'Which platforms do you build on?', a: 'Next.js (custom), Framer, Webflow, WordPress, Kajabi, GoHighLevel, ClickFunnels. We recommend based on your speed, customization, and team requirements.' },
      { q: 'Do you write the copy?', a: 'Yes. Every project includes conversion copywriting. We do not design around placeholder text and we do not let clients ship a beautiful site with weak copy.' },
      { q: 'How long does a website take?', a: 'Brand websites: 3 to 4 weeks. Sales funnels and landing pages: 1 to 2 weeks. Custom Next.js builds: 4 to 6 weeks depending on complexity.' },
      { q: 'Can you redesign my existing site?', a: 'Yes. Redesigns are common. We audit what is and is not converting before starting, so we keep what works and replace what does not.' },
      { q: 'What actually happens on the call?', a: '15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.' },
    ],
  },
  {
    slug: 'automations',
    name: 'Automations',
    tagline: 'A system that catches every lead. So you stop losing them.',
    heroSub: 'Custom AI agents and automation stacks that catch every lead the second it comes in, qualify it for you, and only put the serious ones on your calendar. Built with Make.com, ManyChat, GoHighLevel, and your existing CRM. A typical stack is live in 10 to 14 business days.',
    metaDescription: 'Automation stacks that catch every lead, qualify it, and book only serious buyers. Built on Make.com, ManyChat, and your CRM. Live in 14 days.',
    accentColor: '#E8541A',
    problemHeadline: 'You are doing manual work a system should be handling.',
    problemBody: 'Every day you reply to the same DMs, chase leads who never respond, and watch warm prospects go cold because the follow-up slipped. This is not a people problem. It is a systems problem. One well-built automation stack ends it.',
    problemPoints: [
      'DMs and comments going unanswered for hours or days',
      'Leads falling through the cracks with no automated follow-up',
      'Manually sending the same welcome and nurture emails over and over',
      'No system to qualify leads before they hit your calendar',
    ],
    solutionHeadline: 'One stack. Every lead captured. Every call booked.',
    solutionBody: 'We build your full automation stack using Make.com, ManyChat, GoHighLevel, ActiveCampaign, and your existing CRM. Every inquiry gets an instant response. Every interested prospect gets nurtured. Every qualified lead lands on your calendar pre-qualified.',
    methodTimeline: 'LIVE IN 10 TO 14 DAYS',
    steps: [
      { num: '01', title: 'Audit and Strategy', body: 'We map your full customer journey from first touchpoint to booked call and identify every gap where leads are slipping through. Output is a documented automation blueprint.' },
      { num: '02', title: 'Build and Integrate', body: 'We build your DM flows, email sequences, CRM pipelines, qualification forms, and calendar integration. Tested end-to-end before it goes live.' },
      { num: '03', title: 'Launch and Optimize', body: 'We go live, monitor for the first 30 days, and tune open rates, response rates, and conversion rates. Monthly performance review thereafter.' },
    ],
    deliverables: [
      { icon: '💬', title: 'DM Automation', desc: 'ManyChat flows responding instantly to comments and DMs, qualifying leads, and driving them to book.' },
      { icon: '📧', title: 'Email Sequences', desc: 'Welcome flows, nurture sequences, sales emails, and re-engagement campaigns that send on their own once a lead signs up.' },
      { icon: '📅', title: 'Calendar Booking', desc: 'Automated booking flows that fill your calendar with qualified prospects only. No tire-kickers.' },
      { icon: '🔗', title: 'CRM Setup', desc: 'GoHighLevel, HubSpot, ActiveCampaign, or your platform of choice. Wired so every lead is tracked end-to-end.' },
      { icon: '🎯', title: 'Lead Qualification', desc: 'Application forms, scoring rules, and filters that ensure only serious buyers reach your calls.' },
      { icon: '📊', title: 'Analytics Dashboard', desc: 'Live reporting on open rates, booking rates, and revenue attributed to each automation.' },
    ],
    result: {
      client: 'Stack Architecture',
      role: 'Build standard',
      stat: '14 days',
      statLabel: 'standard build time',
      body: 'A typical full automation stack (DM flows, email sequences, CRM pipelines, lead qualification, and calendar integration) takes 10 to 14 business days from kickoff to launch. Complex multi-platform builds with custom integrations may extend to 21 days.',
    },
    testimonial: {
      quote: 'Automation is not the goal. The goal is your time back. The automation is just how we get there.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'Which platforms do you build on?', a: 'Make.com, ManyChat, GoHighLevel, ActiveCampaign, HubSpot, Zapier, Airtable, and your CRM of choice. We work with your existing stack wherever possible.' },
      { q: 'How long does setup take?', a: 'Most full automation stacks are live in 10 to 14 business days. Complex multi-platform builds with custom integrations may extend to 21 days.' },
      { q: 'Do I need a large audience?', a: 'No. Automation works at any audience size, and a small engaged list converts better than a large cold one. What matters is that every inbound message gets answered and every interested person gets followed up, which is exactly what the system handles. The size of the audience is what you grow next, not a prerequisite for the system to pay for itself.' },
      { q: 'Will the messages sound robotic?', a: 'Not if they are written properly. Every message is written against your brand brief, not pulled from a default template, and we run test conversations end to end before anything goes live so you can read exactly what your audience will receive.' },
      { q: 'What actually happens on the call?', a: '15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.' },
    ],
  },
  {
    slug: 'apps-software',
    name: 'Apps & Software',
    tagline: 'Software that runs your business, not the other way around.',
    heroSub: 'Your website is the first handshake with every customer. Your software is the engine your team works inside every day. When both are built around how your business actually operates, customers convert faster, your team moves faster, and you stop paying monthly SaaS rent for tools that almost fit. We design and build websites, apps, and AI tools custom for your business, at a fixed price, in weeks, with the code transferred to you on launch day.',
    metaDescription: 'Custom apps, client portals, and AI tools at a fixed price in weeks. Code in your GitHub, yours once paid. No vendor lock-in.',
    accentColor: '#06b6d4',
    problemHeadline: 'Your software stack is costing you customers and hours every single week.',
    problemBody: 'Most businesses lose deals before the buyer ever talks to them. The site looks identical to three competitors. The booking flow has friction. The portal experience after purchase feels held together with tape. Internally, your team loses 10 or more hours a week jumping between Kajabi, Bonsai, HubSpot, ClickFunnels, Calendly, and a Google Sheet nobody updates. The compounding cost (lost conversions, wasted hours, monthly SaaS rent for tools you outgrew) is bigger than the cost of building something that actually fits. We help you flip the equation.',
    problemPoints: [
      'Customers bouncing because your site looks identical to the next 5 competitors',
      'Booking flow, intake form, and onboarding scattered across 4 different SaaS tools',
      'Your team losing 10+ hours a week glueing Zapier, Sheets, and email chains together',
      'Paying $500 to $2,000 a month in SaaS subscriptions for tools that still do not fit',
      'A client portal that is a Notion page held together with sharing permissions',
      'Quoted six figures by a dev agency for the build, scoped over six months',
    ],
    solutionHeadline: 'Better experience for your customers. Better control for your team. Built around your actual business.',
    solutionBody: 'We design and ship the websites, apps, and AI tools your business needs, engineered for the two outcomes that move the needle: a buying experience your customers remember, and an operating system your team actually wants to work inside. Your website converts because it was built around YOUR buyer journey, not a Webflow template. Your client portal makes customers feel premium because it was built around YOUR offer. Your internal dashboard saves the team 10 hours a week because it was built around YOUR workflow. Fixed price, fixed timeline, full code handover on launch day. Hosting your call, no vendor lock-in, no monthly rent.',
    methodTimeline: '2 TO 8 WEEKS BY SCOPE',
    steps: [
      { num: '01', title: 'Map the value', body: 'A free 15-minute call where we map exactly where you are losing customers, where your team is losing hours, and what software would change that. You leave with a written scope, a fixed price, and a delivery date in your inbox. If a custom build is not the right move for your stage, we will tell you. We do not pitch builds that will not pay for themselves.' },
      { num: '02', title: 'Build in the open', body: 'Every week you get real working screens you can click through. Not Figma mockups, not status decks. You give feedback in Slack, we ship updates in days. You see your customer experience taking shape, you spot friction early, and the team that uses it daily gets a voice in how it works. This is the part agencies hide behind status reports. We put it on display.' },
      { num: '03', title: 'Ship and hand over the keys', body: 'Goes live with domain configured, hosting set up, analytics wired, customer-facing flow polished, and team training delivered. You get the code on your GitHub, the documentation, a walkthrough video, and 14 days of free fixes. From that point on you can extend it with any developer in the world, or keep us on a small monthly retainer. Your call.' },
    ],
    deliverables: [
      { icon: '🖥️', title: 'A website your buyers actually finish reading', desc: 'Built around your buyer journey, not a generic template. Custom designed for your brand, your offer, your audience. Built to load in under 2 seconds on mobile and set up for Google search. Looks premium from the first second. Result: lower bounce, higher time-on-page, more booked calls. Every visitor turns into a real shot at revenue instead of a 5-second skim.' },
      { icon: '✨', title: 'Immersive 3D and motion experiences', desc: 'For brands selling something premium: coaching above $5K, courses, agency retainers, DTC products. As the visitor scrolls, products spin, cameras fly through scenes, the page tells a story. The kind of interactive experience that makes people remember you. Worth it the moment your AOV is high enough that one extra conversion pays for the build.' },
      { icon: '💼', title: 'A client portal that makes you look like a $10M company', desc: 'When your customer logs in after paying, what do they see? A polished portal branded for your business with onboarding, deliverables, billing, project status, file sharing, and support all in one place. Replaces 3 to 5 SaaS subscriptions you are renting today (Kajabi, Bonsai, HubSpot, Notion, Drive). Customers feel premium. You stop juggling tabs. Your team gets one source of truth.' },
      { icon: '⚙️', title: 'An internal dashboard your team will actually use', desc: 'CRM, project tracker, reporting dashboard, ops console. Built around how your team works, not how Salesforce thinks they should. The data your team needs, in the shape they need it, on a screen they want to open. Less Slack chasing, fewer "wait, what is the status" meetings, faster decisions.' },
      { icon: '🤖', title: 'AI tools that quietly run in the background', desc: 'A chatbot that answers customer questions at 2am in your brand voice and books qualified calls automatically. An AI assistant that drafts personalized email replies for your team. A system that scores incoming leads and only puts the serious ones on your calendar. The kind of AI that actually saves hours, not the kind that impresses on a demo and does nothing in production.' },
      { icon: '🚀', title: 'Your SaaS idea, shipped as a real product', desc: 'You have an idea you have been sitting on for a year. We ship a working MVP with logins, payments, dashboards, the whole thing, in 4 to 8 weeks. You start signing up real users and learning what actually matters, instead of paying agencies for 6-month Figma cycles. Built for founders, coaches launching membership products, and operators turning an internal tool into a product.' },
      { icon: '📱', title: 'Mobile-app experience without the App Store tax', desc: 'A modern progressive web app that installs to the home screen like a native iPhone app. Push notifications, offline mode, app-icon launcher, looks native, behaves native. No App Store approvals, no 30% Apple tax on every purchase, no Android-vs-iOS double development. One codebase, every device, instant updates.' },
    ],
    result: {
      client: 'Why we are the right team for this',
      role: 'Built by operators, priced like a fair trade',
      stat: '$4,997+',
      statLabel: 'fixed price, code yours on launch',
      body: 'You get a three-person team who have shipped websites, software, and AI tools in production. Not a 20-person agency layering project managers, account directors, and strategists on top of every billable hour. Lakshya leads the build. Shaurya and Aiman lead design and delivery. Small team, real engineering experience, fast cycles, zero middle layers. Three transparent tiers. STARTER ($4,997 to $9,997, 2 to 3 weeks): landing page with motion, client portal, internal dashboard, or 3D hero. GROWTH ($9,997 to $19,997, 3 to 5 weeks): immersive 3D brand site, course platform, custom CRM, AI agents. FULL BUILD ($19,997 to $49,997, 4 to 8 weeks): SaaS MVP with auth and payments, marketplace, multi-user product. Every tier includes hosting, full code transfer, documentation, training, and 14 days of free post-launch fixes. Growth retainer clients get 20% off. Get a quote from a traditional dev agency for the same scope and compare the number, the timeline, and crucially who owns the code at the end of it.',
    },
    testimonial: {
      quote: 'A business is only as good as the experience it gives customers and the system its team works in. We build both. Designed around how your business actually operates, not bent to fit a template. That is what software should have always been.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'How is a custom website actually going to help my business?', a: 'A custom site is engineered around your buyer journey, not a template. That changes three numbers: visitors stay longer (because the page feels designed for them, not for everyone), more of them book or buy (because the call-to-action flow is built around your specific offer, not a generic block), and your brand becomes memorable (because nobody else has it). Whether that pays back the build depends on your traffic and your offer, and we will walk through that arithmetic with you on the call.' },
      { q: 'Will a custom client portal really save me money on SaaS?', a: 'Often, yes, and the arithmetic is easy to check against your own invoices. Add up what you currently pay across Kajabi, Bonsai, HubSpot, ClickFunnels, Calendly, Notion premium and Drive seats. A custom portal that wraps onboarding, billing, deliverables and support into one branded experience typically replaces 3 to 5 of those. If that total is around $1,000 a month, a $9,997 portal pays for itself in roughly 10 months and you own it outright after that. If your stack is only costing $200 a month, it does not, and we will tell you so on the call rather than sell you a build.' },
      { q: 'I am not technical. Can I still work with you?', a: 'Yes. You do not need to know how it works. You only need to know what you want customers to experience and how you want your team to work. We translate the rest into code. We build for coaches, business owners, agency founders, and creators, not engineers. We speak business outcome, not jargon.' },
      { q: 'Why not just use Webflow or Wix?', a: 'Cheaper this month, way more expensive over two years. You will pay $1,500 to $5,000 in subscription fees, look identical to every competitor using the same template, and have no say when the platform changes pricing or features. A custom build is a one-time cost that becomes a real business asset on your balance sheet. You own it, you control it, you can extend it whenever you want.' },
      { q: 'What does an immersive 3D website actually do for conversions?', a: 'Static sites have one job: communicate. 3D and motion sites do a second job: make the brand stick. As the visitor scrolls, products spin, scenes shift, the page tells a story. The honest answer on numbers is that it depends on your offer and traffic, and we would rather tell you that than quote you a multiple we cannot stand behind. It is worth the investment when the price point is high enough that being memorable changes the decision: high-ticket coaching, premium DTC, courses above $500 ACV, and agencies who need to look like an actual studio.' },
      { q: 'What does an AI tool actually do for my business?', a: 'Practical, money-saving stuff. A chatbot that answers customer questions at 2am in your brand voice and books qualified calls. An email assistant that drafts personalized replies your team just edits and sends. A lead-scoring system that triages incoming inquiries so your calendar only fills with serious buyers. A knowledge-base search across your team notes and Slack. The kind of AI that saves 5 to 10 hours a week, not the kind that impresses on a demo.' },
      { q: 'Will I really own the code?', a: 'Yes, once the build is paid in full. The project lives in your own GitHub account, and on full payment every line of it is yours. You can hire any developer in the world to extend it. We do not hold code hostage, we do not run hosting on our credit card, we do not charge retainer fees to access your own product. Full independence, that is the whole point.' },
      { q: 'What if something breaks after launch?', a: '14 days of free fixes included with every build. After that, you can hire us per change at our hourly rate, hand the codebase to any developer, or keep us on a small monthly retainer for ongoing improvements. We ship clean, documented, well-architected code, so any engineer can pick it up without weeks of ramp-up.' },
      { q: 'How does this work if I am already on a content retainer?', a: 'Growth retainer clients get 20% off any custom build. Standalone clients are welcome too, no retainer required.' },
      { q: 'Why is this cheaper than what dev agencies quote?', a: 'Because we are three operators, not a 20-person agency layering project managers, account directors, two designers, three developers, a QA, and a head of strategy on top of every billable hour. Lakshya leads the build. Shaurya and Aiman lead design and delivery. No middle layers, no kickbacks, no quarterly steering committees. Fewer people billing means a smaller quote, so compare ours with an agency quote for the same scope.' },
      { q: 'Do you take equity instead of cash?', a: 'No. Fixed pricing keeps the relationship clean. Your equity should stay yours. Our incentive is shipping you working software, not negotiating a cap table.' },
      { q: 'What actually happens on the call?', a: '15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.' },
    ],
  },
  {
    slug: 'seo-aeo',
    name: 'SEO and AI search',
    tagline: 'Be the page Google shows and the answer AI tools read out.',
    heroSub: `SEO and AI search is the work of getting your site shown in Google results and quoted in answers from tools like ChatGPT. It is part of the Growth plan, ${GROWTH_P} a month, month-to-month. The Presence Engine, ${PRESENCE_P} a month, covers the basics: your pages, Google Business Profile and structured data.`,
    metaDescription: `SEO and AI search for founders: pages, structured data and sourced blogs, in the Growth plan at ${GROWTH_P} a month. The MagicBNB numbers, and what is still broken.`,
    accentColor: '#f59e0b',
    problemHeadline: 'Your site is live, and almost nobody sees it in search.',
    problemBody: 'A site can be well designed and still be shown in Google a handful of times a day. Search engines and AI tools read your pages, your structure and the sources you cite before they show you to anyone. If those are thin, so is your reach.',
    problemPoints: [
      'Few pages that answer the questions your buyers type into Google',
      'Pages with no clear definition near the top for an AI tool to quote',
      'Missing or wrong structured data, titles and descriptions',
      'No Google Business Profile, or one that does not match your site',
      'Nobody reading the Search Console numbers every week',
    ],
    solutionHeadline: 'Pages, structure and sourced writing, measured every week.',
    solutionBody: 'We fix the pages and structured data first, then write blogs that answer real questions with working source links, and read your Search Console numbers to decide what to edit next. A person edits every piece before you see it.',
    methodTimeline: 'MONTHLY, MONTH-TO-MONTH',
    steps: [
      { num: '01', title: 'Look at what is there', body: 'We read your site, your Search Console data if you have it, and the questions your buyers search. You get a written list of what to fix first.' },
      { num: '02', title: 'Fix the pages and publish', body: 'Pages, titles, structured data and a Google Business Profile first. Then sourced blogs on the questions your buyers ask, each edited by a person.' },
      { num: '03', title: 'Read the numbers and adjust', body: 'Each month we review impressions, clicks and positions, and decide which pages to improve and what to write next.' },
    ],
    deliverables: [
      { icon: '🔎', title: `Presence Engine, ${PRESENCE_P} a month`, desc: 'Pages, Google Business Profile and structured data so you show up on Google and ChatGPT, plus a free website tune-up in month one. It does not include blogs.' },
      { icon: '📈', title: `Growth, ${GROWTH_P} a month`, desc: '4 long-form SEO blogs a month (1,500 to 2,500 words, sourced), the website rebuilt in month one and tuned every month after, and funnel optimization with conversion tracking.' },
      { icon: '📊', title: 'A monthly performance review', desc: 'Growth includes a monthly review of what the numbers did and what changes next.' },
      { icon: '🧱', title: 'Pages built to be quoted', desc: 'A clear definition near the top of a page, question-style headings and short sourced answers, which are the parts search engines and AI tools lift.' },
      { icon: '✍️', title: 'Sourced writing', desc: 'Every statistic carries a working source link, and a person edits each post before it reaches you.' },
    ],
    result: {
      client: 'MagicBNB, a software company',
      role: 'One engagement, not a typical result',
      stat: '5.8 to 4,803',
      statLabel: 'daily Google impressions, April to early November 2026',
      body: 'This is the one published search result, and it comes from the whole marketing system, not search work alone. It is not a promise for your site. The same export shows a click-through rate under half a percent, a small number of conversions and a broken link still sending visitors to a 404. The full case study prints all of it.',
    },
    testimonial: {
      quote: 'We have one published search case study. It lists what is still broken next to what worked, and we would rather you read that than a quote.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'What is the MagicBNB result?', a: 'Daily Google impressions for magicbnb.io went from 5.8 in April 2026 to 4,803 in early November 2026. That is impressions, not sales. It came from the whole marketing system, and it is one case, so do not read it as typical. See /case-studies/magicbnb-seo-aeo for the export.' },
      { q: 'What is still not working on that case?', a: 'Click-through rate is still under half a percent, conversions are few, a broken inbound link still sends visitors to a 404, and some pages compete with each other for the same query. The case study lists each one with its status.' },
      { q: 'Do you guarantee rankings or AI citations?', a: 'No. Nobody outside Google controls rankings, and we do not publish AI citation counts. We commit to the work: the pages, the structured data, the sourced blogs and the monthly review.' },
      { q: 'What do I get at each price?', a: `Presence Engine, ${PRESENCE_P} a month, covers pages, Google Business Profile and structured data, with no blogs. Growth, ${GROWTH_P} a month, adds 4 SEO blogs a month, the website rebuilt in month one and tuned monthly, and funnel tracking. Both are month-to-month.` },
      { q: 'Who is this not for?', a: 'Anyone who needs customers this month, since search takes months. Sites with no product or offer yet. Anyone who wants a guaranteed position. And a very small site with a tight budget, where the free sample or the Pilot is a better first step.' },
      { q: 'What actually happens on the call?', a: '15 minutes with Lakshya, the founder. He looks at your site and your last few posts and tells you the first three things he would fix. No pitch.' },
    ],
  },
];

export function getService(slug: string): ServiceData | undefined {
  return services.find(s => s.slug === slug);
}
