/**
 * airportwriter v0.0.1
 *
 * @description jQuery Plugin for an airport typewriter effect. 
 * This is the very first time i've wrote a jQuery Plugin. So, if you know some way, to improve it, i'm pleased to hear from you.
 * 
 * @author Orlando Hohmeier http://orlandohohmeier.com
 * 
 * @license This work is licensed under a Creative Commons Attribution 3.0 Unported License. http://creativecommons.org/licenses/by/3.0/
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
(function($){
  $.fn.extend({
    airportwriter:function(options) {
      var defaults = {
        speed:100, 
        complete: null,
        chars : 'QWERTZUIOPASDFGHJKLYXCVBNM0123456789',
        num : 0
      }
      var options =  $.extend(defaults, options);
      return this.each(function() {
        var item = $(this);
        var text = item.html().match(/(\<\/?[^>]*\>)|(&\w*;)|(.)/g).reverse();
        console.log(text);
        var characters = options.chars.split('');
        var c = 0, i = 0;
        var interval = parseInt(options.speed/jQuery.fx.interval);
        var steps = text.length;
        var e = new jQuery.fx(this, {});
        e.step = function(gotoEnd) {
          if(++c == interval || gotoEnd){
            this.update();
            c = 0;
            i= text.length;
            steps = (gotoEnd)? 0 : steps;
            var tmp = '';
            while(--i>=((options.num == 0)? 0 : ((steps-options.num >= 0)? steps-options.num : 0))){
              if(i>=steps){
                tmp += text[i];
              }else{
                if(text[i].match(/\W/g)){
                  tmp += text[i]
                }else{
                   tmp += characters[parseInt(Math.random()*characters.length)];
                }
              }
            }          
            item.html(tmp);
            if(--steps<0){
              if(options.complete){
                 options.complete.call(item);
              }
              return false;
            }
          }
          this.update();
          return true;
        }
        e.custom( steps, 0, '');
      });
    }
  });
})(jQuery);