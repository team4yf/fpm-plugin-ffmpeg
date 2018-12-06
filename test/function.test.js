const assert = require('assert');
const { init, Func } = require("yf-fpm-client-js");

init({appkey: '123123', masterKey: '123123', domain: 'http://localhost:9999'});


describe('Function', function(){
  beforeEach(done => {
    var func = new Func('ffmpeg.run');
    func.invoke({streamId: 'abc1', ip: '192.168.100.206', user: 'admin', pass: 'admin123'})
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
        // assert.strictEqual(data.proc[0], 'abc1', "should contains abc1")
        done();
      }).catch(function(err){
        done(err);
      })
  })

  it('Function run', function(done){
    var func = new Func('ffmpeg.run');
    func.invoke({streamId: 'abc1', ip: '192.168.100.206', user: 'admin', pass: 'admin123'})
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
        assert.strictEqual(data.proc[0], 'abc1', "should contains abc1")
        done();
      }).catch(function(err){
        done(err);
      })
  })

  it('Function stop', function(done){
    var func = new Func('ffmpeg.stop');
    func.invoke({streamId: 'abc1'})
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
