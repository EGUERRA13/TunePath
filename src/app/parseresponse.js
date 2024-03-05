
export function ParseGeminiResponse(geminiResponse){
    const flowchartNodes = [];
    //const AlbumNode = {albumName:"", edgeDesc1:"", edgeAlbum1:"", edgeCount: 0}; 
    const lineArray = geminiResponse.split('\n');

    const str ="red orange yellow green blue"
    const result = str.match(new RegExp('red' + "(.*)" + 'blue'));
    console.log(result[1]);
    console.log(lineArray[0]);
    console.log(lineArray[1]);
    console.log(lineArray[2]);

    let nodeCount = 0
    let endofLoop = false;
    let i = 2
    let albNode = new Object()
    console.log("TEST1");

    while (endofLoop == false) {
        if (lineArray[i].includes("Start with:") ){
            nodeCount = nodeCount + 1;
            const tempName = lineArray[i].match(new RegExp('"' + "(.*)" + '"'));
            let albumName = tempName[1];
            console.log(albumName);
            albNode = new Object();
            albNode["albumName"] = albumName;
            albNode["edgeCount"] = 0;
            flowchartNodes[nodeCount] = albNode;

        }else if (lineArray[i].includes("* **")){
            let currEdgeCount = albNode.edgeCount + 1;
            albNode["edgeCount"] = currEdgeCount;
            console.log("I MADE IT HERE")
            console.log(lineArray[i]);
            //lineArray[i] = lineArray[i].replace(/^[[^\w\s]+]\s*/, '');
            const tempDesc = lineArray[i].match(/\\* \\*(\S+(.*?)\:)/);
            let edgeDesc = tempDesc[1]
            edgeDesc = edgeDesc.substring(2, tempDesc[1].length - 1) + "?";
            console.log(edgeDesc);
            const tempEdgeAlbum = lineArray[i].match(new RegExp('Go to "' + "(.*)" + '" '));
            let edgeAlbum = tempEdgeAlbum[1];
            albNode["edgeDesc" + currEdgeCount ] =  edgeDesc;
            albNode["edgeAlbum" + currEdgeCount] =  edgeAlbum;

        }else if(lineArray[i].includes("**Next Node Album: ")){
            flowchartNodes[nodeCount] = albNode;
            nodeCount = nodeCount + 1;
            let tempAlbumName = lineArray[i].match(new RegExp('Next Node Album:' + "(.*)" + '('));
            albumName = tempAlbumName[1];
            albNode = new Object();
            albNode["albumName"] = albumName;
            albNode["edgeCount"] = 0;

        }else if (lineArray[i].includes("*End of Flowchart Response*")){
            flowchartNodes[nodeCount] = albNode;
            endofLoop = true;
        }
        i = i + 1;
    }
    console.log(flowchartNodes);
    console.log("TEST2");




    /*
    let albumName = "";
    let nodeCount = 0;
    let variableName = "albNode";
    let endofLoop = false;
    let i = 2
   

    while (endofLoop == false) {
        if (lineArray[i].includes("Start with:") ){
            nodeCount = nodeCount + 1;
            albumName = str.match(new RegExp('"' + "(.*)" + '"'));
            eval('const ' + variableName + nodeCount + ' = ' + new Object() + ';');
            eval(variableName + nodeCount + '[albumName] = ' + albumName + ';');
            eval(variableName + nodeCount + '[edgeCount] = ' + "0" + ';');

        }else if (lineArray[i].includes("* **")){
            let currEdgeCount = eval(variableName + nodeCount + '.edgeCount') + 1;
            eval(variableName + nodeCount + '[edgeCount] = ' + currEdgeCount + ';');
            edgeDesc = str.match(new RegExp('* **' + "(.*)" + ':**'));
            edgeAlbum = str.match(new RegExp('Go to "' + "(.*)" + '" '));
            eval(variableName + nodeCount + '[edgeDesc' + currEdgeCount + '] = ' + edgeDesc + ';');
            eval(variableName + nodeCount + '[edgeAlbum' + currEdgeCount + '] = ' + edgeAlbum + ';');

        }else if(lineArray[i.includes("**Next Node Album: ")]){
            flowchartNodes.push(eval(variableName + nodeCount));
            nodeCount = nodeCount + 1;
            albumName = str.match(new RegExp('Next Node Album:' + "(.*)" + '('));
            eval('const ' + variableName + nodeCount + '= ' + Object.create(AlbumNode) + ';');
            eval(variableName + nodeCount + '[albumName] = ' + albumName + ';');
            eval(variableName + nodeCount + '[edgeCount] = ' + "0" + ';');

        }else if (lineArray[i].includes("*End of Flowchart Response*")){
            flowchartNodes.push(eval(variableName + nodeCount));
            endofLoop = true;
        }
        i = i + 1;
    }
    console.log(flowchartNodes);
    */



}