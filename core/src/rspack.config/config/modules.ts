/**
 * rspack modules 配置
 */
import { RspackOptions, RuleSetRule } from '@rspack/core';
interface FefaultRulesProps {
  imageInlineSizeLimit: number;
}

export const getRspackModolesConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  module?: RspackOptions['module'],
): RspackOptions['module'] => {
  const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');
  const newModules = { ...module };
  return {
    ...newModules,
    rules: [...defaultModolesRules({ imageInlineSizeLimit }), ...(newModules?.rules || [])],
  };
};

/**
 * 默认 loader 配置
 */
export const defaultModolesRules = (props: FefaultRulesProps): RuleSetRule[] => [
  {
    test: /\.js$/,
    type: 'jsx',
  },
  {
    test: /\.ts$/,
    type: 'tsx',
  },
  {
    test: [/\.avif$/],
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: props.imageInlineSizeLimit,
      },
    },
  },
  {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    parser: {
      dataUrlCondition: {
        // Modules less than or equal to 4kb and ending in `.png` will be Base64 encoded
        maxSize: props.imageInlineSizeLimit,
      },
    },
    type: 'asset/resource',
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: require.resolve('@svgr/webpack'),
        options: {
          prettier: false,
          svgo: false,
          svgoConfig: {
            plugins: [{ removeViewBox: false }],
          },
          titleProp: true,
          ref: true,
        },
      },
      {
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash].[ext]',
        },
      },
    ],
    issuer: { and: [/\.(ts|tsx|js|jsx|md|mdx)$/] },
  },
  {
    test: /\.less$/,
    // use: 'less-loader',
    type: 'css',
  },
  {
    test: /\.s(c|a)ss$/,
    // use: 'less-loader',
    type: 'css',
  },
  {
    test: /\.module\.s(c|a)ss$/,
    // use: 'less-loader',
    type: 'css/module',
  },
  {
    test: /\.module\.less$/,
    // use: 'less-loader',
    type: 'css/module',
  },
];
