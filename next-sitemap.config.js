/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://vi-memo.com',
  generateRobotsTxt: true, // (optional) Set to true if you want to generate robots.txt
  sitemapSize: 5000,
  outDir: 'out', // 生成されたサイトマップの出力先ディレクトリ
  generateIndexSitemap: true, // インデックスサイトマップを生成するかどうか
};
