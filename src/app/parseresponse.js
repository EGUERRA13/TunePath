
export function ParseGeminiResponse(geminiResponse){
    const flowchartNodes = []; //array will contain individual album node objects
    const lineArray = geminiResponse.split('\n'); //array containing each individual line of gemini ai response
    
    //album node object data will look as such {albumName:"", edgeDesc1:"", edgeAlbum1:"", edgeCount: 0}; 

    console.log(lineArray);

    let nodeCount = 0
    let endofLoop = false;
    let i = 2
    let albNode = new Object()
    //loops through the response line array and uses conditionals to parse and create album node objects 
    while (endofLoop == false) {
        if (lineArray[i].includes("*End of Flowchart Response*")){
            flowchartNodes[nodeCount] = albNode; //add last album node object
            endofLoop = true; //ends the while loop
        }
        else if (lineArray[i].includes("Start with:") ){
            nodeCount = nodeCount + 1;
            const tempName = lineArray[i].match(new RegExp('"' + "(.*)" + '"')); //reg expression used to get starter album name
            let albumName = tempName[1]; 
            console.log(albumName);
            albNode = new Object(); // creating first album node object
            albNode["albumName"] = albumName; //setting album name to the album node object
            albNode["edgeCount"] = 0; //initiating edge count
            flowchartNodes[nodeCount] = albNode; //adding first album node object to array album node objects 

        }else if (lineArray[i].includes("* **") && lineArray[i].charAt(0) == '*'){
            let currEdgeCount = albNode.edgeCount + 1; //arrived to an edge so increment edge count
            albNode["edgeCount"] = currEdgeCount; //adjusting edge count of node object currently on
            console.log("I MADE IT HERE")
            console.log(lineArray[i]);
            const tempDesc = lineArray[i].match(/\\* \\*(\S+(.*?)\:)/); //using reg expression to assign edge description
            let edgeDesc = tempDesc[1]
            edgeDesc = edgeDesc.substring(2, tempDesc[1].length - 1) + "?"; //cleaning string
            console.log(edgeDesc);
            const tempEdgeAlbum = lineArray[i].match(new RegExp('Go to ' + "(.*)" + ' ')); //using reg expression to get edge album
            if (tempEdgeAlbum){
                //if reg expression successfully finds an album name then it is added to current node object
                let edgeAlbum = tempEdgeAlbum[1];
                console.log(edgeAlbum);
                albNode["edgeDesc" + currEdgeCount ] =  edgeDesc;
                albNode["edgeAlbum" + currEdgeCount] =  edgeAlbum.substring(1,edgeAlbum.length-1);
            }else{
                //reg expression did not find an album name but the node is still added to current node object
                let edgeAlbum = "errornodetonowhere"
                albNode["edgeDesc" + currEdgeCount ] =  edgeDesc;
                albNode["edgeAlbum" + currEdgeCount] =  edgeAlbum;

            }

        }else if(lineArray[i].includes("**Next Node Album: ")){
            flowchartNodes[nodeCount] = albNode; //new album is found so previous album is stored in node object array
            nodeCount = nodeCount + 1;
            let tempAlbumName = lineArray[i].match(new RegExp(' ' + "(.*)" + ' ')); //reg expression is used to find album name
            let albumName = tempAlbumName[1];
            albumName = albumName.substring(12, albumName.length); //album name string is cleaned up
            console.log(albumName);
            albNode = new Object(); //new album is found so new album node object is created
            albNode["albumName"] = albumName;
            albNode["edgeCount"] = 0;

        }
        i = i + 1;
    }
    console.log(flowchartNodes);

    return flowchartNodes;
}