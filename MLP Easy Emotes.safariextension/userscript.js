// ==UserScript==
// @name           MLP Easy Emotes
// @namespace      http://www.reddit.com/r/mylittlepony/
// @description    Allows you to use the emoticons from /r/MyLittlePony quickly and easily. 
// @homepage       http://redd.it/iqces
// @author         RogueDarkJedi
// @version        3.0
// @include        http://www.reddit.com/r/mylittlepony/comments/*
// @include        http://www.reddit.com/r/clopclop/comments/*
// @include        http://www.reddit.com/r/mylittlenosleep/comments/*
// @include        http://www.reddit.com/r/mylittlerepost/comments/*
// @include        http://www.reddit.com/r/MLPdrawingschool/comments/*
// @include        http://www.reddit.com/r/parasprites/comments/*

// @icon           http://i.imgur.com/WrtvH.png
// @iconURL        http://i.imgur.com/WrtvH.png
// ==/UserScript==

// Thanks to derram for contributing our icon!

var ponyEmotes = {
    form: null,
    style: "",
    isOpen: false,
    prefs: {
      useMRP: false,
      mouseOutEnabled: false,
      lineOffset: 19,
      zIndex: 99,
      height: 250,
      width: 130,
    },
    
    addGlobalRule : function(css)
    {
      ponyEmotes.style += css + "\n";
    },
    
    injectStyle : function()
    {
      var style, head = document.getElementsByTagName('head')[0];
      if (!head) return;
    
      style = document.createElement('style');
      style.setAttribute('id', 'easyEmotesStyle');
      style.setAttribute('type', 'text/css');
      style.innerHTML = ponyEmotes.style;
      head.appendChild(style);
    },
    
    togglePanel : function()
    {
      ponyEmotes.form = document.activeElement;
      var easyEmotesPanel = document.getElementById("easyEmotesPanel");
      ponyEmotes.isOpen = (easyEmotesPanel.getAttribute("class") == "hidePanel easyEmotes emotesPanel");
      if(ponyEmotes.isOpen)
        easyEmotesPanel.setAttribute("class", "easyEmotes emotesPanel");
      else
        easyEmotesPanel.setAttribute("class", "hidePanel easyEmotes emotesPanel");
    },
    
    mouseOutHide : function(event)
    {
      event.stopPropagation();
      event.cancelBubble = true;
      if(ponyEmotes.isOpen == false || (event.relatedTarget == null || event.relatedTarget.parentNode.id == "emoteIconList" || event.relatedTarget.parentNode.id == "easyEmotesPanel" || event.relatedTarget.id == "easyEmotesPanel"))
        return;
    
      ponyEmotes.togglePanel();
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
      floatingHelper.setAttribute("id", "easyEmotesToggle");
      floatingHelper.setAttribute("class", "easyEmotes emotesToggle");
      floatingHelper.innerHTML = "<h3 class='emotesText'>Emotes &gt;&gt;</h3>";
      
      document.body.appendChild(floatingHelper);

      var easyEmotesPanel = document.createElement("div");
      easyEmotesPanel.setAttribute("id", "easyEmotesPanel");
      easyEmotesPanel.setAttribute("class", "hidePanel easyEmotes emotesPanel");
      
      easyEmotesPanel.innerHTML = "<span style='text-decoration: underline;'>Click to insert</span><span id='closeEmoteList'>X</span><br /><div id='emoteIconList' class='iconList'><a href='/b00' emote='/b00' /><br /><a href='/b10' emote='/b10' /><br /><a href='/b20' emote='/b20' /><br /><a href='/b30' emote='/b30' /><br /><a href='/b01' emote='/b01' /><br /><a href='/b11' emote='/b11' /><br /><a href='/b21' emote='/b21' /><br /><a href='/b31' emote='/b31' /><br /><a href='/b02' emote='/b02' /><br /><a href='/b12' emote='/b12' /><br /><a href='/b22' emote='/b22' /><br /><a href='/b32' emote='/b32' /><br /><a href='/b03' emote='/b03' /><br /><a href='/b13' emote='/b13' /><br /><a href='/b23' emote='/b23' /><br /><a href='/b33' emote='/b33' /><br /><a href='/b04' emote='/b04' /><br /><a href='/b14' emote='/b14' /><br /><a href='/b24' emote='/b24' /><br /><a href='/b34' emote='/b34' /><br /><a href='/b05' emote='/b05' /><br /><a href='/b15' emote='/b15' /><br /><a href='/b25' emote='/b25' /><br /><a href='/b35' emote='/b35' /><br /><a href='/b06' emote='/b06' /><br /><a href='/b16' emote='/b16' /><br /><a href='/b26' emote='/b26' /><br /><a href='/b36' emote='/b36' /><br /><a href='/b07' emote='/b07' /><br /><a href='/b17' emote='/b17' /><br /><a href='/b27' emote='/b27' /><br /><a href='/b37' emote='/b37' /><br /><a href='/b08' emote='/b08' /><br /><a href='/b18' emote='/b18' /><br /><a href='/b28' emote='/b28' /><br /><a href='/b38' emote='/b38' /><br /><a href='/b09' emote='/b09' /><br /><a href='/b19' emote='/b19' /><br /><a href='/b29' emote='/b29' /><br /><a href='/b39' emote='/b39' /><br /><br /><a href='/c00' emote='/c00' /><br /><a href='/c10' emote='/c10' /><br /><a href='/c20' emote='/c20' /><br /><a href='/c01' emote='/c01' /><br /><a href='/c11' emote='/c11' /><br /><a href='/c21' emote='/c21' /><br /><a href='/c02' emote='/c02' /><br /><a href='/c12' emote='/c12' /><br /><a href='/c22' emote='/c22' /><br /><a href='/c03' emote='/c03' /><br /><a href='/c13' emote='/c13' /><br /><a href='/c23' emote='/c23' /><br /><a href='/c04' emote='/c04' /><br /><a href='/c14' emote='/c14' /><br /><a href='/c24' emote='/c24' /><br /><a href='/c05' emote='/c05' /><br /><a href='/c15' emote='/c15' /><br /><a href='/c25' emote='/c25' /><br /><a href='/c06' emote='/c06' /><br /><a href='/c16' emote='/c16' /><br /><a href='/c26' emote='/c26' /><br /><a href='/c07' emote='/c07' /><br /><a href='/c17' emote='/c17' /><br /><a href='/c27' emote='/c27' /><br /><a href='/c08' emote='/c08' /><br /><a href='/c18' emote='/c18' /><br /><a href='/c28' emote='/c28' /><br /><a href='/c09' emote='/c09' /><br /><a href='/c19' emote='/c19' /><br /><a href='/c29' emote='/c29' /><br /></div>"; 
      
      document.body.appendChild(easyEmotesPanel);
      
      document.getElementById("emoteIconList").addEventListener("click", function(e) { ponyEmotes.addEmote(e, ponyEmotes.form); }, false);
      document.getElementById("closeEmoteList").addEventListener("click", ponyEmotes.togglePanel, false);
      floatingHelper.addEventListener("mouseover", ponyEmotes.togglePanel, false);
      
      if(ponyEmotes.prefs.mouseOutEnabled == true)
        easyEmotesPanel.addEventListener("mouseout", ponyEmotes.mouseOutHide, false);
    },
    
    removePrevious : function()
    {
      var toggler = document.getElementById("easyEmotesToggle"), sidePanel = document.getElementById("easyEmotesPanel"), 
      styleRules = document.getElementById("easyEmotesStyle"), head = document.getElementsByTagName('head')[0];
      if(toggler)
        document.body.removeChild(toggler);
      
      if(sidePanel)
        document.body.removeChild(sidePanel);
        
      if(styleRules && head)
        head.removeChild(styleRules);
    },
    init : function()
    {
      // Remove previous injection if any.
      ponyEmotes.removePrevious();
      
      if(ponyEmotes.prefs.lineOffset == 19)
      {
        if(document.getElementById("RESConsole"))
          ponyEmotes.prefs.lineOffset += 8;
      
        if(document.getElementsByTagName("shinebar").length > 0)
          ponyEmotes.prefs.lineOffset = 35;
      }
      
      ponyEmotes.style = "";
      ponyEmotes.addGlobalRule(".easyEmotes {border: 1px solid #E1B000; background-color: #FFFDCC; top: "+ ponyEmotes.prefs.lineOffset +"px; position: fixed;}");
      ponyEmotes.addGlobalRule(".emotesToggle {height: 20px; z-index: "+ (ponyEmotes.prefs.zIndex - 1) +" !important;}");
      ponyEmotes.addGlobalRule("#closeEmoteList {font-weight: bold; margin-left: 10%;}");
      ponyEmotes.addGlobalRule(".emotesText {margin-top: 3px; }");
      ponyEmotes.addGlobalRule(".hidePanel { display: none !important; }");
      ponyEmotes.addGlobalRule(".iconList { overflow-y: scroll; height: 93%; width: 94%; overflow-x: hidden; }");
      ponyEmotes.addGlobalRule(".emotesPanel { text-align: center; width: "+ ponyEmotes.prefs.width +"px; height: "+ ponyEmotes.prefs.height +"px; z-index: "+ ponyEmotes.prefs.zIndex +" !important; }");
      
      if(ponyEmotes.prefs.useMRP == true)
        ponyEmotes.addGlobalRule('a[href="/b00"], a[href="/b01"], a[href="/b02"], a[href="/b03"], a[href="/b04"], a[href="/b05"], a[href="/b06"], a[href="/b07"], a[href="/b08"], a[href="/b09"], a[href="/b10"], a[href="/b11"], a[href="/b12"], a[href="/b13"], a[href="/b14"], a[href="/b15"], a[href="/b16"], a[href="/b17"], a[href="/b18"], a[href="/b19"], a[href="/b20"], a[href="/b21"], a[href="/b22"], a[href="/b23"], a[href="/b24"], a[href="/b25"], a[href="/b26"], a[href="/b27"], a[href="/b28"], a[href="/b29"], a[href="/b30"], a[href="/b31"], a[href="/b32"], a[href="/b33"], a[href="/b34"], a[href="/b35"], a[href="/b36"], a[href="/b37"], a[href="/b38"], a[href="/b39"] { display: block; clear: none; float: left; width: 50px; height: 50px; background-image: url(http://thumbs.reddit.com/t5_2s8bl_1.png?v=easyEmotes) !important; } a[href="/b00"] { background-position: -0px -0px; } a[href="/b01"] { background-position: -0px -50px; } a[href="/b02"] { background-position: -0px -100px; } a[href="/b03"] { background-position: -0px -150px; } a[href="/b04"] { background-position: -0px -200px; } a[href="/b05"] { background-position: -0px -250px; } a[href="/b06"] { background-position: -0px -300px; } a[href="/b07"] { background-position: -0px -350px; } a[href="/b08"] { background-position: -0px -400px; } a[href="/b09"] { background-position: -0px -450px; } a[href="/b10"] { background-position: -50px -0px; } a[href="/b11"] { background-position: -50px -50px; } a[href="/b12"] { background-position: -50px -100px; } a[href="/b13"] { background-position: -50px -150px } a[href="/b14"] { background-position: -50px -200px; } a[href="/b15"] { background-position: -50px -250px; } a[href="/b16"] { background-position: -50px -300px; } a[href="/b17"] { background-position: -50px -350px; } a[href="/b18"] { background-position: -50px -400px; } a[href="/b19"] { background-position: -50px -450px; } a[href="/b20"] { background-position: -100px -0px; } a[href="/b21"] { background-position: -100px -50px; } a[href="/b22"] { background-position: -100px -100px; } a[href="/b23"] { background-position: -100px -150px; } a[href="/b24"] { background-position: -100px -200px; } a[href="/b25"] { background-position: -100px -250px; } a[href="/b26"] { background-position: -100px -300px; } a[href="/b27"] { background-position: -100px -350px; } a[href="/b28"] { background-position: -100px -400px; } a[href="/b29"] { background-position: -100px -450px; } a[href="/b30"] { background-position: -150px -0px; } a[href="/b31"] { background-position: -150px -50px; } a[href="/b32"] { background-position: -150px -100px; } a[href="/b33"] { background-position: -150px -150px; } a[href="/b34"] { background-position: -150px -200px; } a[href="/b35"] { background-position: -150px -250px; } a[href="/b36"] { background-position: -150px -300px; } a[href="/b37"] { background-position: -150px -350px; } a[href="/b38"] { background-position: -150px -400px; } a[href="/b39"] { background-position: -150px -450px; } a[href="/c00"], a[href="/c01"], a[href="/c02"], a[href="/c03"], a[href="/c04"], a[href="/c05"], a[href="/c06"], a[href="/c07"], a[href="/c08"], a[href="/c09"], a[href="/c10"], a[href="/c11"], a[href="/c12"], a[href="/c13"], a[href="/c14"], a[href="/c15"], a[href="/c16"], a[href="/c17"], a[href="/c18"], a[href="/c19"], a[href="/c20"], a[href="/c21"], a[href="/c22"], a[href="/c23"], a[href="/c24"], a[href="/c25"], a[href="/c26"], a[href="/c27"], a[href="/c28"], a[href="/c29"] { display: block; clear: none; float: left; width: 70px; height: 70px; background-image: url(http://thumbs.reddit.com/t5_2s8bl_6.png?v=easyEmotes) !important; } a[href="/c00"] { background-position: -0px -0px; } a[href="/c01"] { background-position: -0px -70px; } a[href="/c02"] { background-position: -0px -140px; } a[href="/c03"] { background-position: -0px -210px; } a[href="/c04"] { background-position: -0px -280px; } a[href="/c05"] { background-position: -0px -350px; } a[href="/c06"] { background-position: -0px -420px; } a[href="/c07"] { background-position: -0px -490px; } a[href="/c08"] { background-position: -0px -560px; } a[href="/c09"] { background-position: -0px -630px; } a[href="/c10"] { background-position: -70px -0px; } a[href="/c11"] { background-position: -70px -70px; } a[href="/c12"] { background-position: -70px -140px; } a[href="/c13"] { background-position: -70px -210px; } a[href="/c14"] { background-position: -70px -280px; } a[href="/c15"] { background-position: -70px -350px; } a[href="/c16"] { background-position: -70px -420px; } a[href="/c17"] { background-position: -70px -490px; } a[href="/c18"] { background-position: -70px -560px; } a[href="/c19"] { background-position: -70px -630px; } a[href="/c20"] { background-position: -140px -0px; } a[href="/c21"] { background-position: -140px -70px; } a[href="/c22"] { background-position: -140px -140px; } a[href="/c23"] { background-position: -140px -210px; } a[href="/c24"] { background-position: -140px -280px; } a[href="/c25"] { background-position: -140px -350px; } a[href="/c26"] { background-position: -140px -420px; } a[href="/c27"] { background-position: -140px -490px; } a[href="/c28"] { background-position: -140px -560px; } a[href="/c29"] { background-position: -140px -630px; }');
      
      ponyEmotes.injectStyle();
      ponyEmotes.inject();
    }
};

if (window.safari !== void 0 && window.SafariContentNamespace !== void 0 && safari instanceof SafariContentNamespace) { safari.self.addEventListener('message', function(event) { if (event.name === "preferences") { for (var key in event.message) { if (event.message.hasOwnProperty(key)) { ponyEmotes.prefs[key] = event.message[key]; } } ponyEmotes.init(); } }, false); safari.self.tab.dispatchMessage('getPreferences'); } else { ponyEmotes.init(); } 
