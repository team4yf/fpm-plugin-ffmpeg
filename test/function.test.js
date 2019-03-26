const { init, Func } = require("fpmc-jssdk");
const assert = require('assert');
init({ appkey:'123123', masterKey:'123123', endpoint: 'http://localhost:9999/api' });


describe('Function', function(){
  beforeEach(done => {
    var func = new Func('ffmpeg.run');
    func.invoke({streamId: 'test', ip: '192.168.1.211', user: 'admin', pass: 'admin123'})
      .then(function(data){
        assert.strictEqual(data, 1, "should be 1")
        done();
      }).catch(function(err){
        done(err);
      })
  })
  

  afterEach(done => {
    var func = new Func('ffmpeg.info');
    func.invoke({})
      .then(function(data){
        console.log('after', data)
        // assert.strictEqual(data.proc[0], 'test', "should contains test")
        done();
      }).catch(function(err){
        done(err);
      })
  })

  it('Function run', function(done){
    var func = new Func('ffmpeg.run');
    func.invoke({streamId: 'test', ip: '192.168.1.211', user: 'admin', pass: 'admin123'})
      .then(function(data){
        assert.strictEqual(data, 1, "should be 1")
        done();
      }).catch(function(err){
        done(err);
      })
  })

  it('Function info', function(done){
    var func = new Func('ffmpeg.info');
    func.invoke({})
      .then(function(data){
        assert.strictEqual(data.proc[0], 'test', "should contains test")
        done();
      }).catch(function(err){
        done(err);
      })
  })

  it('Function stop', function(done){
    var func = new Func('ffmpeg.stop');
    func.invoke({streamId: 'test'})
      .then(function(data){
        assert.strictEqual(data > 1, true, "should above 2 watcher")
        done();
      }).catch(function(err){
        done(err);
      })
  })

  it('Function reset', function(done){
    var func = new Func('ffmpeg.reset');
    func.invoke({})
      .then(function(data){
        assert.strictEqual(data, 1, "should equal 1")
        done();
      }).catch(function(err){
        done(err);
      })
  })
})
