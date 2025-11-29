const million = require("million/compiler");
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
 
const millionConfig = {
//   auto: true
//     // threshold: 0.05, // default: 0.1,
//     skip: ['useBadHook', /badVariable/g],
//     // if you're using RSC: auto: { rsc: true },
//   },
};
 
// module.exports = million.next(nextConfig, millionConfig);
module.exports = nextConfig;