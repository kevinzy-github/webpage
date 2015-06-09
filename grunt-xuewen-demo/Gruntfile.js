/**
 * Created by xuxuewen on 2015/1/29.
 */
/*获取系统相关配置设置的参数*/
var os = require('os');
module.exports = function(grunt) {
        grunt.initConfig({
            express:{
                myServer:{
                    options:{
                        port:7809,
                        hostname:getLocalIP(null,'IPv4'),
                        bases:'dev',
                        livereload:true
                    }
                }
            },
            watch: {
                scripts: {
                    files: ['dev/**/*.html'],
                    options: {
                        livereload: 10086
                    }
                }
            },
            open:{
                dev:{
                    path:'http://'+getLocalIP(null,'IPv4')+':7809/html',
                    app: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
                }
            }
        });
        /*插件任务导入*/
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-express');
        grunt.loadNpmTasks('grunt-open');

        /*任务合并，以及设置别名*/
        grunt.registerTask('pub', ['express:myServer', 'open:dev','watch']);
}

/**
 *   获取系统ip地址
 */
function getIp() {
    var osIp = null;
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        var alias=0;
        if(dev == '本地连接' || dev == 'en0' || dev.indexOf('无线网络连接') != -1){//修改了linux系统中ip的bug
            ifaces[dev].forEach(
                function(details) {
                    if (details.family == 'IPv4') {
                        osIp = details.address;
                    }
                }
            );
        }
    }
    return osIp;
}


var getLocalIP = function(name, family) {
    //所有的网卡  
    var ifaces = os.networkInterfaces();
    //移除loopback,没多大意义  
    for (var dev in ifaces) {
        if (dev.toLowerCase().indexOf('loopback') != -1) {
            delete ifaces[dev];
            continue;
        }
    }
    var ip = null;
    family = family.toUpperCase();
    var iface = null;
    if (name == null) {
        for (var dev in ifaces) {
            ifaces[dev].forEach(function(details) {
                if (details.family.toUpperCase() === family) {
                    ip = details.address;
                }
            });
            break;
        }
        return ip;
    }
    var nameList = name.split(',');
    for (var i = 0, j = nameList.length; i < j; i++) {
        var key = nameList[i];


        //指定的链接不存在  
        if (ifaces[key] == null) {
            continue;
        }


        ifaces[key].forEach(function(details) {
            if (details.family.toUpperCase() === family) {
                ip = details.address;
            }
        });
        if (ip != null) {
            break;
        }
    }
    if (ip == null) {
        ip = '127.0.0.1';
        console.error('get ip error, return 127.0.0.1, please check');
    }

    return ip;
}