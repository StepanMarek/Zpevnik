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
songTextFont = "11px sans-serif";
accordsTextFont = "bold 8px sans-serif";

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

function writeResult(twoLines, id){
    var id = id === undefined ? "result" : id;
    var resultDiv = document.getElementById(id);
    var line = false;
    if(twoLines[0].length > 0){
        line = createAccords(twoLines[0]);
        resultDiv.append(line)
        resultDiv.append(document.createElement("br"));
    }
    line = createLine(twoLines[1]);
    resultDiv.append(line);
    resultDiv.append(document.createElement("br"));
}

function clearElement(elem){
    while(elem.firstChild){
        elem.removeChild(elem.firstChild);
    }
}

function createTitle(){
    var inputIDs = ["titleInput", "extraInfoInput", "overflowTitleInput", "overflowExtraInfoInput"];
    var targetIDs = ["title", "extraInfo", "overflowTitle", "overflowExtraInfo"];
    var input, elem;
    for(var i = 0; i < inputIDs.length; i++){
        input = document.getElementById(inputIDs[i]);
        elem = document.getElementById(targetIDs[i]);
        elem.innerHTML = input.value;
    }
}

function generate(){
    createTitle();
    var elem = document.getElementById("input");
    clearElement(document.getElementById("result"));
    var text = elem.value;
    // First, search for overflow mark
    resultText = "";
    overflowText = "";
    if(text.includes("\\o")){
        resultText = text.substring(0,text.indexOf("\\o"));
        overflowText = text.substring(text.indexOf("\\o")+2, text.length);
    } else {
        resultText = text;
    }
    var lines = resultText.split("\n");
    for(var i = 0; i < lines.length; i++){
        rewrittenAccords = rewriteAllAccords(lines[i]);
        writeResult(rewrittenAccords);
    }
    var lines = overflowText.split("\n");
    for(var i = 0; i < lines.length; i++){
        rewrittenAccords = rewriteAllAccords(lines[i]);
        writeResult(rewrittenAccords, "resultOverflow");
    }
}
