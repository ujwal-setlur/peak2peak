import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      allowedHosts: ['loaclhost',
    '1337--main--dethen-workspace--dethen-evolvier.workspace.evolvier.com',
],
},
  });
};
