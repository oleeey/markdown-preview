$(document).ready(function() {
   setInput();

   $("#editor").on("change keyup paste", function() {
      setNewInput();
   });

})

function getInput() {
   return $("#editor").val().split("\n");
}

function setInput() {
   let input = getInput();
   for (let i = 1; i <= input.length; i++) {
      let line = input[i - 1];
      let tag = isHeader(line, i)[0];
      line = isHeader(line, i)[1];
      let code = isSpecial(line)[1];
      line = isSpecial(line,i)[0];

      if (code && code.length > 0) {    
         code = code.replace(/\s/g,"");
         let text = "";
         if (code.match(/https:/g)) {
            if (line[0] == "!") {
               line = line.filter(item => item !== "!");
               $("<img>", {src: line[1], alt: line[0]}).appendTo("#preview")
            }
            else {
               for (let i in line) {
                  if (line[i] == line[line.indexOf(code) - 1]) {
                     $("<a>", {class: "link", href: code, target:"_blank"}).text(line[i]).appendTo($("#preview"));
                     line = line.filter(item => item !== code);
                  }
                  else {
                     $("<p>", {class: "codeWrapper"}).text(line[i]).appendTo($("#preview"));
                  }
               }
         }
         }
         else {
            if (code.match(/`.+`/g)) {
               code = code.replace(/`/g,"");
               text = "code";
            }
            else if (code.match(/\*.+\*/g)) {
               code = code.replace(/\*/g,"")
               text = "bold";
            }
            
            for (let i in line) {
               if (line[i].replace(/\s/g,"") === code) {
                  $("<p>", {class: text}).text(line[i].replace(/`/g,"")).appendTo($("#preview"));
               }
               else {
                  $("<p>", {class: "codeWrapper"}).text(line[i]).appendTo($("#preview"));
               }
            }
      }
      }

      else if (line.match(/>/g)) {
         $("<blockquote>").text(line.replace(/>/g,"")).appendTo("#preview")
      }
      
      else {
         $(tag).html(line).appendTo($("#preview"));
      }
   }
   
   let codes = input.join("\n").match(/(?<=```)(.*)(?=```)/gms)[0];
   codes = codes.split("\n");
   codes = codes.filter(item => item !== "");

   $("<div>", {class: "multiCodeWrapper"}).appendTo("#preview")
   codes.map(item => $('p:contains("' + item + '")').appendTo($(".multiCodeWrapper")))
   $("#preview p:contains(```)").empty();
}

             

function setNewInput() {
   $("#preview").empty();
   setInput();
}

function getTag(count) {
return `<h${count}>`;
}

function isHeader(line) {
   let regex = /^#+ /g;
   let tag = "<p>";
   if (line.match(regex)) {
      let match = line.match(regex);
      line = line.replace(match,"")
      tag = getTag(match[0].trim().length)
   }
   return [tag, line];
}

function isSpecial(line,i) {
   let regex1 = /^[^`]*`[^`]+`[^`]*$/g;

   let code = "";
   if (line.match(regex1)) {
      /*
      schaut nochmal ob nur 2 Backticks sind, da sonst ein Teil vom Satz vor den Backticks auch im Variablen
      "code" gespeichert wird 
      */
         code = line.match(regex1)[0];
         code = code.match(/`.+`/)[0];
         line = line.split("`");
         line = line.map(el => el.trim());
   }
   else if (line.match(/\*.+\*/g)) {
         code = line.match(/\*.+\*/g)[0];
         line = line.split("**");
         //line = line.map(el => el.trim());
   }
   else if (line.match(/\[.+\]/g)) {
      code = line.match(/\(.+\)/g)[0].replace(/\(|\)/g,"");
      line = line.split(/\[|\]|\(|\)/g);
      line = line.filter(item => item !== "");
   }
   return [line, code];
}

function toggleMax1() {
   if (!$("#previewWrap").hasClass("minimized")) {
      $("#previewWrap").addClass("minimized")
      $("textarea").addClass("maximized")
   }
   else {
      $("#previewWrap").removeClass("minimized");
      $("textarea").removeClass("maximized");
   }
};
 
function toggleMax2() {
   if (!$("#editorWrap").hasClass("minimized")) {
      $("#editorWrap").addClass("minimized")
   }
   else {
      $("#editorWrap").removeClass("minimized");
   }
}  




