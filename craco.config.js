const { launchEditorMiddleware } = require("react-dev-inspector/plugins/webpack");
const cracoLessPlugin = require("craco-less");
const { whenProd } = require("@craco/craco");
const path = require("path");
const pxScale = require("postcss-px-scale");
const TerserPlugin = require('terser-webpack-plugin')
const WebpackBar = require('webpackbar')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
const resolve = (dir) => path.resolve(__dirname, dir);

const devServerConfig = () => (config) => {
  const proxy = {
    "/api": {
      target: process.env.REACT_APP_API,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api": ""
      }
    }
  };

  config.port = process.env.PORT || config.port;
  config.historyApiFallback = true;

  config.setupMiddlewares = (middlewares) => {
    middlewares.unshift(launchEditorMiddleware);
    return middlewares;
  };

  return {
    ...config,
    proxy
  };
};

module.exports = {
  webpack: {
    alias: {
      "@": resolve("src"),
      "~": resolve("public")
    },
    plugins: {
      add: [
        // webpack构建进度条
        new WebpackBar({
          profile: true
        }),
        // 查看打包的进度
        new SimpleProgressWebpackPlugin(),
        ...whenProd(
          () => [
            new TerserPlugin({
              // sourceMap: true, // Must be set to true if using source-maps in production
              terserOptions: {
                ecma: undefined,
                parse: {},
                compress: {
                  warnings: false,
                  drop_console: true, // 生产环境下移除控制台所有的内容
                  drop_debugger: true, // 移除断点
                  pure_funcs: ['console.log'] // 生产环境下移除console
                }
              }
            })
          ], []
        )
      ]
    }
  },
  optimization: { // 抽离公用模块
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    }
  },
  plugins: [
    {
      plugin: cracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  style: {
    postcss: {
      mode: "extends",
      loaderOptions: {
        postcssOptions: {
          ident: "postcss",
          plugins: [pxScale({ scale: Number(process.env.REACT_APP_UI_ZOOM_RATIOS || 1) })]
        }
      }
    }
  },
  devServer: devServerConfig()
};
