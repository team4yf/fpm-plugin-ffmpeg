import _ from 'lodash'
const { spawn } = require('child_process');

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

export default {
  bind: (fpm) => {
    const biz = { }
    const subprocess = {}
    // Run When Server Init
    fpm.registerAction('INIT', () => {
      const c = _.assign({
        bin: 'D:/Work/ffmpeg/bin/ffmpeg.exe',
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
        if(_.has(subprocess, streamId)){
          // opened
          return 1
        }
        const pr = spawn( c.bin, `-i ${ genProtocal(brand, user, pass, ip, ch) } -f flv -r 25 -s 1960*1280 -an rtmp://${ c.nginx }:1935/live/${ streamId }`.split(' '))
        
        pr.stderr.on('data', (data) => {
          fpm.logger.error(`stderr: ${data}`);
        });

        subprocess[streamId] = pr
        return 1
      }
      biz.stop = async ( args ) => {
        const { streamId } = args
        if(!_.has(subprocess, streamId)){
          return 0
        }
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
