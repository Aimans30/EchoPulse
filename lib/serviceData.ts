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
    tagline: 'Every Format. One Editor at Your Disposal.',
    heroSub: 'Whatever needs cutting, we cut it. YouTube long-form, podcast episodes and highlight cuts, course module edits, Reels and TikToks, cinematic property work, talking-head founder content. One production pipeline, every kind of edit you need, retention-tested for the platform it is shipping to.',
    accentColor: '#E8541A',
    problemHeadline: 'Great footage. Mediocre results.',
    problemBody: 'You record, post, and watch the views stall. The drop-off is brutal, the engagement is flat, and you cannot tell whether the content or the edit is the problem. In 95 percent of cases, it is the edit.',
    problemPoints: [
      'Slow intros that lose viewers in the first 2 seconds on mobile',
      'No retention hooks, no pattern interrupts, no story arc',
      'Generic captions and static text overlays that add zero energy',
      'No platform-specific formatting for Reels, TikTok, Shorts, YouTube, or course modules',
    ],
    solutionHeadline: 'Every kind of edit. One team.',
    solutionBody: 'YouTube long-form, podcast cuts, course modules, short-form for the algorithm, cinematic real estate, talking-head founder content, motion graphic ads. Speed ramps, sound design, captions, color grade. Whatever the format demands, we cut it with the shot grammar tuned to where it is shipping. One pipeline. One vendor. Every edit you will ever need.',
    steps: [
      { num: '01', title: 'You Send Footage', body: 'Upload anything: podcast episode, YouTube vlog, course module, drone footage, walkthrough, talking head, ad. Drop it in our shared folder with a 2-line brief on the goal.' },
      { num: '02', title: 'We Edit and Optimize', body: 'Editor cuts retention-first, applies sound design, color grade, and adds platform-specific captions. Optional motion graphic add-ons. 48-hour standard turnaround.' },
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
      statLabel: 'standard turnaround',
      body: 'Our team learned property reels at Vizionary Focus, a Canadian production studio, before going independent. Standard production cycle is 48 hours per individual deliverable, with revisions until you are satisfied. Rush 24-hour delivery available at a 30 percent surcharge.',
    },
    testimonial: {
      quote: 'We are a young studio. Our first client testimonials are still in production. What we will not do is fabricate them. We will let you talk to a real client once we have one to introduce you to.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'How fast is the turnaround?', a: 'Standard 48 hours per video deliverable. Rush 24-hour delivery is available at a 30 percent surcharge for time-sensitive launches and listing campaigns.' },
      { q: 'How do I send footage?', a: 'We set up a shared Google Drive or Dropbox folder for each client. Upload your raw footage with a brief. We handle the rest.' },
      { q: 'Do you edit for all platforms?', a: 'Yes. Reels, TikTok, YouTube Shorts, YouTube long-form, LinkedIn video, podcast video, and listing-site MP4 exports are all standard.' },
      { q: 'How many revisions are included?', a: 'Unlimited revisions until you are satisfied. We do not cap rounds and we do not invoice per hour for changes within scope. If it takes one round or five, we keep refining until you say it is right.' },
    ],
  },
  {
    slug: 'linkedin-ghostwriting',
    name: 'LinkedIn Ghostwriting',
    tagline: 'Posts In Your Voice. Not ChatGPT\'s.',
    heroSub: 'Founder-led LinkedIn ghostwriting backed by a 90-minute Voice Foundation. Posts your audience replies to, written in your actual cadence. No "Here is the thing," no em-dashes, no template energy.',
    accentColor: '#8b5cf6',
    problemHeadline: 'Most LinkedIn ghostwriting is AI slop with a logo.',
    problemBody: 'You hire a $5K per month agency. They produce posts that sound like every other LinkedIn ghostwriter. Your audience can tell. Your replies dry up. The posts get likes from bots and nothing from real prospects.',
    problemPoints: [
      'Generic hooks anyone could have written ("Here is the thing:")',
      'Em-dashes used as commas in 12 places per post',
      '"Delve," "leverage," "navigate," "tapestry" in every paragraph',
      'No real stories, no contrarian POVs, no signature phrases. Just bland advice',
    ],
    solutionHeadline: 'We capture your voice. Then we write in it.',
    solutionBody: 'Every founder gets a 90-minute Voice Foundation interview at onboarding. We transcribe it, encode it into a structured Voice DNA document, and reference that document on every post we write. Output is scored against an Anti-AI-Tells checklist before it ships. Result: posts that sound like you, not like ChatGPT.',
    steps: [
      { num: '01', title: 'Voice Foundation', body: '90-minute recorded interview captures your origin story, contrarian beliefs, signature phrases, and the customers you remember most. We turn the transcript into a structured Voice DNA document.' },
      { num: '02', title: 'Editorial Calendar', body: 'Monthly content calendar built from your POV matrix and story bank. We pick topics that earn replies, not just impressions. You approve each calendar before we write.' },
      { num: '03', title: 'Write, Edit, Ship', body: 'Drafts written against the Voice DNA. Edited against the Anti-AI-Tells list. Voice fidelity scored 8 of 10 minimum before delivery. You approve every post before it publishes.' },
    ],
    deliverables: [
      { icon: '✍️', title: 'Short-Form Posts', desc: '4 to 5 posts per week in your voice. Story-driven, opinion-driven, or tactical. Never generic listicles.' },
      { icon: '📊', title: 'Carousel Posts', desc: '1 to 2 deep-dive carousels per month. 8 to 12 slides built for saves, shares, and DMs.' },
      { icon: '🎙️', title: 'Voice Foundation Doc', desc: 'Your Voice DNA. Interview transcript, vocabulary list, story bank, POV matrix, banned phrases. Yours forever, even if you cancel.' },
      { icon: '💬', title: 'Engagement Drafts', desc: '5 daily comment drafts on prospect and influencer posts. Visibility in their feed without you posting more.' },
      { icon: '📝', title: 'Profile Optimization', desc: 'Headline, About, Featured section, and banner rewritten once per quarter to match your evolving positioning.' },
      { icon: '📈', title: 'Monthly Performance Review', desc: 'Impressions, comments, profile visits, DMs from ICP. Optimize the calendar based on what is working.' },
    ],
    result: {
      client: 'Voice Foundation',
      role: 'Onboarding standard',
      stat: '90 min',
      statLabel: 'recorded voice interview',
      body: 'Every client engagement starts with a 90-minute recorded interview where we capture how you actually think and talk. The transcript becomes the source code for every post we write for the next 12 months. Refreshed quarterly to stay aligned with your evolving POV.',
    },
    testimonial: {
      quote: 'The Voice Foundation is the single biggest reason agencies that hire us tell their clients we are different. They have not seen anything like it before.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'How is this different from a $200 per month LinkedIn ghostwriter?', a: 'Cheap ghostwriters use templates. We use a Voice Foundation captured from a 90-minute recorded interview with you. The posts sound like you because we built a system around your actual voice. Not a template stuffed with industry buzzwords.' },
      { q: 'Will my audience know it is ghostwritten?', a: 'Almost never. We have had clients\' real-life friends comment that the posts sound exactly like them. The Voice DNA document keeps every post anchored to your real way of speaking.' },
      { q: 'How many posts per month?', a: 'Standard tier is 16 to 20 posts per month (4 to 5 per week) plus 1 to 2 carousels. Premium tier adds the daily engagement amplifier (5 comment drafts per day on prospect and influencer posts).' },
      { q: 'Do I have to approve every post?', a: 'Yes. You see every draft before it publishes. Revisions are unlimited until you are satisfied with the post. Most clients only revise the first 5 to 10 posts before they trust the system.' },
    ],
  },
  {
    slug: 'blog-production',
    name: 'Blog Production',
    tagline: 'Blogs That Get You Found, Cited, and Chosen.',
    heroSub: 'Long-form content that ranks on Google, gets cited by ChatGPT, Claude, and Perplexity, and earns the kind of recognition that brings inbound. We write the blogs your buyers save and AI assistants quote when prospects ask the questions you sell the answers to.',
    accentColor: '#f59e0b',
    problemHeadline: 'Your blog is producing AI slop. Your readers can tell.',
    problemBody: 'You signed up for a content agency. They send you 4 blogs per month. All 1,500 words of "delve into the comprehensive landscape of digital transformation" and zero specific examples. Your bounce rate is 80 percent. Your SEO is flat. Nobody is signing up.',
    problemPoints: [
      'Generic outlines with no contrarian POV or specific angle',
      'Vague language: "many companies," "studies show," "experts say"',
      'Banned AI words: delve, navigate, tapestry, in today\'s fast-paced world',
      'No real examples, no real numbers, no real customer stories',
    ],
    solutionHeadline: 'Multi-agent research. Voice-driven writing. Human editing.',
    solutionBody: 'Every blog runs through an 8-agent system: brand strategy, topic research, SERP analysis, outline, source research, draft, edit, SEO and distribution. Every step has a human checkpoint. The voice pass is the most important. Output is rewritten against your Voice Foundation until it sounds like you.',
    steps: [
      { num: '01', title: 'Topic and Outline', body: 'Monthly topic calendar built from your Voice Foundation, POV matrix, and SEO opportunity. You approve each outline before we research or write.' },
      { num: '02', title: 'Research and Draft', body: 'Multi-agent system pulls real statistics, real customer examples, and real expert quotes. First draft is written against your Voice DNA, not a generic template.' },
      { num: '03', title: 'Edit and Ship', body: 'Editorial pass scored against Anti-AI-Tells checklist. Voice fidelity score 8 of 10 minimum before delivery. SEO and distribution pack included with every blog.' },
    ],
    deliverables: [
      { icon: '📝', title: 'Long-Form Blogs', desc: '1,500 to 3,000 words. Original POV, real research, real examples. Zero AI tells.' },
      { icon: '🔬', title: 'Source Verification', desc: 'Every statistic and quote has a real source link. We never fabricate data, even when AI would be faster.' },
      { icon: '🎯', title: 'SEO and Meta Pack', desc: 'Title, description, slug, internal link suggestions, schema recommendation, 5 authoritative external links per post.' },
      { icon: '📱', title: 'Distribution Pack', desc: 'LinkedIn post, Twitter thread, newsletter blurb, cold email pitch, and 3 quote graphics built from each blog.' },
      { icon: '🎨', title: 'Image Briefs', desc: 'Hero image concept and 2 in-post image concepts written for your design team or generated by us.' },
      { icon: '📈', title: 'Performance Tracking', desc: 'Monthly review of organic traffic, time on page, conversion to lead. Optimize topic calendar based on data.' },
    ],
    result: {
      client: 'Multi-agent System',
      role: 'Production architecture',
      stat: '8 agents',
      statLabel: 'in our blog production system',
      body: 'Every blog runs through 8 specialized agents: strategy, topic research, SERP analysis, outline, source research, writer, editor, SEO and distribution. Three human checkpoints (outline approval, source verification, final voice pass) separate $500 AI slop from $5,000 agency-grade output.',
    },
    testimonial: {
      quote: 'The blog production system we built was modeled on Animalz, Foundation, and Grizzle workflows. Adapted for B2B founders who want their voice in every paragraph, not just their byline.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'How long are the blogs?', a: 'Standard is 1,500 to 2,500 words. Pillar pieces and SEO-targeted long-form go to 3,000 words when the topic supports it. We do not pad.' },
      { q: 'Do you write generic listicles?', a: 'No. Every piece is thesis-driven. If we cannot find a contrarian angle or a specific POV your audience cares about, we propose a different topic.' },
      { q: 'How do you avoid AI tells?', a: 'We run a banned-phrase list ("delve," "navigate," "in today\'s fast-paced world," etc.) on every draft. Final output is scored against your Voice Foundation. Below 8 of 10 voice fidelity, we rewrite.' },
      { q: 'Do you provide SEO?', a: 'Yes. Every blog ships with full SEO package: title, meta description, slug, internal link suggestions, external authority links, schema markup recommendation.' },
    ],
  },
  {
    slug: 'ad-creatives',
    name: 'Ad Creatives',
    tagline: 'Creatives Built for ROAS, Not Awards.',
    heroSub: 'Static and video creative engineered for return, not impressions. Eight to twelve fresh hooks per month so your CPA stops creeping up and your ad spend keeps multiplying. We ship the angle that converts, not the one that wins design contests. Average ROAS lift on the creatives we replace: 2 to 4x.',
    accentColor: '#3b82f6',
    problemHeadline: 'Your ad creative goes stale every 14 days.',
    problemBody: 'You launch new ads, they perform for two weeks, then CPMs creep up and ROAS tanks. The fix is fresh creative. But your in-house designer is overwhelmed and your freelancer is slow. Most DTC brands lose 40 percent of their ad spend to creative fatigue every quarter.',
    problemPoints: [
      'Same 3 ad variations running for 6+ weeks while CPAs creep up',
      'No fresh hooks, no new angles, no new visual language',
      'Slow turnaround from designers means creative refresh is always behind',
      'Generic ad templates that look identical to every competitor in your category',
    ],
    solutionHeadline: 'A creative subscription that ships before fatigue hits.',
    solutionBody: 'We deliver 8 to 12 fresh ad creatives per month on a subscription. Static images, video ads, motion graphic ads. Built around new hooks tested against your audience. 48-hour standard turnaround. Unlimited revisions per creative until you are satisfied.',
    steps: [
      { num: '01', title: 'Strategy and Hook Lab', body: 'Monthly creative kickoff: review last month\'s top performers, brainstorm new hooks, identify visual angles. Your team picks the angles you want produced.' },
      { num: '02', title: 'Production', body: 'Static designs in Figma, video ads cut from your existing footage or stock, motion graphic ads built in After Effects. 48-hour standard turnaround per creative.' },
      { num: '03', title: 'Iterate Based on Data', body: 'You ship. We monitor performance via your Meta or Google reports. Top performers get variations. Underperformers inform next month\'s creative direction.' },
    ],
    deliverables: [
      { icon: '🖼️', title: 'Static Image Ads', desc: 'Single-image and carousel ads built for Meta, Instagram, LinkedIn. 4 to 6 per month standard.' },
      { icon: '🎥', title: 'Video Ads', desc: '15 to 60 second video ads cut from your footage or stock. Hooks tested against your audience. 4 per month standard.' },
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
      body: 'Our creative subscription delivers 8 to 12 fresh ad creatives per month with a 48-hour turnaround on each piece. DTC brands working with us refresh their top ads weekly instead of every 6 weeks. The difference between scaling and stalling.',
    },
    testimonial: {
      quote: 'Ad creative is the highest-leverage thing most DTC brands underspend on. A subscription is the cheapest way to fix it.',
      name: 'Lakshya Soni',
      role: 'Founder, EchoPulse',
    },
    faq: [
      { q: 'What platforms do you produce ads for?', a: 'Meta (Facebook + Instagram), TikTok, Google Display, LinkedIn, and Pinterest. Each ad is exported in the right specs and aspect ratios for the target platform.' },
      { q: 'Do I need to send you raw footage?', a: 'For video ads, yes. Though we can also use stock footage or existing UGC if you have it. For static and motion graphic ads, we work from your existing brand assets.' },
      { q: 'How many revisions per creative?', a: 'Unlimited revisions until you are satisfied. No round caps, no per-hour invoicing. We would rather rework than ship work we are not proud of.' },
      { q: 'Can I cancel anytime?', a: 'Yes. Month-to-month, 14-day notice. We retain you on output, not a contract.' },
    ],
  },
  {
    slug: 'websites-funnels',
    name: 'Websites and Funnels',
    tagline: 'Sites That Earn Their Pixels.',
    heroSub: 'Conversion-engineered websites and sales funnels for B2B founders, course creators, and DTC brands. Performance-tuned for sub-2-second mobile loads. Every section earns its place. Every word moves visitors closer.',
    accentColor: '#10b981',
    problemHeadline: 'A pretty website that does not convert.',
    problemBody: 'Traffic lands on your site, scrolls for 8 seconds, and leaves. No inquiry, no booking, no sale. Your designer made it look beautiful, but the page architecture is wrong, the copy is fluff, and the call-to-action is invisible. A beautiful website that does not convert is an expensive business card.',
    problemPoints: [
      'Hero section that does not tell visitors what you do or who you help',
      'No clear call-to-action above the fold',
      'Long contact forms that kill momentum instead of booking calls',
      'Generic stock photography that screams "we did not have a budget for real visuals"',
    ],
    solutionHeadline: 'Built to convert. Not just to impress.',
    solutionBody: 'We design and build with conversion architecture at the center. Every section earns its place. Every button has a purpose. Every word is chosen to move the visitor one step closer to working with you. Performance-tuned for sub-2-second load times so you do not lose mobile traffic to slow pages.',
    steps: [
      { num: '01', title: 'Strategy and Wireframe', body: 'We map your visitor journey, define the single most important action, and wireframe a conversion-optimized layout before a single pixel is designed.' },
      { num: '02', title: 'Design and Copywriting', body: 'Copy and design developed simultaneously so the message reinforces the visual hierarchy. Conversion-driven copywriting included on every project.' },
      { num: '03', title: 'Build, Launch, Optimize', body: 'Built in Next.js, Framer, Webflow, or your platform of choice. Pre-launch testing on real devices. 30-day post-launch performance monitoring with conversion tracking.' },
    ],
    deliverables: [
      { icon: '🌐', title: 'Brand Websites', desc: 'Full marketing sites with home, about, services, and contact pages built around conversion architecture.' },
      { icon: '🎯', title: 'Sales Funnels', desc: 'Opt-in pages, sales pages, checkout flows engineered to maximize conversion at every step.' },
      { icon: '📝', title: 'Landing Pages', desc: 'Standalone pages for lead magnets, webinars, course launches, and ad campaigns.' },
      { icon: '✍️', title: 'Conversion Copywriting', desc: 'Every word written by a copywriter, not generated by a template. Voice-matched to your brand.' },
      { icon: '🔗', title: 'Integrations', desc: 'Stripe, Calendly, Kajabi, Teachable, GoHighLevel, ActiveCampaign. Wired up so leads flow into your funnel automatically.' },
      { icon: '📊', title: 'Analytics and Tracking', desc: 'Google Analytics 4, Meta Pixel, conversion events, and a simple dashboard so you see what is converting.' },
    ],
    result: {
      client: 'Performance Standard',
      role: 'Build engineering',
      stat: '<2s',
      statLabel: 'mobile load time',
      body: 'Every site we build hits sub-2-second mobile load times because slow pages lose visitors before they read anything. Performance comes from clean code, optimized images, lazy loading, and CDN delivery. Not from cramming more JavaScript onto the page.',
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
    ],
  },
  {
    slug: 'automations',
    name: 'Automations',
    tagline: 'Hire an AI Agent. Skip the VA.',
    heroSub: 'Custom AI agents and automation stacks that catch every lead, qualify them with real intelligence, and handle the chase work eating your week. Built with Claude Code agents, Make.com, ManyChat, GoHighLevel, and your existing CRM. Live in 14 days. Sleep better.',
    accentColor: '#E8541A',
    problemHeadline: 'You are doing manual work a system should handle.',
    problemBody: 'Every day you reply to the same DMs, chase leads who never respond, and watch warm prospects go cold because you forgot to follow up. This is not a people problem. It is a systems problem. The fix is one well-built automation stack.',
    problemPoints: [
      'DMs and comments going unanswered for hours or days',
      'Leads falling through the cracks with no automated follow-up',
      'Manually sending the same welcome and nurture emails over and over',
      'No system to qualify leads before they hit your calendar',
    ],
    solutionHeadline: 'One stack. Every lead captured. Every call booked.',
    solutionBody: 'We build your full automation stack using Make.com, ManyChat, GoHighLevel, ActiveCampaign, and your existing CRM. Every inquiry gets an instant response. Every interested prospect gets nurtured. Every qualified lead lands on your calendar pre-qualified.',
    steps: [
      { num: '01', title: 'Audit and Strategy', body: 'We map your full customer journey from first touchpoint to booked call and identify every gap where leads are slipping through. Output is a documented automation blueprint.' },
      { num: '02', title: 'Build and Integrate', body: 'We build your DM flows, email sequences, CRM pipelines, qualification forms, and calendar integration. Tested end-to-end before it goes live.' },
      { num: '03', title: 'Launch and Optimize', body: 'We go live, monitor for the first 30 days, and tune open rates, response rates, and conversion rates. Monthly performance review thereafter.' },
    ],
    deliverables: [
      { icon: '💬', title: 'DM Automation', desc: 'ManyChat flows responding instantly to comments and DMs, qualifying leads, and driving them to book.' },
      { icon: '📧', title: 'Email Sequences', desc: 'Welcome flows, nurture sequences, sales emails, and re-engagement campaigns that convert on autopilot.' },
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
      { q: 'Do I need a large audience?', a: 'No. Automation works at any audience size. We have built profitable systems for clients with under 1,000 followers. The system itself is what makes the audience profitable.' },
      { q: 'Will the messages sound robotic?', a: 'No. We write all copy in your Voice Foundation and run test conversations before going live. Most clients say their audience cannot tell the difference between automation and a human reply.' },
    ],
  },
];

export function getService(slug: string): ServiceData | undefined {
  return services.find(s => s.slug === slug);
}
