module.exports = {
  chainWebpack: config => {
    // config.plugins.delete('fork-ts-checker');
    // config.module
    //   .rule('ts')
    //   .use('ts-loader')
    //   .tap(options => { return {...options, 'transpileOnly': false }});
    // config.resolve.extensions
    //   .add('ts')
    //   .add('.d.ts');
  }
}
