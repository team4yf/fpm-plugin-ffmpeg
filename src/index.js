const _ = require('lodash');
const { spawn } = require('child_process');
const debug = require('debug')('fpm-plugin-ffmpeg');

const genProtocal = (brand, user, pass, ip, ch) => {
  switch(brand){
    case 'dahua':
      return `rtsp://${ user }:${ pass }@${ ip }:554/cam/realmonitor?channel=${ ch }&subtype=1`
    case 'haikang':
      return `rtsp://${ user }:${ pass }@${ ip }:554/h264/ch${ ch }/main/av_stream`
    default:
      return `rtsp://${ user }:${ pass }@${ ip }:554/cam/realmonitor?channel=${ ch }&subtype=1`
  }
}

module.exports = {
  bind: (fpm) => {
    const biz = { }
    const subprocess = {}
    const watcher = {}
    // Run When Server Init
    fpm.registerAction('INIT', () => {
      const c = _.assign({
        bin: '/usr/bin/ffmpeg',
        nginx: '192.168.100.196',
      }, fpm.getConfig('ffmpeg'))
      biz.run = async ( args ) => {
        /**
         * params:
         * user?=admin
         * pass?=admin
         * ip!
         * ch?=1
         * brand?=dahua
         * streamId!
         */
        const { user = 'admin', pass = 'admin', ch = '1', ip, streamId, brand = 'dahua' } = args
        // add a watcher
        watcher[streamId] = watcher[streamId] ? watcher[streamId] + 1: 1;
        if(_.has(subprocess, streamId)){
          // opened
          return 1
        }
        const cmd = `-rtsp_transport tcp -i ${ genProtocal(brand, user, pass, ip, ch) } -f flv -r 25 -s 1960*1280 -an rtmp://${ c.nginx }:1935/stream/${ streamId }`;
        const pr = spawn( c.bin, cmd.split(' '))
        
        debug('RUN COMMAND: %O', cmd);
        // pr.stderr.on('data', (data) => {
        //   fpm.logger.error(`stderr: ${data}`);
        // });

        subprocess[streamId] = pr
        return 1
      }
      biz.reset = async args => {
        // remove all;
        _.map(watcher, (v, k) => {
          const proc = subprocess[k];
          proc.kill('SIGHUP')
          delete subprocess[k];
          watcher[k] = 0;
        })
        return 1;
      }
      biz.info = async args => {
        return {
          watcher,
          proc: _.keys(subprocess)
        }
      }
      biz.stop = async ( args ) => {
        const { streamId } = args
        if(!_.has(subprocess, streamId)){
          return 0
        }
        // remove a watcher
        if(watcher[streamId]){
          if(watcher[streamId] > 1){
            watcher[streamId] = watcher[streamId] - 1;
            // still has watcher.
            return 2;
          }
        }
        delete watcher[streamId];
        const proc = subprocess[streamId]
        proc.kill('SIGHUP')
        delete subprocess[streamId]
        return 1
      }

    })

    fpm.registerAction('BEFORE_SERVER_START', () => {
      fpm.extendModule('ffmpeg', biz)
    })

    return biz
  }
}
