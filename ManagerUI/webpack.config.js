/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import { resolve as _resolve } from 'path';

export const entry = './src/Main.ts';
export const mode = 'development';
export const devtool = 'inline-source-map';
export const module = {
  rules: [
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
  ],
};
export const resolve = {
  extensions: ['.tsx', '.ts', '.js'],
};
export const output = {
  filename: 'bundle.js',
  // eslint-disable-next-line no-undef
  path: _resolve(__dirname, 'dist'),
};
