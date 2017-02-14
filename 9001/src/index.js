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

//流星
function drawStar(){
  var theCanvas = document.getElementById('canvas');
  var context = theCanvas.getContext('2d');

  var number = 40;
  var starList = [];

  var star = new Image();
  star.src = "images/star.png";

  var j = 0;
  var timer_1= setInterval(function(){
      j++;
      if(j>number){
        clearInterval(timer_1);
        return;
      }
      var r1 = Math.random();
      var r2 = Math.random();
      var r3 = Math.random();
      starList.push([1030*r1+280,1030*r1-280,280*r2,280*r2,r2,0]);
    },200)

  setInterval(function(){
    context.clearRect(0,0,750,900);
    drawMotion(starList);
  },10)
  // drawMotion(starList);

  function drawMotion(starList,r3){
    // console.log(starList.length)
    var length = starList.length;
    for(var i=0;i<length;i++){
      starList[i][5] += 0.2;
      starList[i][0] -= starList[i][5]*starList[i][4]*0.4;
      starList[i][1] += starList[i][5]*starList[i][4]*0.4;
      if(starList[i][0]>750 || starList[i][1]>750){
        var r1 = Math.random();
        var r2 = Math.random();
        starList[i][0] = 1030*r1+280;
        starList[i][1] = 1030*r2-280;
        starList[i][5] = 0;
      }
      // console.log(starList[i][0])
      context.globalAlpha=starList[i][5]/20;
      context.drawImage(star,starList[i][0],starList[i][1],starList[i][2],starList[i][3]);
    }
  }
}

var Game = function(){
  this.content   = $('.content');
  this.width     = $(window).width()>540?540:$(window).width();
  this.height    = $(window).height();
  this.timer     = null;
  this._time      = 60;
  this.cardCount = 16;
  this.cardList  = [];
  this._showElement = [];
  this._showList = [];
  this._fail = false;
  this._success = false;
  this._score = 0 ;
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
  _this.content.addClass('step-1');
  var html ='';
  html += '<img src="images/banner.png" alt="标题" class="banner">'
        + '<img src="images/canyuyouxi.png" alt="参与游戏" class="btn btn-play">'
        + '<canvas id="canvas" width="750" height="900"></canvas>'
        + '<img src="images/youxiguize.png" alt="规则" class="btn btn-guize">';
  _this.content.html(html);

  drawStar();
}
//第二步
Game.prototype.step_2 = function(){
  var _this = this;
  _this.content.removeClass('step-1');
  _this.content.addClass('step-2');
  //变量初始化
  // _this._time = 60;
  _this.cardList = [];
  var html='';
  html += '<div class="time">倒计时 <span>'+_this._time+'</span> 秒</div>';
  html += '<div class="row" style="padding-left:1%;">'
  for(var i =0;i<_this.cardCount;i++){
    html+= '<div class="card" style="width:'+this.width*0.22+'px;height:'+this.width*0.22*1.25+'px;"></div>'
    _this.cardList.push(i%(_this.cardCount/2)+1);
  }
  html += '</div>';

  //卡片随机分配
  shuffle(_this.cardList);
  console.log(_this.cardList);
  _this.content.html(html);
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
    _this.content.find('.time').html('倒计时 <span>'+_this._time+'</span> 秒');
  },1000)
}

//失败
Game.prototype.fail = function(){
  var _this = this;
  _this._fail = true;
  console.info('fail');
  $('.shade').show();
  $('.dialog-fail').fadeIn();
}
//成功
Game.prototype.success = function(){
  var _this = this;
  _this._success = true;
  console.info('success');
  $('.shade').show();
  $('.dialog-success').fadeIn();
}

//游戏判断
Game.prototype.play = function(el){
  var _this = this;
  if(_this._fail) return;
  if(el.hasClass('show')) return;
  if(_this._showList.length>=2) return;
  var index = el.index();
  el.addClass('show card-'+_this.cardList[index]);
  _this._showList.push(_this.cardList[index]);
  _this._showElement.push(el);
  if(_this._showList.length==2){
    setTimeout(function(){
      if(_this._showList[0]==_this._showList[1]){
        _this._showElement[0].removeClass('show').addClass('hide');
        _this._showElement[1].removeClass('show').addClass('hide');
        _this._score+=2;
      }else{
        _this._showElement[0].removeClass('show');
        _this._showElement[1].removeClass('show');
      }
      _this._showList=[];
      _this._showElement=[];
      console.log(_this._score);
      if(_this._score==_this.cardCount){
        _this._success=true;
        _this.success();
      }
    },500)
  }

}
Game.prototype.event = function(){
  var _this = this;
  document.body.addEventListener('touchstart',function(ev){
    ev.stopPropagation();
    ev.preventDefault();
    $el = $(ev.target);
    //打开规则 
    if($el.hasClass('btn-guize')){
      $('.shade').show();
      $('.dialog-guize').slideDown();
      return;
    }
    //隐藏规则
    if($el.hasClass('dialog-guize')){
      $('.shade').hide();
      $('.dialog-guize').slideUp();
      return;
    }
    //进入游戏
    if($el.hasClass('btn-play')){
      _this.step_2();
      return;
    }
    //点击卡片
    if($el.hasClass('card')){
      _this.play($el);
    }
    //我知道了
    if($el.hasClass('btn-know')){
      $('.shade').hide();
      $('.dialog').hide();
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


