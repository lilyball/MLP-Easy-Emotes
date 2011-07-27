var ponyEmotes = {
    form: null,
    style: "",
    lineOffset: 19,
    
    addGlobalRule : function(css)
    {
      ponyEmotes.style += css + "\n";
    },
    
    injectStyle : function()
    {
      var style, head = document.getElementsByTagName('head')[0];
      if (!head) return;
    
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = ponyEmotes.style;
      head.appendChild(style);
    },
    
    togglePanel : function()
    {
      ponyEmotes.form = document.activeElement;
      var floatingPanel = document.getElementById("floatingPanel");
      if(floatingPanel.getAttribute("class") == "hidden easyEmotes sidebarPanel")
        floatingPanel.setAttribute("class", "easyEmotes sidebarPanel");
      else
        floatingPanel.setAttribute("class", "hidden easyEmotes sidebarPanel");
    },
    
    addEmote : function(event, theForm)
    {
      event.preventDefault();
      var emoteTag = event.target.getAttribute("emote");
      var startSelect = theForm.selectionStart;
      var endSelect = theForm.selectionEnd;
      var oldLength = theForm.value.length;
      
      /* If selected text (for alt text) */
      if(startSelect != endSelect)
      {
        theForm.value = theForm.value.substring(0, startSelect)
        + ((startSelect == 0) ? "" : " ")
        + '[]('
        + emoteTag 
        + ' "' 
        + theForm.value.substring(startSelect, endSelect) 
        + '") '
        + theForm.value.substring(endSelect, oldLength);
      }
      else
      {
        theForm.value = theForm.value.substring(0, startSelect) 
        + ((startSelect == 0) ? "" : " ")
        + "[](" 
        + emoteTag 
        + ") " 
        + theForm.value.substring(startSelect, oldLength);
      }
      
      // Move the cursor to after the emote injection.
      var newPos = endSelect + (theForm.value.length - oldLength);
      theForm.setSelectionRange(newPos, newPos);
      
      //Close the form and toggle focus.
      ponyEmotes.togglePanel();
      theForm.focus();
    },
    
    inject : function()
    {
      var floatingHelper = document.createElement("div");
      floatingHelper.setAttribute("id", "floatingPanelToggle");
      floatingHelper.setAttribute("class", "easyEmotes sidebarToggle");
      floatingHelper.innerHTML = "<h3>Emotes &gt;&gt;</h3>";
      
      document.body.appendChild(floatingHelper);

      var floatingPanel = document.createElement("div");
      floatingPanel.setAttribute("id", "floatingPanel");
      floatingPanel.setAttribute("class", "hidden easyEmotes sidebarPanel");
      
      /* FORMAT FOR ADDING EMOTES */
      /* <a href='/c00' emote='/c00' /><br /> */
      
      floatingPanel.innerHTML = "<span style='text-decoration: underline;'>Click to insert</span><span id='closeEmoteList' style='font-weight: bold; margin-left: 25px;'>X</span><br /><div id='emoteIconList' class='iconList'><a href='/b00' emote='/b00' /><br /><a href='/b10' emote='/b10' /><br /><a href='/b20' emote='/b20' /><br /><a href='/b30' emote='/b30' /><br /><a href='/b01' emote='/b01' /><br /><a href='/b11' emote='/b11' /><br /><a href='/b21' emote='/b21' /><br /><a href='/b31' emote='/b31' /><br /><a href='/b02' emote='/b02' /><br /><a href='/b12' emote='/b12' /><br /><a href='/b22' emote='/b22' /><br /><a href='/b32' emote='/b32' /><br /><a href='/b03' emote='/b03' /><br /><a href='/b13' emote='/b13' /><br /><a href='/b23' emote='/b23' /><br /><a href='/b33' emote='/b33' /><br /><a href='/b04' emote='/b04' /><br /><a href='/b14' emote='/b14' /><br /><a href='/b24' emote='/b24' /><br /><a href='/b34' emote='/b34' /><br /><a href='/b05' emote='/b05' /><br /><a href='/b15' emote='/b15' /><br /><a href='/b25' emote='/b25' /><br /><a href='/b35' emote='/b35' /><br /><a href='/b06' emote='/b06' /><br /><a href='/b16' emote='/b16' /><br /><a href='/b26' emote='/b26' /><br /><a href='/b36' emote='/b36' /><br /><a href='/b07' emote='/b07' /><br /><a href='/b17' emote='/b17' /><br /><a href='/b27' emote='/b27' /><br /><a href='/b37' emote='/b37' /><br /><a href='/b08' emote='/b08' /><br /><a href='/b18' emote='/b18' /><br /><a href='/b28' emote='/b28' /><br /><a href='/b38' emote='/b38' /><br /><a href='/b09' emote='/b09' /><br /><a href='/b19' emote='/b19' /><br /><a href='/b29' emote='/b29' /><br /><a href='/b39' emote='/b39' /><br /><br /><a href='/c00' emote='/c00' /><br /><a href='/c10' emote='/c10' /><br /><a href='/c20' emote='/c20' /><br /><a href='/c01' emote='/c01' /><br /><a href='/c11' emote='/c11' /><br /><a href='/c21' emote='/c21' /><br /><a href='/c02' emote='/c02' /><br /><a href='/c12' emote='/c12' /><br /><a href='/c22' emote='/c22' /><br /><a href='/c03' emote='/c03' /><br /><a href='/c13' emote='/c13' /><br /><a href='/c23' emote='/c23' /><br /><a href='/c04' emote='/c04' /><br /><a href='/c14' emote='/c14' /><br /><a href='/c24' emote='/c24' /><br /><a href='/c05' emote='/c05' /><br /><a href='/c15' emote='/c15' /><br /><a href='/c25' emote='/c25' /><br /><a href='/c06' emote='/c06' /><br /><a href='/c16' emote='/c16' /><br /><a href='/c26' emote='/c26' /><br /><a href='/c07' emote='/c07' /><br /><a href='/c17' emote='/c17' /><br /><a href='/c27' emote='/c27' /><br /><a href='/c08' emote='/c08' /><br /><a href='/c18' emote='/c18' /><br /><a href='/c28' emote='/c28' /><br /><a href='/c09' emote='/c09' /><br /><a href='/c19' emote='/c19' /><br /><a href='/c29' emote='/c29' /><br /></div>"; 
     document.body.appendChild(floatingPanel);
     
     document.getElementById("emoteIconList").addEventListener("click", function(e) { ponyEmotes.addEmote(e, ponyEmotes.form); }, false);
     document.getElementById("closeEmoteList").addEventListener("click", ponyEmotes.togglePanel, false);
     floatingHelper.addEventListener("mouseover", ponyEmotes.togglePanel, false);
    },
    
    init : function()
    {
      if(document.getElementById("RESConsole"))
        ponyEmotes.lineOffset += 8;
      
	  if(document.getElementsByTagName("shinebar").length > 0)
        ponyEmotes.lineOffset = 32;
      
      ponyEmotes.addGlobalRule(".easyEmotes {border: 1px solid #E1B000; background-color: #FFFDCC; top: "+ ponyEmotes.lineOffset +"px; position: fixed;}");
      ponyEmotes.addGlobalRule(".sidebarToggle {z-index: 98 !important;}");
      ponyEmotes.addGlobalRule(".hidden { display: none; }");
      ponyEmotes.addGlobalRule(".iconList { overflow-y: scroll; height: 93%; width: 90%; overflow-x: hidden; }");
      ponyEmotes.addGlobalRule(".sidebarPanel { text-align: center; width: 130px; height: 250px; z-index: 99 !important; }");
      
      ponyEmotes.injectStyle();
      ponyEmotes.inject();
    }
};

ponyEmotes.init();

