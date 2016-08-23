var Common = {
    showProp : function(msg){
        var btn = typeof(arguments[1])=="undefined" ? "确 认" : arguments[1];
        if(!$(".Prop").length){
            var box = "<div class='Prop' style='background:rgba(0,0,0,0.2);display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999'>"
                        +"<div style='position:fixed;width:80%;height:160px;line-height:110px;top:50%;margin-top:-80px;font-size:2rem;text-align:center;left:10%;background:#fff;box-shadow:0 0 1px 1000px rgba(0,0,0,0.3);border-radius:10px;'>"
                            +"<div style='position:relative;width:100%;height:100%;'>"
                            +   "<p class='text' style='height:110px;color:#666;'>"+msg+"</p>"
                            +   "<p class='closeBtn' style='width:100%;bottom:0;left:0;border-top:1px solid #dedede;position:absolute;height:50px;line-height:50px;font-size:2rem;color:#009eff;'>"+btn+"</p>"
                            +"</div>"
                        "</div>"
                   +"</div>";
            $("body").append(box);
            $(".Prop").fadeIn();

            $(".Prop .closeBtn").click(function(){
                $(".Prop").fadeOut();
            });
        }else{
            $(".Prop").fadeIn().find(".text").text(msg);
        }
    },
    empty : function(obj){
        var objVal = $.trim(obj.val());
        if(objVal == ""){
            Common.showProp(Common.emptyMsg(obj));
            return false;
        }
        return true;
    },
    phone:function(obj){
        var objVal = $.trim(obj.val()),
            strReg = /^((\(\d{2,3}\))|(\d{3}\-))?1[3,8,5]{1}\d{9}$/;
        if(!strReg.test(objVal)){
            Common.showProp(Common.errorMsg(obj));
            return false;
        }
        return true;
    },


    ajaxFileUpload : function(obj){
        var closestBox = obj.closest("div"),
            idname = obj.attr("id"),
            fileElementId = idname != undefined ? idname : "fileName";
        closestBox.addClass("loading");

        $.ajaxFileUpload({
            url: obj.attr('data-url'),
            secureuri: false,
            fileElementId: fileElementId,
            dataType: 'json',
            type:"post",
            success: function(result) {
                closestBox.removeClass("loading");
                var type = result['type'];// type 为返回状态
                if (type == 1) {      //1、成功
                    if (typeof(result['url']) != "undefined") {
                        Common.showProp(result['msg'], Message.m009);
                        setTimeout(function () {
                            window.location.href = result['url']
                        }, 3000);
                    } else {
                        Common.showProp(result['msg']);
                    }
                } else if (type == 0) {    //0、失败
                    Common.showProp(result['msg']);
                }
            },
            error:function(data){
                console.log(data);
            }
        });
        return false;
    },
    emptyMsg:function(obj){
        return obj.closest("li").find("label").text().replace("：","不能为空。");
    },
    errorMsg:function(obj){
        return obj.closest("li").find("label").text().replace("：","填写不正确。");
    },
    asyn:function(options){
        var options = $.extend({
            btn:"",
            url:"",
            data:"",
            type:"post",
            dataType:"json"
            },options);
        options.btn.attr("disabled","disabled");
        $.ajax({
            url : options.url,
            data : options.date,
            type : options.type,
            dataType : options.dataType,
            success : function(result){
                var type = result.type;// type 为返回状态
                if(type == 1){      //1、成功
                    if(typeof(result.url) != "undefined"){
                        Common.showProp(result.msg,Message.m009);
                        setTimeout(function(){window.location.href=result.url},3000); //这个url指的需要跳转到的页面，例如登入成功跳到首页，找回密码成功就可能跳到个人中心。
                    }else{
                        Common.showProp(result.msg);  //msg为返回状态，这里是例如登入成功，或者注册成功
                    }
                }else if(type == 0){  //0、失败
                    Common.showProp(result.msg);  //mgs为返回状态，这里是失败的原因。
                    if(typeof(options.fn) != "undefined"){
                        options.fn();
                    }
                    options.btn.removeAttr("disabled");
                }else{          //其他原因,例如请求头信息错误之类的
                    Common.showProp(Message.m008);   //请求失败，请重试
                    if(typeof(options.fn) != "undefined"){
                        options.fn();
                    }
                    options.btn.removeAttr("disabled");
                }
            },
            error:function(){
                Common.showProp(Message.m008);       //请求失败，请重试
                if(typeof(options.fn) != "undefined"){
                    options.fn();
                }
                options.btn.removeAttr("disabled");
            }
        });
    }
}

;(function($) {
    $.fn.extend({
        isOnScreen:function(options){
            var options = $.extend({
            },options);
            var win = $(window);
            var viewport = {
                top : win.scrollTop(),
                left : win.scrollLeft()
            };
            viewport.right = viewport.left + win.width();
            viewport.bottom = viewport.top + win.height();
            var bounds = this.offset();
            bounds.right = bounds.left + this.outerWidth();
            bounds.bottom = bounds.top + this.outerHeight();
            return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
        },
        lazyload:function(options){
            var options = $.extend({
                cattr:'src',
                mattr:'data-original',
                els:'img',
                rate:200
            },options);
            var loadData = function(){
                var em = $(options.els+":visible["+options.mattr+"]");
                em.each(function(){
                    if($(this).isOnScreen()){
                        var mattr = $(this).attr(options.mattr);
                        $(this).attr(options.cattr,mattr).removeAttr(options.mattr);
                    }
                });
            }
            loadrun = setInterval(loadData,options.rate);
        }
    });
})(zepto);
