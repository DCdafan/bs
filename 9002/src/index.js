//数组随机排列 洗牌shuffle
/*
* error shuffle
* arr.sort(function(){
*        return Math.random() - 0.5;
*    });
*/
function shuffle(arr){
  var len = arr.length;
  for(var i = 0; i < len - 1; i++){
    var idx = Math.floor(Math.random() * (len - i));
    var temp = arr[idx];
    arr[idx] = arr[len - i - 1];
    arr[len - i -1] = temp;
  }
  return arr;
}

// 逻辑代码

var Game = function(){
  this.content = $('.content');
  this.width = $(window).width();
  this.height = $(window).height();
  this.word = ['健','康','美','宅','仰','止','南','院'];
  this.words = ['建','喃','楠','趾','楠','陛','院','建','楠','南','楠','宇','趾','隶','趾','迎','迎','宅','趾','康','隶','仰','迎','此','此','此','止','宇','养','美','建','健','此','此','养','此'];
  this._score = 0 ;
  this._time  = 40;
  this._timer = null;
  this._fail = false;
  this._success = false;
  this.init();
  this.step_1();
}
//初始化
Game.prototype.init = function(){
  var _this = this;
  _this.content.css({
    width:_this.width,
    height:_this.height
  })
  _this.event();
}
//第一步
Game.prototype.step_1 = function(){
  var _this = this;
  _this.content.addClass('step_1');
  var html = '';
  html+='<div class="btn btn-play"></div>';
  _this.content.html(html);
}
//第二步
Game.prototype.step_2 = function(){
  var _this = this;
  _this.content.removeClass('step_1');
  _this.content.addClass('step_2');
  var html = '';
  html+='<div class="countdown"></div>';
  _this.content.html(html);
  var timer = null;
  var number = 10;
  _this.content.find('.countdown').html(number);
  timer=setInterval(function(){
    number--;
    if(number<0){
      clearInterval(timer);
      _this.step_3();
      return;
    }
    _this.content.find('.countdown').html(number);
  },1000)
}
//第三步
Game.prototype.step_3=function(){
  var _this = this;
  _this.content.removeClass('step_2');
  _this.content.addClass('step_3');
  var html = '';
  html+= '<div class="game">'
        +'<div class="time">倒计时 <b>'+_this._time+'</b> 秒</div>'

  //标题
  html+= '<div class="word">'
  $.each(_this.word,function(index, el) {
    if((index)%4==0){
      html+='&nbsp;';
    }
    html+='<span>'+el+'</span>';
  });
  html+= '</div>';

  //游戏内容
  shuffle(_this.words); //洗牌

  html+= '<div class="words">'
  $.each(_this.words,function(index, el) {
    html+='<span class="btn-words">'+el+'</span>';
  });
  html+= '</div>';
  html+= '</div>';
  _this.content.html(html);
  _this._score = 0;
  $('.word span').eq(0).addClass('on mark');
  _this.time();
}
//计时
Game.prototype.time = function(){
  var _this =this;
  var timer = null;
  timer=setInterval(function(){
    _this._time--;
    if(_this._success){
      clearInterval(timer);
      return;
    }
    if(_this._time<0){
      clearInterval(timer);
      _this.fail();
      return;
    }
    _this.content.find('.time').html('倒计时 <b>'+_this._time+'</b> 秒');
  },1000)
}
//失败
Game.prototype.fail = function(){
  var _this = this;
  _this._fail = true;
  console.info('fail');
  $('.dialog').addClass('fail').show();
  $('.dialog').html('<div class="btn-again"></div>');
}
//成功
Game.prototype.success = function(){
  var _this = this;
  _this._success = true;
  console.info('success');
  $('.dialog').addClass('success').show();
  $('.dialog').html('<p>恭喜你完成了拼字</p><p>返回微信界面领取你的惊喜红包!!!</p>')
}
//加分
Game.prototype.score = function(world){
  console.log(world);
  var _this =this;
  if(_this._fail) return;
  if(_this.word[_this._score] == world){
    console.log(111);
    _this._score++;
    if(_this._score == _this.word.length){
      _this.success();
      return;
    }
    $('.word span').removeClass('mark');
    $('.word span').eq(_this._score).addClass('on mark');
    //重置游戏内容
    shuffle(_this.words); //洗牌
    var html="";
    $.each(_this.words,function(index, el) {
      html+='<span class="btn-words">'+el+'</span>';
    });
    _this.content.find('.words').html(html);

  }
}
//重置
Game.prototype.again = function(){
  this._score = 0 ;
  this._time  = 20;
  this._timer = null;
  this._fail = false;
  this._success = false;
  $('.dialog').removeClass('fail success').hide();
  this.step_3();
}
//游戏逻辑
Game.prototype.play = function(world){
  var _this = this;
  console.info('touch');
  clearTimeout(_this._timer);
  _this._timer=setTimeout(function(){
    _this.score(world);
  },200)
}
//事件
Game.prototype.event = function(){
  var _this = this;
  document.body.addEventListener('touchstart',function(ev){
    ev.stopPropagation();
    ev.preventDefault();
    $el = $(ev.target);
    //打开规则 
    if($el.hasClass('btn-play')){
      _this.step_2();
      return;
    }
    //游戏逻辑
    if($el.hasClass('btn-words')){
      _this.play($el.text());
      return;
    }
    //再来一次
    if($el.hasClass('btn-again')){
      _this.again();
      return;
    }

  });
  document.body.addEventListener('touchmove',function(ev){
    ev.stopPropagation();
    ev.preventDefault();
  });
  document.body.addEventListener('touchend',function(ev){
    ev.stopPropagation();
    ev.preventDefault();
  });
}

