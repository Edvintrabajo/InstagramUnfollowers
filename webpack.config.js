// @ts-nocheck
const path = require('path');

module.exports = {
  entry: './src/main.tsx',
  // Modo producción para que minifique el código (opcional, puedes cambiarlo a 'development')
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // CAMBIO IMPORTANTE: Usamos to-string-loader en lugar de style-loader
          // Esto nos permite importar el CSS como una variable de texto.
          'to-string-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Limpia la carpeta dist antes de compilar
  },
};
