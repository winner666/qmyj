app.factory('weixin', ['appId', 'host','$http','dailog','$state','$timeout', function(appId, host,$http,dailog,$state,$timeout) {
    return {
        url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appId= 

' + appId + '&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect',
        isweixin: function() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getUser: function(code) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", host + "/wx/code", false);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var data=JSON.parse(xhr.responseText);
                        data.cart=[];
                        localStorage.setItem('MY_USER_INFO', JSON.stringify(data));
                    } else {
                        console.error(xhr.statusText);
                    }
                }
            };
            xhr.onerror = function(e) {
                console.error(xhr.statusText);
            };
            xhr.send('code='+code);
        },
        getUserInfo: function() {
            if (localStorage.getItem('MY_USER_INFO') != null) {
                return JSON.parse(localStorage.getItem('MY_USER_INFO'));
            } else {
                if (this.getQueryString('code') != null) {
                    this.getUser(this.getQueryString('code'));
                    return JSON.parse(localStorage.getItem('MY_USER_INFO'));
                } else {
                    window.location.href = this.url;
                }
            }
        },
       setUserInfo:function(name,value){
            var info=this.getUserInfo();
            info[name]=value;
            localStorage.setItem('MY_USER_INFO', JSON.stringify(info));
        },
        getMessage: function(openId) {
            dailog.showLoad();
            return $http.get(host + "/ds/g/WxUser?condition[openId]="+openId);
        },
        getNonceStr:function(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(36);
            });
        },
        getTs:function(){
            return Math.floor((new Date()).getTime()/100).toString();
        },
        config:function(){
            var noncestr=this.getNonceStr();
            var ts=this.getTs();
            //获取签名
            $http.get(host + "/wx/js-api-sign", 
                {
                    params: {
                        noncestr:noncestr,
                        ts:ts,
                        url:encodeURIComponent(location.href)
                    }
                }
            ).success(function(data){
                wx.config({
                    debug: false,
                    appId: appId, 
                    timestamp: ts,
                    nonceStr: noncestr,
                    signature: data.sign,
                    jsApiList: ['closeWindow','chooseWXPay']
                });
            })            
        },
        pay:function(orderId){
            var option={};
            this.getPayOption(orderId).success(function(data){
                option=data;
                if (typeof WeixinJSBridge == "undefined"){
                    if( document.addEventListener ){
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    }else if (document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                }else{
                    onBridgeReady();
                }
            })
            function onBridgeReady(){
                WeixinJSBridge.invoke('getBrandWCPayRequest', option, function(res){     
//                  /*if(res.err_msg == "get_brand_wcpay_request:ok" ) {
//                      $state.go('order');
//                      location.reload();
//                  }else{
//                      
//                  }*/
                    $state.go('order');
                    $timeout(function(){
                        location.reload();
                    },300)                    
                })
            }
            
        },
        getPayOption:function(orderId){
            return $http.post(host+'/ds/order/wx-pay-order',{orderId:orderId})
        }
    }
}])
