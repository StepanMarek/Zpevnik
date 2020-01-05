function surveyForAccords(text){
    lines = text.split("\n");
    markedLines = [];
    for(var i = 0; i < lines.length; i++){
        includesAccord = lines[i].includes("{") && lines[i].includes("}");
        markedLines.push([lines[i],includesAccord])
    }
    return markedLines
}

textMeasurer = document.createElement("canvas").getContext("2d");
songTextFont = "15px sans-serif";
accordsTextFont = "15px sans-serif";

function rewriteAccord(line, offset, extraWidthOffset){
    var offset = offset === undefined ? 0 : offset;
    var extraWidthOffset = extraWidthOffset === undefined ? 0 : extraWidthOffset;
    var start = line.indexOf("{");
    var end = line.indexOf("}");
    if(start < 0 || end < 0){
        return ["",line];
    }
    var upperString = line.substring(start+1,end);
    var newLine = line.substring(0,start) + line.substring(end+1,line.length);
    textMeasurer.font = songTextFont;
    var offsetWidth = textMeasurer.measureText(line.substring(offset, start)).width;
    textMeasurer.font = accordsTextFont;
    var accordWidth = textMeasurer.measureText(upperString).width;
    return [[upperString, offsetWidth - extraWidthOffset], newLine, accordWidth]
}

function rewriteAllAccords(line){
    var offset = 0;
    var extraWidthOffset = 0;
    var upperString = "";
    var iterated = line;
    var resultHolder;
    iterations = 0;
    maxIterations = 10;
    upperStrings = []
    var start = iterated.indexOf("{");
    while(start >= 0){
        resultHolder = rewriteAccord(iterated, offset, extraWidthOffset);
        upperStrings.push(resultHolder[0]);
        iterated = resultHolder[1];
        offset = start;
        extraWidthOffset = resultHolder[2];
        start = iterated.indexOf("{");
    }
    return [upperStrings, iterated];
}

function createLine(line){
    var elem = document.createElement("span");
    elem.classList.add("songText");
    elem.innerHTML = line;
    return elem;
}

function createAccords(upperStrings){
    var elem = document.createElement("span");
    elem.classList.add("accords");
    var spacerElem, charElem;
    for(var i = 0; i < upperStrings.length; i++){
        spacerElem = document.createElement("span");
        spacerElem.classList.add("accordsSpacer");
        spacerElem.style.width = upperStrings[i][1];
        elem.appendChild(spacerElem);
        charElem = document.createElement("span");
        charElem.innerHTML = upperStrings[i][0];
        elem.appendChild(charElem);
    }
    return elem;
}

function writeResult(twoLines){
    var resultDiv = document.getElementById("result");
    var line = false;
    console.log(twoLines);
    if(twoLines[0].length > 0){
        line = createAccords(twoLines[0]);
        resultDiv.append(line)
        resultDiv.append(document.createElement("br"));
    }
    line = createLine(twoLines[1]);
    resultDiv.append(line);
    resultDiv.append(document.createElement("br"));
}

function generate(){
    var elem = document.getElementById("input");
    var text = elem.value;
    markedLines = surveyForAccords(text);
    for(var i = 0; i < markedLines.length; i++){
        if(markedLines[i][1]){
            rewrittenAccords = rewriteAllAccords(markedLines[i][0]);
            console.log(rewrittenAccords);
            writeResult(rewrittenAccords);
        }
    }
}
