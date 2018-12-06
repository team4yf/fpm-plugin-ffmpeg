## FPM-PLUGIN-FFMPEG
用于ffmpeg的插件

### Install
```bash
yarn add fpm-plugin-ffmpeg
```

## Basic Info
- Run Action Hook Name: 
  - `INIT` defined the vars
  - `BEFORE_SERVER_START` extend the biz module
- ExtendModule Name: `ffmpeg`
- Exception: Nope
- `getDependencies()`
  - [x] `[]`
- The Reference Of The `Bind()` Method
  An BizModule Object Contains The Functions
  - [ ] `run`
    ```javascript
    /*
    user?=admin
    pass?=admin
    ip!
    ch?=1
    brand?=dahua
    streamId!
    */
    ```
  - [ ] `stop`
    ```javascript
    /*
    streamId!
    */
  - [ ] `info`
  - [ ] `reset`
### Useage

config.json
```javascript
{
    //...
    "ffmpeg": {
        "bin": "D:/Work/ffmpeg/bin/ffmpeg.exe",
        "nginx": "192.168.100.196",
    }
}
```

method: `ffmpeg.run`
args: `{ ip: '192.168.1.108', streamId: 'abc' }`