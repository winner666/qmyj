!(function($, wx) {
  function createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
  }

  function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
  }

  function getUrl() {
  	var origin=window.location.origin;
  	var pathname=window.location.pathname
  	var url=origin+pathname;
  	
    return url;
  }

  function getJsapi_ticket() {
    $.post('http://qmyj.100dz.cn/qingmuyijia/AdvPicController/getToken.do', function(data) {
    	
      //var ticket = data.split(',')[1];
      var ticket=data.ticket;
      var params = sign(ticket);
      console.log(ticket)
      wxConfig({
        timestamp: params.timestamp,
        nonceStr: params.nonceStr,
        signature: params.signature
      });
    });       
  }

  function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort();
    var newArgs = {};
    keys.forEach(function(key) {
      newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
  }

  function sign(jsapi_ticket) {
    var ret = {
      jsapi_ticket: jsapi_ticket,
      nonceStr: createNonceStr(),
      timestamp: createTimestamp(),
      url: getUrl()
    };
    var string = raw(ret);
    var shaObj = new jsSHA(string, 'TEXT');
    ret.signature = shaObj.getHash('SHA-1', 'HEX');
    return ret;
  }

  function wxConfig(params) {
    wx.config({
        debug: false, // 开启调试模式
        appId: 'wx8f600f6da5379290', // 公众号的唯一标识
        timestamp: params.timestamp, // 生成签名的时间戳
        nonceStr: params.nonceStr, // 生成签名的随机串
        signature: params.signature,// 签名
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage'
        ]
    });
  }

  function wxShareTimeline(params) {
    wx.onMenuShareTimeline({
      title: params.title, // 分享标题
      link: params.link, // 分享链接
      imgUrl: params.imgUrl, // 分享图标
      success: function () {
        console.log(success)
      },
      cancel: function () {
        console.log(cancel)
      }
    });
  }

  function wxShareAppMessage(params) {
    wx.onMenuShareAppMessage({
        title: '', // 分享标题
        desc: '', // 分享描述
        link: '', // 分享链接
        imgUrl: '', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          console.log(success);
        },
        cancel: function () {
          console.log(cancel);
        }
    });
  }

  wx.ready(function() {
    wx.onMenuShareTimeline({
      title: 'title', // 分享标题
      link: 'link', // 分享链接
      imgUrl: 'imgUrl', // 分享图标
      success: function () {
        console.log(success);
      },
      cancel: function () {
        console.log(cancel);
      }
    });
  });

  (function init() {
    getJsapi_ticket();
  })();
})(jQuery, wx);
