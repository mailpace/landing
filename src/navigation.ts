import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';
import { getGuidePosts } from './utils/blog';

export const headerData = {
  links: [
    {
      text: '✨ Features',
      href: '/#features',
      // links: [
      //   {
      //     text: '📧 Email API',
      //     href: getPermalink('/email-api'),
      //   },
      //   {
      //     text: '📬 SMTP Service',
      //     href: getPermalink('/smtp-api'),
      //   },
      //   {
      //     text: '📥 Inbound Email',
      //     href: getPermalink('/inbound-email'),
      //   },
      //   {
      //     text: '📨 Transactional Email',
      //     href: getPermalink('/transactional-email'),
      //   },
      //   {
      //     text: '🇪🇺 EU Hosted Email',
      //     href: getPermalink('/eu-hosted-email'),
      //   },
      //   {
      //     text: '🛡️ Spam Protection',
      //     href: getPermalink('/spam-protection'),
      //   },
      //   {
      //     text: '🔔 Webhooks',
      //     href: getPermalink('/webhooks'),
      //   },
      //   {
      //     text: '🔄 Idempotency',
      //     href: getPermalink('/idempotent-emails'),
      //   },
      // ],
    },
    {
      text: 'Pricing',
      href: getPermalink('/pricing'),
    },
    {
      text: 'Documentation',
      href: 'https://docs.mailpace.com',
    },
    {
      text: 'Resources',
      links: [
        {
          text: '📝 Blog',
          href: getBlogPermalink(),
        },
        {
          text: '📘 Email & Dev Guides',
          href: getPermalink('guides', 'category'),
        },
        {
          text: '📜 Changelog',
          href: getPermalink('changelog', 'category'),
        },
        {
          text: '📄 Email Templates',
          href: 'https://github.com/mailpace/templates',
        },
        {
          text: '💭 Musings',
          href: getPermalink('musings', 'category'),
        },
      ],
    },
  ],
  actions: [
    { text: 'Sign In', href: 'https://app.mailpace.com/', target: '_blank', variant: 'secondary' },
    { text: 'Start Sending', href: 'https://app.mailpace.com/', target: '_blank', variant: 'primary' },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Pricing', href: getPermalink('/pricing') },
        { text: 'Speed', href: getPermalink('/fast-transactional-emails') },
        { text: 'Reviews', href: getPermalink('/testimonials') },
        { text: 'What are Transactional Emails?', href: getPermalink('/what-are-transactional-emails') },
        { text: 'High Delivery Rates', href: getPermalink('/how-we-keep-delivery-rates-high') },
        { text: 'Simple Sending', href: getPermalink('/simple-transactional-emails') },
        {
          text: 'Latest Updates',
          href: getBlogPermalink(),
        },
      ],
    },
    // {
    //   title: 'Features',
    //   links: [...(headerData.links[0].links || [])],
    // },
    // {
    //   title: 'MailPace For',
    //   links: [
    //     { text: 'Developers', href: getPermalink('/for/developers') },
    //     { text: 'Side Projects', href: getPermalink('/for/side-projects') },
    //     { text: 'Startups', href: getPermalink('/for/startups') },
    //     { text: 'Agencies', href: getPermalink('/for/agencies') },
    //     { text: 'Bootstrappers', href: getPermalink('/for/bootstrappers') },
    //     { text: 'Enterprise', href: getPermalink('/for/enterprise') },
    //   ],
    // },
    // {
    //   title: 'MailPace vs.',
    //   links: [
    //     { text: 'Postmark', href: getPermalink('/compare/postmark-alternative') },
    //     { text: 'Resend', href: getPermalink('/compare/resend-alternative') },
    //     { text: 'Mailgun', href: getPermalink('/compare/mailgun-alternative') },
    //     { text: 'SendGrid', href: getPermalink('/compare/sendgrid-alternative') },
    //     { text: 'SparkPost', href: getPermalink('/compare/sparkpost-alternative') },
    //     { text: 'Amazon SES', href: getPermalink('/compare/aws-ses-alternative') },
    //     { text: 'Mandrill', href: getPermalink('/compare/mandrill-alternative') },
    //   ],
    // },
    {
      title: 'Resources & Support',
      links: [
        { text: 'Contact Us', href: 'mailto:support@mailpace.com' },
        { text: 'Status', href: 'https://status.mailpace.com' },
        { text: 'API Documentation', href: 'https://docs.mailpace.com' },
        // { text: 'Code Libraries', href: getPermalink('/code') },
        { text: 'Blog', href: getBlogPermalink() },
        // { text: 'Careers', href: getPermalink('/careers') },
        { text: 'Newsletter', href: getPermalink('/newsletter') },
      ],
    },
  { title: 'Guides' , links: await getGuidePosts() },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
    { text: 'Data Protection Act (DPA)', href: getPermalink('/dpa') },
  ],
  socialLinks: [
    // { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/mailpace' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/mailpace' },
  ],
  footNote: `
    Proudly made in the UK 🇬🇧 and hosted in the European Union 🇪🇺
  `,
};
