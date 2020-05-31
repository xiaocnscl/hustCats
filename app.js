//app.js
App({

  globalData:{
    openid:'',
    userInfo:'',
    beta:1.113
  },
  getCode: function(){
    let tSlice = Math.floor(new Date().valueOf() / 30000);
    let code =  Math.abs(Math.cos(tSlice)).toString().substr(2, 6);
    return code;    
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let that=this
    
    wx.login({
      
      success: function(res) {
        console.log(that.globalData.openid)
        wx.setStorage({
          key:"openid",
          data:that.globalData.openid
        })
        let jscode = res.code
        if (res.code) {
      wx.getStorage({
        key: 'openid',
        success:function(res)
        {
          console.log(res.data)
          if(res.data=='')
          {
            
              //发起网络请求
            
              wx.request({
                
                url: 'https://wxapi.ufatfat.com/hustcats/user/getopenid',
                method:"POST",
                header:{
                  'content-type':'application/x-www-form-urlencoded'
                },
                data: {
                  jscode: jscode,
                  beta:that.globalData.beta, tsvc: that.getCode(),openid:that.globalData.openid
                },
                success:(res)=>{
              console.log(res.data)
               that.globalData.openid = res.data
               wx.setStorage({
                key:"openid",
                data:res.data
              })
                wx.request({
                  url:"https://wxapi.ufatfat.com/hustcats/user/userInfo",
                  method:"POST",
                  header:{
                    'content-type':'application/x-www-form-urlencoded'
                  },
                  data:{
                    
                    avatar:'',
                    nickname:'',
                    gender:'',
                    beta:that.globalData.beta, tsvc: that.getCode(),openid:that.globalData.openid
                  }
                })
                },
               fail:(res)=>{
                
                 
                },
              },
              )
           
          
          }else{
            that.globalData.openid = res.data
            console.log(that.globalData.openid)
          }
        }
      })
    } else {
             
    }
      
    }
    });
  


    // 获取用户信息
    wx.getSetting({
      success: res => {
      
 
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
        
              // 可以将 res 发送给后台解码出 unionId
             that.globalData.userInfo = res.userInfo
          
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
        
              wx.request({
                url:'https://wxapi.ufatfat.com/hustcats/user/userInfo',
                method:'POST',
                header:{
                  'content-type':'application/x-www-form-urlencoded'
                },
                data:{
                  avatar:that.globalData.userInfo.avatarUrl,
                  nickname:that.globalData.userInfo.nickName,
                  gender:that.globalData.userInfo.gender,
                 
                  beta:that.globalData.beta, tsvc:that.getCode(),openid:that.globalData.openid
                }
              })
            },
             fail:(res)=>{
        
        }
       })
      }else 
       {
      
          wx.authorize({
            scope: 'scope.userInfo',
            success () {
            
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.getUserInfo({
                success: res => {
          
                  // 可以将 res 发送给后台解码出 unionId
                 that.globalData.userInfo = res.userInfo
              
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(res)
                  }
             
                },
                 fail:(res)=>{
          
            }
           })
            }
          })
        
      }
    }
       
      
    })
  },

})