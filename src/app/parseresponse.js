
export function ParseGeminiResponse(geminiResponse){
    const flowchartNodes = [];
    const lineArray = geminiResponse.split('\n');
    //const AlbumNode = {albumName:"", edgeDesc1:"", edgeAlbum1:"", edgeCount: 0}; 

    console.log(lineArray);

    let nodeCount = 0
    let endofLoop = false;
    let i = 2
    let albNode = new Object()

    while (endofLoop == false) {
        if (lineArray[i].includes("*End of Flowchart Response*")){
            flowchartNodes[nodeCount] = albNode;
            endofLoop = true;
        }
        else if (lineArray[i].includes("Start with:") ){
            nodeCount = nodeCount + 1;
            const tempName = lineArray[i].match(new RegExp('"' + "(.*)" + '"'));
            let albumName = tempName[1];
            console.log(albumName);
            albNode = new Object();
            albNode["albumName"] = albumName;
            albNode["edgeCount"] = 0;
            flowchartNodes[nodeCount] = albNode;

        }else if (lineArray[i].includes("* **") && lineArray[i].charAt(0) == '*'){
            let currEdgeCount = albNode.edgeCount + 1;
            albNode["edgeCount"] = currEdgeCount;
            console.log("I MADE IT HERE")
            console.log(lineArray[i]);
            //lineArray[i] = lineArray[i].replace(/^[[^\w\s]+]\s*/, '');
            const tempDesc = lineArray[i].match(/\\* \\*(\S+(.*?)\:)/);
            let edgeDesc = tempDesc[1]
            edgeDesc = edgeDesc.substring(2, tempDesc[1].length - 1) + "?";
            console.log(edgeDesc);
            const tempEdgeAlbum = lineArray[i].match(new RegExp('Go to ' + "(.*)" + ' '));
            if (tempEdgeAlbum){
                let edgeAlbum = tempEdgeAlbum[1];
                console.log(edgeAlbum);
                albNode["edgeDesc" + currEdgeCount ] =  edgeDesc;
                albNode["edgeAlbum" + currEdgeCount] =  edgeAlbum.substring(1,edgeAlbum.length-1);
            }else{
                let edgeAlbum = "errornodetonowhere"
                albNode["edgeDesc" + currEdgeCount ] =  edgeDesc;
                albNode["edgeAlbum" + currEdgeCount] =  edgeAlbum;

            }

        }else if(lineArray[i].includes("**Next Node Album: ")){
            flowchartNodes[nodeCount] = albNode;
            nodeCount = nodeCount + 1;
            let tempAlbumName = lineArray[i].match(new RegExp(' ' + "(.*)" + ' '));
            let albumName = tempAlbumName[1];
            albumName = albumName.substring(12, albumName.length);
            console.log(albumName);
            albNode = new Object();
            albNode["albumName"] = albumName;
            albNode["edgeCount"] = 0;

        }
        i = i + 1;
    }
    console.log(flowchartNodes);

    return flowchartNodes;
}