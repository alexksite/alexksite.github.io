<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page contentType="text/html; charset=UTF-8" %>
		<style type="text/css">
			
			* {
				margin: 0;
			}
		
			html, body {height: 100%;}
			
			#wrap {
				margin:auto;
				min-height: 100%;
			}
			
			#main {overflow:auto;
				padding-bottom: 50px;}  /* must be same height as the footer */
			
			#footer {
				background:	url("/images/bkg-footer1.png") repeat scroll 0 0 transparent;
				position: relative;
				margin-top: -35px; /* negative value of footer height */
				height: 35px;
				width: 950px;
				margin-left: auto;
    			margin-right: auto;
				
				clear:both;
			
			} 
			
			/*Opera Fix*/
			body:before {
				content:"";
				height:100%;
				float:left;
				width:0;
				margin-top:-32767px;/
			}
			

			
			
			
			/* Style */
			/* IE8 hack to get it to apply margin auto centering to element inside this one */
			#wrap {width:950px;}
			
			
			/* Content Area */
#main {
/*	width:945px;*/
	margin:0 auto;
	clear:both;
/*	padding-right:10px;
	padding-left:10px*/
}

#main2 {width:800px;margin:0 auto;clear:both;padding-right:10px;padding-left:10px}

#content {
/*	width:945px;*/
	float:left;
	padding:10px 0 25px 0
}

#content h1 {font-size:1.65em;margin:0;padding:0;color:#3d464f;line-height:1.1em}
#content h2 {font-size:1.2em;margin:15px 0 10px 0;color:#7A0A17}
#content h3 {font-size:1.1em;font-weight:normal;margin:15px 0 10px 0;/*color:#7A0A17*/}

#content pre {font-family:Verdana, Arial, sans-serif;margin:15px 0 15px 0;line-height:0.9em;font-size:0.9em;color:#010ACE}
#content ul {list-style:square;margin:10px 0 10px 20px;list-style-position:inside}
#content li {line-height:1.2em;font-size:0.9em}

#content #list {width:200px;float:left}
#content #screenshots {width:200px;float:right;padding-top:15px}
#content #screenshots p {margin:5px 0 0 0;font-size:0.8em}
			
			






#footer.ftr-notfixed {
    position: relative;
}
ul#footer-leftbtm {
    clear: both;
    padding-left: 10px;
}
ul#footer-lefttop {
    padding-left: 10px;
}
ul#footer-lefttop li, ul#footer-leftbtm li {
    display: inline-block;
    float: left;
    list-style: none outside none;
    padding: 10px 0 2px;
    position: relative;
    width: 90px;
}
ul#footer-lefttop li.short, ul#footer-leftbtm li.short {
    width: 75px;
}
ul#footer-leftbtm li {
    padding: 4px 0 2px;
}
ul#footer-lefttop li a, ul#footer-leftbtm li a {
    display: block;
    float: left;
    font-size: 11px;
    text-decoration: none;
}
ul#footer-lefttop li a {
    color: #FFFFFF;
    font-weight: bold;
}
ul#footer-leftbtm li a {
    color: #BBBBBB;
    font-weight: normal;
}
ul#footer-lefttop li a:hover, ul#footer-leftbtm li a:hover {
    text-decoration: underline;
}
ul#footer-lefttop li#quick-links a {
    background: url("/global/ui/images/ux/icon-quicklinks-caret.png") no-repeat scroll right 2px transparent;
    padding-right: 9px;
}
ul#footer-lefttop li#quick-links a.on, ul#footer-lefttop li#quick-links a:hover {
    background: url("/global/ui/images/ux/icon-quicklinks-caret-on.png") no-repeat scroll right 2px transparent;
}
ul#footer-lefttop li#quick-links {
    cursor: pointer;
    position: relative;
}
ul#footer-lefttop li#quick-links:hover, ul#footer-lefttop li#quick-links.on {
    background: none repeat scroll 0 0 #FFFFFF;
}
ul#footer-lefttop li#quick-links:hover a, ul#footer-lefttop li#quick-links.on a {
    color: #666666;
    text-decoration: none;
}
ul#footer-lefttop li#quick-links ul {
    background: none repeat scroll 0 0 #FFFFFF;
    bottom: 26px;
    cursor: pointer;
    display: none;
    left: 0;
    padding: 3px;
    position: absolute;
    width: 289px;
}
ul#footer-lefttop li#quick-links ul li {
    border-top: 1px solid #DEDEDC;
    display: block;
    float: none;
    margin: 0 2px;
    padding: 1px 0;
    width: 98%;
}
ul#footer-lefttop li#quick-links ul a {
    color: #0165B1;
    display: block;
    float: none;
    margin: 0;
    padding: 4px 0 4px 7px;
    width: 276px;
}
ul#footer-lefttop li#quick-links ul a:hover {
    background: none repeat scroll 0 0 #FBEABF;
    color: #0165B1;
    text-decoration: underline;
}
#footerlink-communities.on {
    background: none repeat scroll 0 0 #00A2DE;
}
#footer-right {
    display: block;
    position: absolute;
    right: 10px;
    text-align: right;
    top: 10px;
}
#footer-right h3 {
    color: #FFFFFF;
    float: right;
    font-size: 13px;
    font-weight: bold;
    line-height: 16px;
}
#footer-right h3 a {
    display: block;
    float: left;
    height: 20px;
    text-decoration: none;
}
#footer-right a#social-network {
    background: url("images/footer/icon-social-network.png") no-repeat scroll left top transparent;
    color: #FFFFFF;
    display: block;
    font-weight: bold;
    line-height: 24px;
    text-decoration: none;
    width: 157px;
    font-size:12px;
}
#footer-right h3 span {
    padding-left: 10px;
}
#footer-right ul {
    float: right;
}
#footer-right ul li {
    display: inline-block;
    float: left;
    height: 16px;
    margin-right: 4px;
    width: 16px;
}
#footer-right ul li a {
    display: block;
    float: left;
    height: 20px;
    width: 16px;
}
#footer-right ul a span {
    display: none;
}			
						<!--[if !IE 7]>
				<style type="text/css">
					#wrap {display:table;height:100%}
				</style>
			<![endif]-->
			
			
			

		</style>
			
		
		</div> <!-- content -->
		</div> <!-- main -->
		</div><!-- wrap -->

		<div id="footer">
			<!-- p style="color:white;margin-left:20px;">Copyright &copy; 2013 Alexander Koziy </p-->
		<!-- ul id="footer-lefttop">
        
                <li  class="short"><a href="/sitemap.epx" onclick="TrackLink('http%3a%2f%2fwww.sap.com%2findex.epx','Site Map','ClickArea=footer')" >Home</a></li>
                

				<li  ><a href="http://www54.sap.com/directory/main.html"  onclick="TrackLink('http%3a%2f%2fwww.sap.com%2findex.epx','SAP Offices','ClickArea=footer')"  >About</a></li>		
				
				<li  class="w90"><a href="/corporate-en/investors/index.epx"  onclick="TrackLink('http%3a%2f%2fwww.sap.com%2findex.epx','investors','ClickArea=footer')"  target="_blank">Portfolio</a></li>		
				
			
				<li  class="short"><a href="/corporate-en/press/index.epx"  onclick="TrackLink('http%3a%2f%2fwww.sap.com%2findex.epx','press','ClickArea=footer')"  target="_blank">Services</a></li>
				
				<li  class="short"><a href="http://www.careersatsap.com/"  onclick="TrackLink('http%3a%2f%2fwww.sap.com%2findex.epx','careers','ClickArea=footer')"  target="_blank">Contact</a></li>
										
			</ul-->
			
			<!-- ul id="footer-leftbtm">
				
				<li class="short" ><a href="/corporate-en/using-sap-com/index.epx"  target="_blank" >Using SAP</a></li>
				<li class="w100" ><a href="/corporate-en/our-company/legal/privacy.epx"  target="_blank" >Privacy</a></li>
				<li ><a href="/corporate-en/our-company/legal/terms_of_use.epx"  target="_blank">Terms of Use</a></li>
				<li ><a href="/about-sap/company/legal/impressum_USA.epx"  target="_blank">Legal Disclosure</a></li>				
				
				<li class="short" ><a href="/corporate-en/our-company/legal/copyright/index.epx"  target="_blank" >Copyright</a></li>
				
				<li class="short" ><a href="/corporate-en/legal/copyright/index.epx#trademark"  target="_blank" >Trademark</a></li>
				
				<li class="w75"><a href="" id="footer-textview" >Text View</a></li>				
				
				<li class="short" ><a href=""   >Print View</a></li>
			</ul-->
			
			<div id="footer-right">
				<!-- a href="http://www54.sap.com/communities/hub.html" id="social-network"  onclick="TrackLink('http%3a%2f%2fwww.sap.com%2findex.epx','Follow SAP','ClickArea=footer')" > Follow SAP </a -->
				<%
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				Date today = new Date();
				String year = sdf.format(today);
				%>
				
				<span style="color:#BBBBBB;font-family: 'Lucida Grande',Geneva,Arial,Verdana,sans-serif;font-size:11px;">Александр Козий &copy; <%=year %></span>
			</div>
		</div>


<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-52763100-1', 'auto');
  ga('send', 'pageview');

</script>
	</body>
</html>