// ==UserScript==
// @name           MLP Easy Emotes
// @namespace      http://www.reddit.com/r/mylittlepony/
// @description    Allows you to use the emoticons from /r/MyLittlePony quickly and easily. 
// @homepage       http://redd.it/iqces
// @author         RogueDarkJedi
// @version        8.0
// @include        http://www.reddit.com/r/mylittlepony/comments/*
// @include        http://www.reddit.com/r/clopclop/comments/*
// @include        http://www.reddit.com/r/mylittlenosleep/comments/*
// @include        http://www.reddit.com/r/mylittlerepost/comments/*
// @include        http://www.reddit.com/r/MLPdrawingschool/comments/*
// @include        http://www.reddit.com/r/parasprites/comments/*
// @include        http://www.reddit.com/r/mylittlerage/comments/*
// @include        http://www.reddit.com/r/ainbowdash/comments/*
// @include        http://www.reddit.com/r/idliketobeatree/comments/*
// @include        http://www.reddit.com/r/mylittleWTF/comments/*
// @include        http://www.reddit.com/r/Fluttershy/comments/*
// @include        http://www.reddit.com/r/Applejack/comments/*
// @include        http://www.reddit.com/r/ponypapers/comments/*
// @include        http://www.reddit.com/r/MLPtunes/comments/*
// @include        http://www.reddit.com/r/newlunarrepublic/comments/*
// @include        http://www.reddit.com/r/mylittleponyproblems/comments/*
// @include        http://www.reddit.com/r/mylittle3dpony/comments/*
// @include        http://www.reddit.com/r/educationalponies/comments/*
// @include        http://www.reddit.com/r/mylittleportals/comments/*
// @include        http://www.reddit.com/r/mylittlefortress/comments/*
// @include        http://www.reddit.com/r/mylittlefanfic/comments/*
// @include        http://www.reddit.com/r/mylittleminecraft/comments/*
// @include        http://www.reddit.com/r/mylittledaww/comments/*
// @include        http://www.reddit.com/r/MLPLounge/comments/*

// @exclude        http://www.redditmedia.com/*
// @icon           http://i.imgur.com/WrtvH.png
// @iconURL        http://i.imgur.com/WrtvH.png
// @grant          none
// ==/UserScript==

// Thanks to derram for contributing our icon!

//It doesn't work? DURRR it's because we redefine ourselves. HURRR
//Thx to eridius for pointing out that Safari/Opera does not wrap userscripts into functions like Chrome and Fx do
if(window.top === window)
{
  var ponyEmotes = {
      form: null,
      style: "",
      isOpen: false,
      prefs: {
        useMRP: false,
        mouseOutEnabled: false,
        lineOffset: 19,
        ignoreLogin: false,
        zIndex: 99,
        height: 250,
        width: 175,
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
      addUpdateInfo : function()
      {
        if(!document.getElementById("rdjScripts"))
        {
          var scriptBlock = document.createElement("DIV");
          scriptBlock.setAttribute("id", "rdjScripts");
          scriptBlock.setAttribute("style", "display:none !important");
          document.body.appendChild(scriptBlock);
        }
        var scriptInfoBlock = document.getElementById("rdjScripts");
        if(!document.getElementById("easyemotes-info"))
        {
          var infoBlock = document.createElement("DIV");
          infoBlock.setAttribute("id", "easyemotes-info");
          infoBlock.setAttribute("name", "easyemotes");
          infoBlock.setAttribute("version", "8.0");
          infoBlock.setAttribute("config", "auto=1&safariInit=on&vertOffset=&width=&height=&shouldGen=true&generate=mlpeasyemotes.user.js");
          
          scriptInfoBlock.appendChild(infoBlock);
        }
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
        
        emoteTag = (event.altKey || event.ctrlKey) ? ("r" + emoteTag) : emoteTag;
        
        /* If selected text (for alt text) */
        if(startSelect != endSelect)
        {
          theForm.value = theForm.value.substring(0, startSelect)
          + ((startSelect == 0) ? "" : " ")
          + '[](/'
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
          + "[](/" 
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
        
        easyEmotesPanel.innerHTML = "<span style='text-decoration: underline;'>Click to insert</span><span id='closeEmoteList'>X</span><br /><div id='emoteIconList' class='iconList'><a href='/b00' emote='b00' /><br /><a href='/b10' emote='b10' /><br /><a href='/b20' emote='b20' /><br /><a href='/b30' emote='b30' /><br /><a href='/b01' emote='b01' /><br /><a href='/b11' emote='b11' /><br /><a href='/b21' emote='b21' /><br /><a href='/b31' emote='b31' /><br /><a href='/b02' emote='b02' /><br /><a href='/b12' emote='b12' /><br /><a href='/b22' emote='b22' /><br /><a href='/b32' emote='b32' /><br /><a href='/b03' emote='b03' /><br /><a href='/b13' emote='b13' /><br /><a href='/b23' emote='b23' /><br /><a href='/b33' emote='b33' /><br /><a href='/b04' emote='b04' /><br /><a href='/b14' emote='b14' /><br /><a href='/b24' emote='b24' /><br /><a href='/b34' emote='b34' /><br /><a href='/b05' emote='b05' /><br /><a href='/b15' emote='b15' /><br /><a href='/b25' emote='b25' /><br /><a href='/b35' emote='b35' /><br /><a href='/b06' emote='b06' /><br /><a href='/b16' emote='b16' /><br /><a href='/b26' emote='b26' /><br /><a href='/b36' emote='b36' /><br /><a href='/b07' emote='b07' /><br /><a href='/b17' emote='b17' /><br /><a href='/b27' emote='b27' /><br /><a href='/b37' emote='b37' /><br /><a href='/b08' emote='b08' /><br /><a href='/b18' emote='b18' /><br /><a href='/b28' emote='b28' /><br /><a href='/b38' emote='b38' /><br /><a href='/b09' emote='b09' /><br /><a href='/b19' emote='b19' /><br /><a href='/b29' emote='b29' /><br /><a href='/b39' emote='b39' /><br /><a href='/c00' emote='c00' /><br /><a href='/c10' emote='c10' /><br /><a href='/c20' emote='c20' /><br /><a href='/c01' emote='c01' /><br /><a href='/c11' emote='c11' /><br /><a href='/c21' emote='c21' /><br /><a href='/c02' emote='c02' /><br /><a href='/c12' emote='c12' /><br /><a href='/c22' emote='c22' /><br /><a href='/c03' emote='c03' /><br /><a href='/c13' emote='c13' /><br /><a href='/c23' emote='c23' /><br /><a href='/c04' emote='c04' /><br /><a href='/c14' emote='c14' /><br /><a href='/c24' emote='c24' /><br /><a href='/c05' emote='c05' /><br /><a href='/c15' emote='c15' /><br /><a href='/c25' emote='c25' /><br /><a href='/c06' emote='c06' /><br /><a href='/c16' emote='c16' /><br /><a href='/c26' emote='c26' /><br /><a href='/c07' emote='c07' /><br /><a href='/c17' emote='c17' /><br /><a href='/c27' emote='c27' /><br /><a href='/c08' emote='c08' /><br /><a href='/c18' emote='c18' /><br /><a href='/c28' emote='c28' /><br /><a href='/c09' emote='c09' /><br /><a href='/c19' emote='c19' /><br /><a href='/c29' emote='c29' /><br /><a href='/a24' emote='a24' /><br /><a href='/a04' emote='a04' /><br /><a href='/a14' emote='a14' /><br /><a href='/a34' emote='a34' /><br /><a href='/a00' emote='a00' /><br /><a href='/a10' emote='a10' /><br /><a href='/a20' emote='a20' /><br /><a href='/a30' emote='a30' /><br /><a href='/a01' emote='a01' /><br /><a href='/a11' emote='a11' /><br /><a href='/a21' emote='a21' /><br /><a href='/a31' emote='a31' /><br /><a href='/a02' emote='a02' /><br /><a href='/a12' emote='a12' /><br /><a href='/a22' emote='a22' /><br /><a href='/a32' emote='a32' /><br /><a href='/a05' emote='a05' /><br /><a href='/a15' emote='a15' /><br /><a href='/a25' emote='a25' /><br /><a href='/a35' emote='a35' /><br /><a href='/a03' emote='a03' /><br /><a href='/a13' emote='a13' /><br /><a href='/a23' emote='a23' /><br /><a href='/a33' emote='a33' /><br /><a href='/a06' emote='a06' /><br /><a href='/a16' emote='a16' /><br /><a href='/a26' emote='a26' /><br /><a href='/a07' emote='a07' /><br /><a href='/a17' emote='a17' /><br /><a href='/a27' emote='a27' /><br /><a href='/a08' emote='a08' /><br /><a href='/a18' emote='a18' /><br /><a href='/a28' emote='a28' /><br /><a href='/a09' emote='a09' /><br /><a href='/a19' emote='a19' /><br /><a href='/a29' emote='a29' /><br /><a href='/e00' emote='e00' /><br /><a href='/e10' emote='e10' /><br /><a href='/e20' emote='e20' /><br /><a href='/e01' emote='e01' /><br /><a href='/e11' emote='e11' /><br /><a href='/e21' emote='e21' /><br /><a href='/e02' emote='e02' /><br /><a href='/e12' emote='e12' /><br /><a href='/e22' emote='e22' /><br /><a href='/e03' emote='e03' /><br /><a href='/e13' emote='e13' /><br /><a href='/e23' emote='e23' /><br /><a href='/e04' emote='e04' /><br /><a href='/e14' emote='e14' /><br /><a href='/e24' emote='e24' /><br /><a href='/e05' emote='e05' /><br /><a href='/e15' emote='e15' /><br /><a href='/e25' emote='e25' /><br /><a href='/e06' emote='e06' /><br /><a href='/e16' emote='e16' /><br /><a href='/e26' emote='e26' /><br /><a href='/e07' emote='e07' /><br /><a href='/e17' emote='e17' /><br /><a href='/e27' emote='e27' /><br /><a href='/e08' emote='e08' /><br /><a href='/e18' emote='e18' /><br /><a href='/e28' emote='e28' /><br /><a href='/e09' emote='e09' /><br /><a href='/e19' emote='e19' /><br /><a href='/e29' emote='e29' /><br /><a href='/sbf' emote='sbf' /><br /></div>";
        
        document.body.appendChild(easyEmotesPanel);
        
        document.getElementById("emoteIconList").addEventListener("click", function(e) { ponyEmotes.addEmote(e, ponyEmotes.form); }, false);
        document.getElementById("closeEmoteList").addEventListener("click", ponyEmotes.togglePanel, false);
        floatingHelper.addEventListener("mouseover", ponyEmotes.togglePanel, false);
        
        if(ponyEmotes.prefs.mouseOutEnabled == true)
          easyEmotesPanel.addEventListener("mouseout", ponyEmotes.mouseOutHide, false);
      },
      
      removePrevious : function()
      {
        ponyEmotes.style = "";
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
        
        ponyEmotes.addGlobalRule(".easyEmotes {border: 1px solid #E1B000; background-color: #FFFDCC; top: "+ ponyEmotes.prefs.lineOffset +"px; position: fixed;}");
        ponyEmotes.addGlobalRule(".emotesToggle {width: auto !important; height: 20px; z-index: "+ (ponyEmotes.prefs.zIndex - 1) +" !important;}");
        ponyEmotes.addGlobalRule("#closeEmoteList {float: right;font-weight: bold; padding-right: 3%;}");
        ponyEmotes.addGlobalRule(".emotesText {margin-top: 3px; color:black !important; font-size: 110% !important;}");
        ponyEmotes.addGlobalRule(".hidePanel { display: none !important; }");
        ponyEmotes.addGlobalRule(".iconList { overflow-y: scroll; height: 93%; width: 94%; overflow-x: hidden; }");
        ponyEmotes.addGlobalRule(".iconList a { cursor: pointer !important; }");
        ponyEmotes.addGlobalRule(".emotesPanel { text-align: center; width: "+ ponyEmotes.prefs.width +"px; height: "+ ponyEmotes.prefs.height +"px; z-index: "+ ponyEmotes.prefs.zIndex +" !important; }");
        
        if(ponyEmotes.prefs.useMRP == true)
        {
          /* Emote block */
          ponyEmotes.addGlobalRule('a[href|="/swagintosh"],a[href|="/a24"],a[href|="/rswagintosh"],a[href|="/ra24"]{display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://b.thumbs.redditmedia.com/Kt_jbvLW92C9Fdqg.png)}a[href|="/rswagintosh"],a[href|="/ra24"]{background-position:-0px -70px}a[href|="/a00"],a[href|="/ajlie"],a[href|="/a01"],a[href|="/a10"],a[href|="/a11"],a[href|="/a21"],a[href|="/priceless"],a[href|="/a20"],a[href|="/flutterjerk"],a[href|="/celestiamad"],a[href|="/twicrazy"],a[href|="/twipride"],a[href|="/lunateehee"],a[href|="/lunawait"],a[href|="/a02"],a[href|="/a12"],a[href|="/a22"],a[href|="/a04"],a[href|="/a14"],a[href|="/a05"],a[href|="/a15"],a[href|="/paperbagderpy"],a[href|="/paperbagwizard"],a[href|="/derpwizard"],a[href|="/a03"],a[href|="/ajhappy"],a[href|="/happlejack"],a[href|="/a13"],a[href|="/ppfear"],a[href|="/pinkiefear"],a[href|="/a23"],a[href|="/twibeam"],a[href|="/raritydaww"],a[href|="/scootacheer"],a[href|="/lootascoo"],a[href|="/ajsup"],a[href|="/ajwhatsgood"],a[href|="/flutterwhoa"],a[href|="/flutterwoah"],a[href|="/a25"],a[href|="/rdcry"],a[href|="/a06"],a[href|="/ohcomeon"],a[href|="/sbcomeon"],a[href|="/ppcute"],a[href|="/cutiepie"],a[href|="/a16"],a[href|="/a26"],a[href|="/abbored"],a[href|="/abmerp"],a[href|="/a07"],a[href|="/raritypaper"],a[href|="/raritynews"],a[href|="/a17"],a[href|="/sbbook"],a[href|="/sweetiebook"],a[href|="/sbook"],a[href|="/a27"],a[href|="/scootaplease"],a[href|="/scootappeal"],a[href|="/scootaplz"],a[href|="/a08"],a[href|="/twiright"],a[href|="/satistwied"],a[href|="/a18"],a[href|="/celestiawut"],a[href|="/wutlestia"],a[href|="/a28"],a[href|="/grannysmith"],a[href|="/granny"],a[href|="/oldmareyellsatcloud"],a[href|="/a09"],a[href|="/shiningarmor"],a[href|="/shiningarmour"],a[href|="/a19"],a[href|="/chrysalis"],a[href|="/queenchrysalis"],a[href|="/changelingqueen"],a[href|="/a29"],a[href|="/cadence"],a[href|="/cadance"],a[href|="/princesscadence"],a[href|="/princesscadance"],a[href|="/princessmiamorecadenza"],a[href|="/a30"],a[href|="/flutterroll"],a[href|="/a31"],a[href|="/spikemeh"],a[href|="/a32"],a[href|="/abmeh"],a[href|="/a33"],a[href|="/scootaderp"],a[href|="/didneyworl"],a[href|="/DIDNEYWORL"],a[href|="/a34"],a[href|="/pinkieawe"],a[href|="/ppawe"],a[href|="/areyouawizard"],a[href|="/a35"],a[href|="/silverspoon"],a[href|="/sspout"]{display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://a.thumbs.redditmedia.com/mSf8dSjbL0eTzDg0.png)}a[href|="/ra00"],a[href|="/rajlie"],a[href|="/ra01"],a[href|="/ra10"],a[href|="/ra11"],a[href|="/ra21"],a[href|="/rpriceless"],a[href|="/ra20"],a[href|="/rflutterjerk"],a[href|="/rcelestiamad"],a[href|="/rtwicrazy"],a[href|="/rtwipride"],a[href|="/rlunateehee"],a[href|="/rlunawait"],a[href|="/ra02"],a[href|="/ra12"],a[href|="/ra22"],a[href|="/ra04"],a[href|="/ra14"],a[href|="/ra05"],a[href|="/ra15"],a[href|="/rpaperbagderpy"],a[href|="/rpaperbagwizard"],a[href|="/rderpwizard"],a[href|="/ra03"],a[href|="/rajhappy"],a[href|="/rhapplejack"],a[href|="/ra13"],a[href|="/rppfear"],a[href|="/rpinkiefear"],a[href|="/ra23"],a[href|="/rtwibeam"],a[href|="/rraritydaww"],a[href|="/rscootacheer"],a[href|="/rlootascoo"],a[href|="/rajsup"],a[href|="/rajwhatsgood"],a[href|="/rflutterwhoa"],a[href|="/rflutterwoah"],a[href|="/ra25"],a[href|="/rrdcry"],a[href|="/ra06"],a[href|="/rohcomeon"],a[href|="/rsbcomeon"],a[href|="/rppcute"],a[href|="/rcutiepie"],a[href|="/ra16"],a[href|="/ra26"],a[href|="/rabbored"],a[href|="/rabmerp"],a[href|="/ra07"],a[href|="/rraritypaper"],a[href|="/rraritynews"],a[href|="/ra17"],a[href|="/rsbbook"],a[href|="/rsweetiebook"],a[href|="/rsbook"],a[href|="/ra27"],a[href|="/rscootaplease"],a[href|="/rscootappeal"],a[href|="/rscootaplz"],a[href|="/ra08"],a[href|="/rtwiright"],a[href|="/rsatistwied"],a[href|="/ra18"],a[href|="/rcelestiawut"],a[href|="/rwutlestia"],a[href|="/ra28"],a[href|="/rgrannysmith"],a[href|="/rgranny"],a[href|="/roldmareyellsatcloud"],a[href|="/ra09"],a[href|="/rshiningarmor"],a[href|="/rshiningarmour"],a[href|="/ra19"],a[href|="/rchrysalis"],a[href|="/rqueenchrysalis"],a[href|="/rchangelingqueen"],a[href|="/ra29"],a[href|="/rcadence"],a[href|="/rcadance"],a[href|="/rprincesscadence"],a[href|="/rprincesscadance"],a[href|="/rprincessmiamorecadenza"],a[href|="/ra30"],a[href|="/rflutterroll"],a[href|="/ra31"],a[href|="/rspikemeh"],a[href|="/ra32"],a[href|="/rabmeh"],a[href|="/ra33"],a[href|="/rscootaderp"],a[href|="/rdidneyworl"],a[href|="/rDIDNEYWORL"],a[href|="/ra34"],a[href|="/rpinkieawe"],a[href|="/rppawe"],a[href|="/rareyouawizard"],a[href|="/ra35"],a[href|="/rsilverspoon"],a[href|="/rsspout"]{display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://e.thumbs.redditmedia.com/IhA4lCp2kZh1YHZv.png)}a[href|="/a00"],a[href|="/ra00"],a[href|="/ajlie"],a[href|="/rajlie"],a[href|="/swagintosh"],a[href|="/rswagintosh"],a[href|="/a24"],a[href|="/ra24"]{background-position:-0px -0px}a[href|="/a10"],a[href|="/ra10"],a[href|="/priceless"],a[href|="/rpriceless"]{background-position:-70px -0px}a[href|="/a20"],a[href|="/ra20"],a[href|="/flutterjerk"],a[href|="/rflutterjerk"]{background-position:-140px -0px}a[href|="/a30"],a[href|="/ra30"],a[href|="/flutterroll"],a[href|="/rflutterroll"]{background-position:-300% -0%}a[href|="/a01"],a[href|="/ra01"],a[href|="/twipride"],a[href|="/rtwipride"]{background-position:-0px -70px}a[href|="/a11"],a[href|="/ra11"],a[href|="/celestiamad"],a[href|="/rcelestiamad"]{background-position:-70px -70px}a[href|="/a21"],a[href|="/ra21"],a[href|="/twicrazy"],a[href|="/rtwicrazy"]{background-position:-140px -70px}a[href|="/a31"],a[href|="/ra31"],a[href|="/spikemeh"],a[href|="/rspikemeh"]{background-position:-210px -70px}a[href|="/a02"],a[href|="/lunateehee"],a[href|="/ra02"],a[href|="/rlunateehee"]{background-position:-0px -140px}a[href|="/a12"],a[href|="/lunawait"],a[href|="/ra12"],a[href|="/rlunawait"]{background-position:-70px -140px}a[href|="/a22"],a[href|="/paperbagderpy"],a[href|="/paperbagwizard"],a[href|="/derpwizard"],a[href|="/ra22"],a[href|="/rpaperbagderpy"],a[href|="/rpaperbagwizard"],a[href|="/rderpwizard"]{background-position:-140px -140px}a[href|="/a32"],a[href|="/ra32"],a[href|="/abmeh"],a[href|="/rabmeh"]{background-position:-210px -140px}a[href|="/a03"],a[href|="/ajhappy"],a[href|="/happlejack"],a[href|="/ra03"],a[href|="/rajhappy"],a[href|="/rhapplejack"]{background-position:-0px -210px}a[href|="/a13"],a[href|="/ra13"],a[href|="/ppfear"],a[href|="/rppfear"],a[href|="/pinkiefear"],a[href|="/rpinkiefear"]{background-position:-70px -210px}a[href|="/a23"],a[href|="/ra23"],a[href|="/twibeam"],a[href|="/rtwibeam"]{background-position:-140px -210px}a[href|="/a33"],a[href|="/ra33"],a[href|="/scootaderp"],a[href|="/rscootaderp"],a[href|="/didneyworl"],a[href|="/rdidneyworl"],a[href|="/DIDNEYWORL"],a[href|="/rDIDNEYWORL"]{background-position:-210px -210px}a[href|="/a04"],a[href|="/ra04"],a[href|="/raritydaww"],a[href|="/rraritydaww"]{background-position:-0px -280px}a[href|="/a14"],a[href|="/ra14"],a[href|="/scootacheer"],a[href|="/rscootacheer"],a[href|="/lootascoo"],a[href|="/rlootascoo"]{background-position:-70px -280px}a[href|="/a34"],a[href|="/ra34"],a[href|="/pinkieawe"],a[href|="/rpinkieawe"],a[href|="/ppawe"],a[href|="/rppawe"],a[href|="/areyouawizard"],a[href|="/rareyouawizard"]{background-position:-210px -280px}a[href|="/a05"],a[href|="/ra05"],a[href|="/ajsup"],a[href|="/rajsup"],a[href|="/ajwhatsgood"],a[href|="/rajwhatsgood"]{background-position:-0px -350px}a[href|="/a15"],a[href|="/ra15"],a[href|="/flutterwhoa"],a[href|="/rflutterwhoa"],a[href|="/flutterwoah"],a[href|="/rflutterwoah"]{background-position:-70px -350px}a[href|="/a25"],a[href|="/ra25"],a[href|="/rdcry"],a[href|="/rrdcry"]{background-position:-140px -350px}a[href|="/a35"],a[href|="/ra35"],a[href|="/silverspoon"],a[href|="/rsilverspoon"],a[href|="/sspout"],a[href|="/rsspout"]{background-position:-210px -350px}a[href|="/a06"],a[href|="/ra06"],a[href|="/ohcomeon"],a[href|="/rohcomeon"],a[href|="/sbcomeon"],a[href|="/rsbcomeon"]{background-position:-0px -420px}a[href|="/a16"],a[href|="/ra16"],a[href|="/ppcute"],a[href|="/rppcute"],a[href|="/cutiepie"],a[href|="/rcutiepie"]{background-position:-70px -420px}a[href|="/a26"],a[href|="/ra26"],a[href|="/abbored"],a[href|="/rabbored"],a[href|="/abmerp"],a[href|="/rabmerp"]{background-position:-140px -420px}a[href|="/a07"],a[href|="/ra07"],a[href|="/raritypaper"],a[href|="/rraritypaper"],a[href|="/raritynews"],a[href|="/rraritynews"]{background-position:-0px -490px}a[href|="/a17"],a[href|="/ra17"],a[href|="/sbbook"],a[href|="/rsbbook"],a[href|="/sweetiebook"],a[href|="/rsweetiebook"],a[href|="/sbook"],a[href|="/rsbook"]{background-position:-70px -490px}a[href|="/a27"],a[href|="/ra27"],a[href|="/scootaplease"],a[href|="/rscootaplease"],a[href|="/scootappeal"],a[href|="/rscootappeal"],a[href|="/scootaplz"],a[href|="/rscootaplz"]{background-position:-140px -490px}a[href|="/a08"],a[href|="/ra08"],a[href|="/twiright"],a[href|="/rtwiright"],a[href|="/satistwied"],a[href|="/rsatistwied"]{background-position:-0px -560px}a[href|="/a18"],a[href|="/ra18"],a[href|="/celestiawut"],a[href|="/rcelestiawut"],a[href|="/wutlestia"],a[href|="/rwutlestia"]{background-position:-70px -560px}a[href|="/a28"],a[href|="/ra28"],a[href|="/grannysmith"],a[href|="/rgrannysmith"],a[href|="/granny"],a[href|="/rgranny"],a[href|="/oldmareyellsatcloud"],a[href|="/roldmareyellsatcloud"]{background-position:-140px -560px}a[href|="/a09"],a[href|="/ra09"],a[href|="/shiningarmor"],a[href|="/rshiningarmor"],a[href|="/shiningarmour"],a[href|="/rshiningarmour"]{background-position:-0px -630px}a[href|="/a19"],a[href|="/ra19"],a[href|="/chrysalis"],a[href|="/rchrysalis"],a[href|="/queenchrysalis"],a[href|="/rqueenchrysalis"],a[href|="/changelingqueen"],a[href|="/rchangelingqueen"]{background-position:-70px -630px}a[href|="/a29"],a[href|="/ra29"],a[href|="/cadence"],a[href|="/cadance"],a[href|="/rcadence"],a[href|="/rcadance"],a[href|="/princesscadence"],a[href|="/princesscadance"],a[href|="/rprincesscadence"],a[href|="/rprincesscadance"],a[href|="/princessmiamorecadenza"],a[href|="/rprincessmiamorecadenza"]{background-position:-140px -630px}a[href|="/b00"],a[href|="/b01"],a[href|="/b02"],a[href|="/b03"],a[href|="/b04"],a[href|="/b05"],a[href|="/b06"],a[href|="/b07"],a[href|="/b08"],a[href|="/b09"],a[href|="/b10"],a[href|="/b11"],a[href|="/b12"],a[href|="/b13"],a[href|="/b14"],a[href|="/b15"],a[href|="/b16"],a[href|="/b17"],a[href|="/b18"],a[href|="/b19"],a[href|="/b20"],a[href|="/b21"],a[href|="/b22"],a[href|="/b23"],a[href|="/b24"],a[href|="/b25"],a[href|="/b26"],a[href|="/b27"],a[href|="/b28"],a[href|="/b29"],a[href|="/b30"],a[href|="/b31"],a[href|="/b32"],a[href|="/b33"],a[href|="/b34"],a[href|="/b35"],a[href|="/b36"],a[href|="/b37"],a[href|="/b38"],a[href|="/b39"],a[href|="/flutterfear"],a[href|="/ajcower"],a[href|="/fluttersrs"],a[href|="/ppshrug"],a[href|="/fluttershh"],a[href|="/ajugh"],a[href|="/trixiesmug"],a[href|="/ajwut"],a[href|="/abwut"],a[href|="/rarityjudge"],a[href|="/ppboring"],a[href|="/ajsly"],a[href|="/raritydress"],a[href|="/spikenervous"],a[href|="/newrainbowdash"],a[href|="/flutteryay"],a[href|="/raritywut"],a[href|="/flutterwink"],a[href|="/twisquint"],a[href|="/manspike"],a[href|="/rarityprimp"],a[href|="/rarityyell"],a[href|="/eeyup"],a[href|="/takealetter"],a[href|="/noooo"],a[href|="/squintyjack"],a[href|="/dumbfabric"],a[href|="/rarityannoyed"],a[href|="/raritywhine"],a[href|="/cockatrice"],a[href|="/twirage"],a[href|="/fluttershy"],a[href|="/rdsmile"],a[href|="/rdwut"],a[href|="/dj"],a[href|="/threedog"],a[href|="/spikepushy"],a[href|="/raritywhy"],a[href|="/soawesome"],a[href|="/rdcool"],a[href|="/facehoof"],a[href|="/ppseesyou"]{display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://c.thumbs.redditmedia.com/80NLKWiwYvcHbeD2.png)}a[href|="/rb00"],a[href|="/rb01"],a[href|="/rb02"],a[href|="/rb03"],a[href|="/rb04"],a[href|="/rb05"],a[href|="/rb06"],a[href|="/rb07"],a[href|="/rb08"],a[href|="/rb09"],a[href|="/rb10"],a[href|="/rb11"],a[href|="/rb12"],a[href|="/rb13"],a[href|="/rb14"],a[href|="/rb15"],a[href|="/rb16"],a[href|="/rb17"],a[href|="/rb18"],a[href|="/rb19"],a[href|="/rb20"],a[href|="/rb21"],a[href|="/rb22"],a[href|="/rb23"],a[href|="/rb24"],a[href|="/rb25"],a[href|="/rb26"],a[href|="/rb27"],a[href|="/rb28"],a[href|="/rb29"],a[href|="/rb30"],a[href|="/rb31"],a[href|="/rb32"],a[href|="/rb33"],a[href|="/rb34"],a[href|="/rb35"],a[href|="/rb36"],a[href|="/rb37"],a[href|="/rb38"],a[href|="/rb39"],a[href|="/rflutterfear"],a[href|="/rajcower"],a[href|="/rfluttersrs"],a[href|="/rppshrug"],a[href|="/rfluttershh"],a[href|="/rajugh"],a[href|="/rtrixiesmug"],a[href|="/rajwut"],a[href|="/rabwut"],a[href|="/rrarityjudge"],a[href|="/rppboring"],a[href|="/rajsly"],a[href|="/rraritydress"],a[href|="/rspikenervous"],a[href|="/rnewrainbowdash"],a[href|="/rflutteryay"],a[href|="/rraritywut"],a[href|="/rflutterwink"],a[href|="/rtwisquint"],a[href|="/rmanspike"],a[href|="/rrarityprimp"],a[href|="/rrarityyell"],a[href|="/reeyup"],a[href|="/rtakealetter"],a[href|="/rnoooo"],a[href|="/rsquintyjack"],a[href|="/rdumbfabric"],a[href|="/rrarityannoyed"],a[href|="/rraritywhine"],a[href|="/rcockatrice"],a[href|="/rtwirage"],a[href|="/rfluttershy"],a[href|="/rrdsmile"],a[href|="/rrdwut"],a[href|="/rdj"],a[href|="/rthreedog"],a[href|="/rspikepushy"],a[href|="/rraritywhy"],a[href|="/rsoawesome"],a[href|="/rrdcool"],a[href|="/rfacehoof"],a[href|="/rppseesyou"]{display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://d.thumbs.redditmedia.com/WEupV4XhKTMa_NEc.png)}a[href|="/b00"],a[href|="/rb00"],a[href|="/flutterfear"],a[href|="/rflutterfear"]{background-position:-0% -0%}a[href|="/b01"],a[href|="/rb01"],a[href|="/ajcower"],a[href|="/rajcower"]{background-position:-0% -100%}a[href|="/b02"],a[href|="/rb02"],a[href|="/fluttersrs"],a[href|="/rfluttersrs"]{background-position:-0% -200%}a[href|="/b03"],a[href|="/rb03"],a[href|="/ppshrug"],a[href|="/rppshrug"]{background-position:-0% -300%}a[href|="/b04"],a[href|="/rb04"],a[href|="/fluttershh"],a[href|="/rfluttershh"]{background-position:-0% -400%}a[href|="/b05"],a[href|="/rb05"],a[href|="/ajugh"],a[href|="/rajugh"]{background-position:-0% -500%}a[href|="/b06"],a[href|="/rb06"],a[href|="/trixiesmug"],a[href|="/rtrixiesmug"]{background-position:-0% -600%}a[href|="/b07"],a[href|="/rb07"],a[href|="/ajwut"],a[href|="/rajwut"]{background-position:-0% -700%}a[href|="/b08"],a[href|="/rb08"],a[href|="/abwut"],a[href|="/rabwut"]{background-position:-0% -800%}a[href|="/b09"],a[href|="/rb09"],a[href|="/rarityjudge"],a[href|="/rrarityjudge"]{background-position:-0% -900%}a[href|="/b10"],a[href|="/rb10"],a[href|="/ppboring"],a[href|="/rppboring"]{background-position:-100% -0%}a[href|="/b11"],a[href|="/rb11"],a[href|="/ajsly"],a[href|="/rajsly"]{background-position:-100% -100%}a[href|="/b12"],a[href|="/rb12"],a[href|="/raritydress"],a[href|="/rraritydress"]{background-position:-100% -200%}a[href|="/b13"],a[href|="/rb13"],a[href|="/spikenervous"],a[href|="/rspikenervous"],a[href|="/newrainbowdash"],a[href|="/rnewrainbowdash"]{background-position:-100% -300%}a[href|="/b14"],a[href|="/rb14"],a[href|="/flutteryay"],a[href|="/rflutteryay"]{background-position:-100% -400%}a[href|="/b15"],a[href|="/rb15"],a[href|="/raritywut"],a[href|="/rraritywut"]{background-position:-100% -500%}a[href|="/b16"],a[href|="/rb16"],a[href|="/flutterwink"],a[href|="/rflutterwink"]{background-position:-100% -600%}a[href|="/b17"],a[href|="/rb17"],a[href|="/twisquint"],a[href|="/rtwisquint"]{background-position:-100% -700%}a[href|="/b18"],a[href|="/rb18"],a[href|="/manspike"],a[href|="/rmanspike"]{background-position:-100% -800%}a[href|="/b19"],a[href|="/rb19"],a[href|="/rarityprimp"],a[href|="/rrarityprimp"]{background-position:-100% -900%}a[href|="/b20"],a[href|="/rb20"],a[href|="/rarityyell"],a[href|="/rrarityyell"]{background-position:-200% -0%}a[href|="/b21"],a[href|="/rb21"],a[href|="/eeyup"],a[href|="/reeyup"]{background-position:-200% -100%}a[href|="/b22"],a[href|="/rb22"],a[href|="/takealetter"],a[href|="/rtakealetter"]{background-position:-200% -200%}a[href|="/b23"],a[href|="/rb23"],a[href|="/noooo"],a[href|="/rnoooo"]{background-position:-200% -300%}a[href|="/b24"],a[href|="/rb24"],a[href|="/squintyjack"],a[href|="/rsquintyjack"]{background-position:-200% -400%}a[href|="/b25"],a[href|="/rb25"],a[href|="/dumbfabric"],a[href|="/rdumbfabric"]{background-position:-200% -500%}a[href|="/b26"],a[href|="/rb26"],a[href|="/rarityannoyed"],a[href|="/rrarityannoyed"]{background-position:-200% -600%}a[href|="/b27"],a[href|="/rb27"],a[href|="/raritywhine"],a[href|="/rraritywhine"]{background-position:-200% -700%}a[href|="/b28"],a[href|="/rb28"],a[href|="/cockatrice"],a[href|="/rcockatrice"]{background-position:-200% -800%}a[href|="/b29"],a[href|="/rb29"],a[href|="/twirage"],a[href|="/rtwirage"]{background-position:-200% -900%}a[href|="/b30"],a[href|="/rb30"],a[href|="/fluttershy"],a[href|="/rfluttershy"]{background-position:-300% -0%}a[href|="/b31"],a[href|="/rb31"],a[href|="/rdsmile"],a[href|="/rrdsmile"]{background-position:-300% -100%}a[href|="/b32"],a[href|="/rb32"],a[href|="/rdwut"],a[href|="/rrdwut"]{background-position:-300% -200%}a[href|="/b33"],a[href|="/rb33"],a[href|="/dj"],a[href|="/rdj"],a[href|="/threedog"],a[href|="/rthreedog"]{background-position:-300% -300%}a[href|="/b34"],a[href|="/rb34"],a[href|="/spikepushy"],a[href|="/rspikepushy"]{background-position:-300% -400%}a[href|="/b35"],a[href|="/rb35"],a[href|="/raritywhy"],a[href|="/rraritywhy"]{background-position:-300% -500%}a[href|="/b36"],a[href|="/rb36"],a[href|="/soawesome"],a[href|="/rsoawesome"]{background-position:-300% -600%}a[href|="/b37"],a[href|="/rb37"],a[href|="/rdcool"],a[href|="/rrdcool"]{background-position:-300% -700%}a[href|="/b38"],a[href|="/rb38"],a[href|="/facehoof"],a[href|="/rfacehoof"]{background-position:-300% -800%}a[href|="/b39"],a[href|="/rb39"],a[href|="/ppseesyou"],a[href|="/rppseesyou"]{background-position:-300% -900%}a[href|="/c00"],a[href|="/c01"],a[href|="/c02"],a[href|="/c03"],a[href|="/c04"],a[href|="/c05"],a[href|="/c06"],a[href|="/c07"],a[href|="/c08"],a[href|="/c09"],a[href|="/c10"],a[href|="/c11"],a[href|="/c12"],a[href|="/c13"],a[href|="/c14"],a[href|="/c15"],a[href|="/c16"],a[href|="/c17"],a[href|="/c18"],a[href|="/c19"],a[href|="/c20"],a[href|="/c21"],a[href|="/c22"],a[href|="/c23"],a[href|="/c24"],a[href|="/c25"],a[href|="/c26"],a[href|="/c27"],a[href|="/c28"],a[href|="/c29"],a[href|="/rdsitting"],a[href|="/twismug"],a[href|="/ohhi"],a[href|="/flutterblush"],a[href|="/ajfrown"],a[href|="/raritysad"],a[href|="/louder"],a[href|="/pinkamina"],a[href|="/scootaloo"],a[href|="/allmybits"],a[href|="/rdhappy"],a[href|="/twismile"],a[href|="/party"],a[href|="/gross"],a[href|="/hmmm"],a[href|="/fabulous"],a[href|="/lunasad"],a[href|="/loveme"],a[href|="/celestia"],a[href|="/zecora"],a[href|="/rdannoyed"],a[href|="/twistare"],a[href|="/hahaha"],a[href|="/derpyhappy"],a[href|="/joy"],a[href|="/derp"],a[href|="/derpyshock"],a[href|="/lunagasp"],a[href|="/angel"],a[href|="/photofinish"]{display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://c.thumbs.redditmedia.com/INlFSenUbBDZJAVn.png)}a[href|="/rc00"],a[href|="/rc01"],a[href|="/rc02"],a[href|="/rc03"],a[href|="/rc04"],a[href|="/rc05"],a[href|="/rc06"],a[href|="/rc07"],a[href|="/rc08"],a[href|="/rc09"],a[href|="/rc10"],a[href|="/rc11"],a[href|="/rc12"],a[href|="/rc13"],a[href|="/rc14"],a[href|="/rc15"],a[href|="/rc16"],a[href|="/rc17"],a[href|="/rc18"],a[href|="/rc19"],a[href|="/rc20"],a[href|="/rc21"],a[href|="/rc22"],a[href|="/rc23"],a[href|="/rc24"],a[href|="/rc25"],a[href|="/rc26"],a[href|="/rc27"],a[href|="/rc28"],a[href|="/rc29"],a[href|="/rrdsitting"],a[href|="/rtwismug"],a[href|="/rohhi"],a[href|="/rflutterblush"],a[href|="/rajfrown"],a[href|="/rraritysad"],a[href|="/rlouder"],a[href|="/rpinkamina"],a[href|="/rscootaloo"],a[href|="/rallmybits"],a[href|="/rrdhappy"],a[href|="/rtwismile"],a[href|="/rparty"],a[href|="/rgross"],a[href|="/rhmmm"],a[href|="/rfabulous"],a[href|="/rlunasad"],a[href|="/rloveme"],a[href|="/rcelestia"],a[href|="/rzecora"],a[href|="/rrdannoyed"],a[href|="/rtwistare"],a[href|="/rhahaha"],a[href|="/rderpyhappy"],a[href|="/rjoy"],a[href|="/rderp"],a[href|="/rderpyshock"],a[href|="/rlunagasp"],a[href|="/rangel"],a[href|="/rphotofinish"]{display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://c.thumbs.redditmedia.com/mN9QzNmV1YTLnaM8.png)}a[href|="/c00"],a[href|="/rc00"],a[href|="/rdsitting"],a[href|="/rrdsitting"]{background-position:-0px -0px}a[href|="/c01"],a[href|="/rc01"],a[href|="/twismug"],a[href|="/rtwismug"]{background-position:-0px -70px}a[href|="/c02"],a[href|="/rc02"],a[href|="/ohhi"],a[href|="/rohhi"]{background-position:-0px -140px}a[href|="/c03"],a[href|="/rc03"],a[href|="/flutterblush"],a[href|="/rflutterblush"]{background-position:-0px -210px}a[href|="/c04"],a[href|="/rc04"],a[href|="/ajfrown"],a[href|="/rajfrown"]{background-position:-0px -280px}a[href|="/c05"],a[href|="/rc05"],a[href|="/raritysad"],a[href|="/rraritysad"]{background-position:-0px -350px}a[href|="/c06"],a[href|="/rc06"],a[href|="/louder"],a[href|="/rlouder"]{background-position:-0px -420px}a[href|="/c07"],a[href|="/rc07"],a[href|="/pinkamina"],a[href|="/rpinkamina"]{background-position:-0px -490px}a[href|="/c08"],a[href|="/rc08"],a[href|="/scootaloo"],a[href|="/rscootaloo"]{background-position:-0px -560px}a[href|="/c09"],a[href|="/rc09"],a[href|="/allmybits"],a[href|="/rallmybits"]{background-position:-0px -630px}a[href|="/c10"],a[href|="/rc10"],a[href|="/rdhappy"],a[href|="/rrdhappy"]{background-position:-70px -0px}a[href|="/c11"],a[href|="/rc11"],a[href|="/twismile"],a[href|="/rtwismile"]{background-position:-70px -70px}a[href|="/c12"],a[href|="/rc12"],a[href|="/party"],a[href|="/rparty"]{background-position:-70px -140px}a[href|="/c13"],a[href|="/rc13"],a[href|="/gross"],a[href|="/rgross"]{background-position:-70px -210px}a[href|="/c14"],a[href|="/rc14"],a[href|="/hmmm"],a[href|="/rhmmm"]{background-position:-70px -280px}a[href|="/c15"],a[href|="/rc15"],a[href|="/fabulous"],a[href|="/rfabulous"]{background-position:-70px -350px}a[href|="/c16"],a[href|="/rc16"],a[href|="/lunasad"],a[href|="/rlunasad"]{background-position:-70px -420px}a[href|="/c17"],a[href|="/rc17"],a[href|="/loveme"],a[href|="/rloveme"]{background-position:-70px -490px}a[href|="/c18"],a[href|="/rc18"],a[href|="/celestia"],a[href|="/rcelestia"]{background-position:-70px -560px}a[href|="/c19"],a[href|="/rc19"],a[href|="/zecora"],a[href|="/rzecora"]{background-position:-70px -630px}a[href|="/c20"],a[href|="/rc20"],a[href|="/rdannoyed"],a[href|="/rrdannoyed"]{background-position:-140px -0px}a[href|="/c21"],a[href|="/rc21"],a[href|="/twistare"],a[href|="/rtwistare"]{background-position:-140px -70px}a[href|="/c22"],a[href|="/rc22"],a[href|="/hahaha"],a[href|="/rhahaha"]{background-position:-140px -140px}a[href|="/c23"],a[href|="/rc23"],a[href|="/derpyhappy"],a[href|="/rderpyhappy"]{background-position:-140px -210px}a[href|="/c24"],a[href|="/rc24"],a[href|="/joy"],a[href|="/rjoy"]{background-position:-140px -280px}a[href|="/c25"],a[href|="/rc25"],a[href|="/derp"],a[href|="/rderp"]{background-position:-140px -350px}a[href|="/c26"],a[href|="/rc26"],a[href|="/derpyshock"],a[href|="/rderpyshock"]{background-position:-140px -420px}a[href|="/c27"],a[href|="/rc27"],a[href|="/lunagasp"],a[href|="/rlunagasp"]{background-position:-140px -490px}a[href|="/c28"],a[href|="/rc28"],a[href|="/angel"],a[href|="/rangel"]{background-position:-140px -560px}a[href|="/c29"],a[href|="/rc29"],a[href|="/photofinish"],a[href|="/rphotofinish"]{background-position:-140px -630px}a[href|="/e00"],a[href|="/e01"],a[href|="/e02"],a[href|="/e03"],a[href|="/e04"],a[href|="/e05"],a[href|="/e06"],a[href|="/e07"],a[href|="/e10"],a[href|="/e11"],a[href|="/e12"],a[href|="/e13"],a[href|="/e14"],a[href|="/e15"],a[href|="/e16"],a[href|="/e17"],a[href|="/e20"],a[href|="/e21"],a[href|="/e22"],a[href|="/e23"],a[href|="/e24"],a[href|="/e25"],a[href|="/e26"],a[href|="/e27"],a[href|="/e08"],a[href|="/e18"],a[href|="/e28"],a[href|="/l00"],a[href|="/lyra"],a[href|="/t00"],a[href|="/bonbon"],a[href|="/sbstare"],a[href|="/snails"],a[href|="/rdhuh"],a[href|="/spitfire"],a[href|="/cutealoo"],a[href|="/fillytgap"],a[href|="/happyluna"],a[href|="/lunahappy"],a[href|="/sotrue"],a[href|="/wahaha"],a[href|="/berry"],a[href|="/punchdrunk"],a[href|="/absmile"],a[href|="/huhhuh"],a[href|="/dealwithit"],a[href|="/nmm"],a[href|="/blacksnooty"],a[href|="/queenmeanie"],a[href|="/hokeysmokes"],a[href|="/whooves"],a[href|="/rdsalute"],a[href|="/octavia"],a[href|="/whomeverthisis"],a[href|="/colgate"],a[href|="/cheerilee"],a[href|="/ajconfused"],a[href|="/ajbaffle"],a[href|="/ajtherapy"],a[href|="/abhuh"],a[href|="/lily"],a[href|="/thehorror"],a[href|="/twiponder"],a[href|="/spikewtf"],a[href|="/awwyeah"],a[href|="/e09"],a[href|="/gilda"],a[href|="/e19"],a[href|="/discentia"],a[href|="/discentiastare"],a[href|="/disstare"],a[href|="/e29"],a[href|="/macintears"],a[href|="/bigmactears"]{display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://e.thumbs.redditmedia.com/craJqX1YayP1v31j.png)}a[href|="/re00"],a[href|="/re01"],a[href|="/re02"],a[href|="/re03"],a[href|="/re04"],a[href|="/re05"],a[href|="/re06"],a[href|="/re07"],a[href|="/re10"],a[href|="/re11"],a[href|="/re12"],a[href|="/re13"],a[href|="/re14"],a[href|="/re15"],a[href|="/re16"],a[href|="/re17"],a[href|="/re20"],a[href|="/re21"],a[href|="/re22"],a[href|="/re23"],a[href|="/re24"],a[href|="/re25"],a[href|="/re26"],a[href|="/re27"],a[href|="/re08"],a[href|="/re18"],a[href|="/re28"],a[href|="/rl00"],a[href|="/rlyra"],a[href|="/rt00"],a[href|="/rbonbon"],a[href|="/rsbstare"],a[href|="/rsnails"],a[href|="/rrdhuh"],a[href|="/rspitfire"],a[href|="/rcutealoo"],a[href|="/rfillytgap"],a[href|="/rhappyluna"],a[href|="/rlunahappy"],a[href|="/rsotrue"],a[href|="/rwahaha"],a[href|="/rberry"],a[href|="/rpunchdrunk"],a[href|="/rabsmile"],a[href|="/rhuhhuh"],a[href|="/rdealwithit"],a[href|="/rnmm"],a[href|="/rblacksnooty"],a[href|="/rqueenmeanie"],a[href|="/rhokeysmokes"],a[href|="/rwhooves"],a[href|="/rrdsalute"],a[href|="/roctavia"],a[href|="/rwhomeverthisis"],a[href|="/rcolgate"],a[href|="/rcheerilee"],a[href|="/rajconfused"],a[href|="/rajbaffle"],a[href|="/rajtherapy"],a[href|="/rabhuh"],a[href|="/rlily"],a[href|="/rthehorror"],a[href|="/rtwiponder"],a[href|="/rspikewtf"],a[href|="/rawwyeah"],a[href|="/re09"],a[href|="/rgilda"],a[href|="/re19"],a[href|="/rdiscentia"],a[href|="/rdiscentiastare"],a[href|="/rdisstare"],a[href|="/re29"],a[href|="/rmacintears"],a[href|="/rbigmactears"]{display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://b.thumbs.redditmedia.com/k-UUqlk6zYVKTNu1.png)}a[href|="/l00"],a[href|="/rl00"],a[href|="/e01"],a[href|="/re01"],a[href|="/lyra"],a[href|="/rlyra"]{background-position:-0px -70px}a[href|="/t00"],a[href|="/rt00"],a[href|="/e00"],a[href|="/re00"],a[href|="/fillytgap"],a[href|="/rfillytgap"]{background-position:-0px -0px}a[href|="/e11"],a[href|="/re11"],a[href|="/bonbon"],a[href|="/rbonbon"]{background-position:-70px -70px}a[href|="/e20"],a[href|="/re20"],a[href|="/snails"],a[href|="/rsnails"]{background-position:-140px -0px}a[href|="/e10"],a[href|="/re10"],a[href|="/rdhuh"],a[href|="/rrdhuh"]{background-position:-70px -0px}a[href|="/e21"],a[href|="/re21"],a[href|="/spitfire"],a[href|="/rspitfire"]{background-position:-140px -70px}a[href|="/e02"],a[href|="/re02"],a[href|="/cutealoo"],a[href|="/rcutealoo"]{background-position:-0px -140px}a[href|="/e12"],a[href|="/re12"],a[href|="/happyluna"],a[href|="/rhappyluna"],a[href|="/lunahappy"],a[href|="/rlunahappy"]{background-position:-70px -140px}a[href|="/e22"],a[href|="/re22"],a[href|="/sotrue"],a[href|="/rsotrue"]{background-position:-140px -140px}a[href|="/e03"],a[href|="/re03"],a[href|="/wahaha"],a[href|="/rwahaha"]{background-position:-0px -210px}a[href|="/e13"],a[href|="/re13"],a[href|="/sbstare"],a[href|="/rsbstare"]{background-position:-70px -210px}a[href|="/e23"],a[href|="/re23"],a[href|="/berry"],a[href|="/rberry"],a[href|="/punchdrunk"],a[href|="/rpunchdrunk"]{background-position:-140px -210px}a[href|="/e14"],a[href|="/re14"],a[href|="/absmile"],a[href|="/rabsmile"]{background-position:-70px -280px}a[href|="/e04"],a[href|="/re04"],a[href|="/huhhuh"],a[href|="/rhuhhuh"]{background-position:-0px -280px}a[href|="/e24"],a[href|="/re24"],a[href|="/dealwithit"],a[href|="/rdealwithit"]{background-position:-140px -280px}a[href|="/e05"],a[href|="/re05"],a[href|="/nmm"],a[href|="/blacksnooty"],a[href|="/rnmm"],a[href|="/rblacksnooty"],a[href|="/queenmeanie"],a[href|="/rqueenmeanie"],a[href|="/hokeysmokes"],a[href|="/rhokeysmokes"]{background-position:-0px -350px}a[href|="/e15"],a[href|="/re15"],a[href|="/whooves"],a[href|="/rwhooves"]{background-position:-70px -350px}a[href|="/e25"],a[href|="/re25"],a[href|="/rdsalute"],a[href|="/rrdsalute"]{background-position:-140px -350px}a[href|="/e06"],a[href|="/re06"],a[href|="/octavia"],a[href|="/whomeverthisis"],a[href|="/rwhomeverthisis"],a[href|="/roctavia"]{background-position:-0px -420px}a[href|="/e16"],a[href|="/re16"],a[href|="/colgate"],a[href|="/rcolgate"]{background-position:-70px -420px}a[href|="/e26"],a[href|="/re26"],a[href|="/cheerilee"],a[href|="/rcheerilee"]{background-position:-140px -420px}a[href|="/e07"],a[href|="/re07"],a[href|="/ajconfused"],a[href|="/rajconfused"],a[href|="/ajbaffle"],a[href|="/rajbaffle"],a[href|="/ajtherapy"],a[href|="/rajtherapy"]{background-position:-0px -490px}a[href|="/e17"],a[href|="/re17"],a[href|="/abhuh"],a[href|="/rabhuh"]{background-position:-70px -490px}a[href|="/e27"],a[href|="/re27"],a[href|="/lily"],a[href|="/rlily"],a[href|="/thehorror"],a[href|="/rthehorror"]{background-position:-140px -490px}a[href|="/e08"],a[href|="/re08"],a[href|="/twiponder"],a[href|="/rtwiponder"]{background-position:-0px -560px}a[href|="/e18"],a[href|="/re18"],a[href|="/spikewtf"],a[href|="/rspikewtf"]{background-position:-70px -560px}a[href|="/e28"],a[href|="/re28"],a[href|="/awwyeah"],a[href|="/rawwyeah"]{background-position:-140px -560px}a[href|="/e09"],a[href|="/re09"],a[href|="/gilda"],a[href|="/rgilda"]{background-position:-0px -630px}a[href|="/e19"],a[href|="/re19"],a[href|="/discentia"],a[href|="/rdiscentia"],a[href|="/discentiastare"],a[href|="/rdiscentiastare"],a[href|="/disstare"],a[href|="/rdisstare"]{background-position:-70px -630px}a[href|="/e29"],a[href|="/re29"],a[href|="/macintears"],a[href|="/rmacintears"],a[href|="/bigmactears"],a[href|="/rbigmactears"]{background-position:-140px -630px}a[href^="/smooze"]{background-position:0px 0px;display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://c.thumbs.redditmedia.com/5wA7HWAl2WD-UzA8.png)}a[href^="/rsmooze"]{background-position:-0px -70px;display:block;clear:none;float:left;width:70px;height:70px;background-image:url(http://c.thumbs.redditmedia.com/5wA7HWAl2WD-UzA8.png)}a[href|="/sp"]{display:inline-block;padding-right:100%}a[href|="/sp"]+.reddit_show_hidden_emotes_span{display:none}a[href^="/"][href*="-in-"],a[href^="/"][href$="-in"],a[href^="/"][href*="-inp-"],a[href^="/"][href$="-inp"]{float:none;display:inline-block}');
        
          /* Secret Emotes */
          ponyEmotes.addGlobalRule('a[href|="/sbf"], a[href|="/rsbf"] {display: block; clear:none; float:left; background-image: url(http://i.imgur.com/baE1o.png); background-position: 0px 0px; width: 80px; height: 66px;} a[href|="/crossfire"], a[href|="/rcrossfire"] {display: block; clear:none; float:left; background-image: url(http://i.imgur.com/RhMfk.png); background-position: 0px 0px; width: 180px; height: 125px;} a[href|="/rcrossfire"], a[href|="/rsbf"] { -moz-transform: scaleX(-1); -webkit-transform: scaleX(-1); -o-transform: scaleX(-1); } .iconList a[href|="/sbf"] {display:inline-block !important; float:none !important; margin-left: auto !important; margin-right: auto !important; }');
        }
        
        ponyEmotes.injectStyle();
        
        /* Only create the panel and stuff if we are logged in. Inject My Reddit Ponies, should the person have that on. */
        if(ponyEmotes.prefs.ignoreLogin == false)
        {
          if(!document.getElementById("mail"))
            return;
        } 
        
        ponyEmotes.inject();
      }
  };
  ponyEmotes.addUpdateInfo();
  
  if((/www\.redditmedia\.com/ig).exec(document.location) == null)
  {
    if (window.safari !== void 0 && window.SafariContentNamespace !== void 0 && safari instanceof SafariContentNamespace) { safari.self.addEventListener('message', function(event) { if(event.name === 'preferences') { for (var key in event.message) { if (event.message.hasOwnProperty(key)) { ponyEmotes.prefs[key] = event.message[key]; } } ponyEmotes.init();}}, false); safari.self.tab.dispatchMessage('getPreferences'); } else { ponyEmotes.init(); }  
  }
}