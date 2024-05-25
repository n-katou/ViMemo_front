/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://vimemo.vercel.app',
  generateRobotsTxt: true, // (optional) Set to true if you want to generate robots.txt
  // other options
};
