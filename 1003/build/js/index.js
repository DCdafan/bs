"use strict";

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
 function defaultEvent(element){
  if(element === undefined) return;
  element.addEventListener("touchstart",function(e){
    // e.preventDefault();
    // e.stopPropagation();
  })
  element.addEventListener("touchend",function(e){
    // e.preventDefault();
    // e.stopPropagation();
  })
  element.addEventListener("touchmove",function(e){
    e.preventDefault();
    e.stopPropagation();
  })
}
var Game = function(option){
  this.times        = option.times;
  this.ele          = option.ele;
  this.title        = option.title;
  this.time         = option.time;
  this.length       = option.length;
  this.correct      = 0 ;
  this.fail         = false ;
  this.successCall  = option.success;
  this.failCall     = option.fail;
  this.word         = ['建','喃','楠','趾','楠','陛','院','建','楠','南','楠','宇','趾','隶','趾','迎','迎','宅','趾','康','隶','仰','迎','此','此','此','止','宇','养','美','建','健','此','此','养','此'];

  //  对象判断 
  if($(this.ele).length == 0) return;
  this.$ele = $(this.ele);
  if($(this.title).length == 0) return;
  this.$title = $(this.title);
  if($(this.time).length == 0) return;
  this.$time = $(this.time);

  //存放新word
  this.newWord = [];
}
Game.prototype.init = function(){
  this.correctAnimation(0);
}
Game.prototype.correctAnimation = function(number){
  //随机字母
  this.newWord = shuffle(this.word);
  var html  = '';
  for(var i = 0 ;i<this.newWord.length;i++){
    html += '<span>' + this.newWord[i] + '</span>';
  }
  this.$ele.html(html);
  //动画部分
  this.$title.find('span').eq(number).addClass('on');
  var left  = this.$title.find('.on').last().offset().left;
  var width = this.$title.find('.on').last().width();
  this.$title.find('i').css({
    'left' : left + width/2
  })
}
Game.prototype.play = function(){
  this.init();
  var $this = this;
  $this.$time.find('span').html($this.times)
  var timer = setInterval(function(){
    $this.times--;
    $this.$time.find('span').html($this.times);
    if($this.times<=0){
      clearTimeout(timer);
      $this.failCall();
      $this.$ele.html('');
      this.fail = true;
    }
  },1000);

  this.$ele[0].addEventListener('touchend',function(ev){
    //失败后直接退出
    if($this.fail) return;
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    var nodeName = target.nodeName.toLowerCase();
    if(nodeName == 'span'){
      if($(target).text() == $this.$title.find('span').eq($this.correct).text()){
        $this.correct++;
        if($this.correct == $this.length){
          clearTimeout(timer);
          $this.successCall($this.times);
          $this.$ele.html('');
          return;
        }
        $this.correctAnimation($this.correct);
      }

    }
  })
}
