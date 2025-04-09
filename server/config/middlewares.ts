export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'", 
            'data:', 
            'blob:', 
            'market-assets.strapi.io', 
            'res.cloudinary.com'
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '256mb', // Form data limit
      jsonLimit: '256mb', // JSON data limit
      textLimit: '256mb', // Text data limit
      formidable: {
        maxFileSize: 10 * 1024 * 1024, // 10MB in bytes, adjust as needed
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
