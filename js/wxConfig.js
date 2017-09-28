function initWXConfig() {
    this.nonceStr = "";
    this.timestamp = "";
    this.appId = "";
    var origin=window.location.origin;
  	var pathname=window.location.pathname
  console.log(origin,pathname)
    this.currentUrl=origin+pathname;
    console.log(this.currentUrl)
   // this.url=hua+'AdvPicController/getWxConfig.do';
 this.url=hua+'wechat/access_token.do';
//this.url=hua+'weixinController/share.do';
    this.debug = false;
    // 所有要调用的 API 都要加到这个列表中
    this.jsApiList = [
        'scanQRCode','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'
    ];
    this.signature = '';
    this.getJSApi_ticket();
}
initWXConfig.prototype = {
    getJSApi_ticket: function() {
        var self = this;
       
        self.requestFormData({
            url:self.url,
            sendData:{url:self.currentUrl},
          // sendData:{url:self.currentUrl},
            resSuccess:function(data){
            	console.log(data)
               
                self.timestamp=data.timestamp;
                self.appId='wx8f600f6da5379290';
                self.nonceStr=data.nonceStr;
                self.signature=data.signature;
                self.setConfig();
            },
            resFailed:function(){
            }
        });
    },
    setConfig: function() {
        var self = this;
       console.log(self.appId,self.timestamp,self.nonceStr,self.signature,self.jsApiList)
        wx.config({
            debug: self.debug,
            appId: self.appId,
            timestamp: self.timestamp,
            nonceStr: self.nonceStr,
            signature: self.signature,
            jsApiList: self.jsApiList
        });
    },
    requestFormData:function (options) {
        var self=this;
        var url=options.url;
        var sendData=options.sendData;
        var resSuccess=options.resSuccess;
        var resFailed=options.resFailed;
        var resError=options.resError;
        jQuery.support.cors = true;
       
        $.ajax
        ({
            data:sendData,
            type: "get",
//          contentType: "application/x-www-form-urlencoded;charset=utf-8",           	
            url:url,
            success:function(data){
            	console.log(data)                          
                     !!resSuccess&&$.isFunction(resSuccess)&&resSuccess(data);                            
            },
            timeout:20000,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("网络不畅，请稍后重试");
                !!resError&&$.isFunction(resError)&&resError(data);
            }
        });
    },
    _scanQRCode:function(){
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                // console.log(result);
                window.location.href=result;
            }
        });
    },
    _onMenuShareTimeline:function(options){
        var self=this;
        var title=options.title;
        var imgUrl=options.imgUrl;
        
        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: self.currentUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () { 
                alert('分享成功')
                // 用户确认分享后执行的回调函数
            },
            cancel: function () { 
                alert('分享失败，请稍后重试')
                // 用户取消分享后执行的回调函数
            }
        });
    },
    _onMenuShareQQ:function(options){
        var self=this;
        var title=options.title;
        var imgUrl=options.imgUrl;
        var desc=options.desc;
        wx.onMenuShareQQ({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: self.currentUrl, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () { 
                alert('分享成功')
               // 用户确认分享后执行的回调函数
            },
            cancel: function () { 
                alert('分享失败，请稍后重试')
               // 用户取消分享后执行的回调函数
            }
        });
    },
    _onMenuShareAppMessage:function(options){
        var self=this;
        var title=options.title;
        var imgUrl=options.imgUrl;
        var desc=options.desc;
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: self.currentUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
//          type: type, // 分享类型,music、video或link，不填默认为link
//          dataUrl: dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
            success: function () { 
                alert('分享成功')
                // 用户确认分享后执行的回调函数
            },
            cancel: function () { 
                alert('分享失败，请稍后重试')
                // 用户取消分享后执行的回调函数
            }
        });
    }
}
window.wxinit = new initWXConfig();