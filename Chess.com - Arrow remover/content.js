
let arrows = new Map()
let pieces = new Map()


function isRook(b, e)
{   for (let i = 0; i < 7; i++) 
    {
        if(b[0]+i == e[0] || b[0]-i == e[0])
        {   if(b[1] == e[1])
                return true;
        }              
        if(b[1]+i == e[1] || b[1]-i == e[1])
        {   if(b[0] == e[0])
                return true;
        }
    }
}
function isBishop(b, e)
{   for (let i = 0; i < 7; i++) {
        if(b[0]+i == e[0] || b[0]-i == e[0]){
            {   if(b[1]+i == e[1] || b[1]-i == e[1])
                    return true;
            }
        }
    }
    return false;
}
function isKnight(b,e)
{   if(b[0]+2 == e[0] || b[0]-2 == e[0])
    {   if(b[1]+1 == e[1] || b[1]-1 == e[1])
        return true
    }            
    if(b[0]+1 == e[0] || b[0]-1 == e[0])
    {   if(b[1]+2 == e[1] || b[1]-2 == e[1])
        return true
    }
    return false
}
function isKing(b,e, color)
{   var  f = 1//file
    var r = 5 // rank
    if(color == 'b')
        f = 8
    
    if(b[0]+1 == e[0] || b[0]-1 == e[0] || b[0] == e[0])
    {   if(b[1]+1 == e[1] || b[1]-1 == e[1] || b[1] == e[1])
        return true
    }   
    if(b[0] == r && b[1] == f)
    {   if(b[1] == e[1] && b[0]+2 == e[0] || b[0]-2 == e[0] )
            return true
    }
    return false
}
function isPawn(b,e,color)
{   var i=1;
    var s=2     //s = start position pawn
    if(color == 'b')
    {   i = -1;
        s=7
    }
    if(b[1]+i == e[1])
    {   if(b[0] == e[0] || b[0]+i == e[0] || b[0]-i == e[0])
            return true
    }if(b[1] == s)
    {   if(b[1]+(i*2) == e[1] && b[0] == e[0])  
            return true
    }
    return false;
}
function setArrowsToMap(arrowsHTML)
{   arrowsHTML.forEach(element => 
    {   element = element.outerHTML;
        element = element.split("\"")[1].split("-")[1];
        arrows.set(
            element.charCodeAt(0)-96 + element.charAt(1),
            element.charCodeAt(2)-96 + element.charAt(3))
    });
}
function setPiecesToMap()
{   var piecesHTML = document.querySelectorAll('[class^=piece]');
    piecesHTML.forEach(element => 
    {   element = element.outerHTML
        element = element.split("\"")[1].split(" ")
        pieces.set(element[2].split("-")[1], element[1])
    });
}
function sameKeys(m1, m2){
    var keys = [];
    for (const [key,value] of m1.entries()) {
        if (m2.has(key)) {
            keys.push(key)
        }
    }
    return keys;
}
function isLegalMove(begin, end, piece)
{   b = [parseInt(begin.charAt(0)), parseInt(begin.charAt(1))]
    e = [parseInt(end.charAt(0)), parseInt(end.charAt(1))]
    switch (piece.charAt(1)) 
    {   case 'p':
            return isPawn(b,e,piece.charAt(0));
        case 'n': 
            return isKnight(b,e);
        case 'b': 
            return isBishop(b,e);
        case 'q': 
            if(isBishop(b,e) || isRook(b,e)) return true
            else return false
        case 'r': 
            return isRook(b,e);
        case 'k': 
            return isKing(b,e)
    }
    return false
}
function deleteArrow(key, value)
{   key = String.fromCharCode(parseInt(key.charAt(0))+96) + key.charAt(1);
    value = String.fromCharCode(parseInt(value.charAt(0))+96) + value.charAt(1);
    var arrow = document.getElementById("arrow-"+key+value);
    if(arrow)
        arrow.style.visibility= "hidden";
}
function hasIncomingArrow(begin, map)
{   for (let [k, v] of map) {
      if (v == begin)
        return true; 
    }  
    return false;
}

setInterval(() => 
{   arrows.clear()
    pieces.clear()
    var arrowsHTML = document.querySelectorAll('polygon')
    
    if(arrowsHTML.length)
    {   setArrowsToMap(arrowsHTML)
        setPiecesToMap();    
        var keys = sameKeys(pieces,arrows)
        keys.forEach(key => 
        {   end = arrows.get(key)
            piece = pieces.get(key)
            if(!hasIncomingArrow(key, arrows) && !isLegalMove(key, end, piece))
                deleteArrow(key, end)
            
        });
        
    }
}, 100);