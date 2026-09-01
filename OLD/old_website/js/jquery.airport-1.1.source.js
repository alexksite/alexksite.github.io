(function($){ 
     $.fn.extend({  
         airport: function(array) {
			
			var self = $(this);
			var chars = ['a','b','B','C','c','d','e','E','f','g',' ','h','i','j','k','l','m','M','n','o','p','P','q','r','R','s','t','u','v','w','x','y','z','-','а','б','с','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я','1','2','3'];
			var longest = 0;
			var items = items2 = array.length;

			function pad(a,b) { return a + new Array(b - a.length + 1).join(' '); }
			
			$(this).empty();
			
			while(items--)
				if(array[items].length > longest) longest = array[items].length;

			while(items2--)
				array[items2] = pad(array[items2],longest);
				
			spans = longest;
			while(spans--)
				$(this).prepend("<span class='c" + spans + "'></span>");
				
			
			function testChar(a,b,c,d){
				// if we're beyond the number of spans we have, we must be done
		        if (a > longest) return;
				
				if(c >= array.length){
//					setTimeout(function() { testChar(0,0,0,0); }, 1000);
					return;
				}
				else if(d >= longest){
	//				setTimeout(function() { testChar(0,0,c+1,0); }, 1000);
					return;
				}
				else {
					$(self).find('.c'+a).html((chars[b]==" ")?"&nbsp;":chars[b]);
					setTimeout(function() {
						if(b > chars.length){
							testChar(a+1,0,c,d+1);
						//}else if(chars[b] != array[c].substring(d,d+1).toLowerCase()){
						// toLowerCase() is removed to show uppercase characters. All uppercase characters must be added to  'chars' array. 
						}else if(chars[b] != array[c].substring(d,d+1)){
							testChar(a,b+1,c,d);
						}else{
							testChar(a+1,0,c,d+1);
						}
					}, 20);
				}
			}
			
			testChar(0,0,0,0);
        } 
    }); 
})(jQuery);