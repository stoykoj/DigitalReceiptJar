var canvas; var context; var box;

var canvasWidth = 1920; var canvasHeight = document.documentElement.clientHeight - 153; var windowOffsetX = 120;
var boxWidth;

var MAX_BUBBLE_SIZE = 350;
var red = '#d30000'; var black = '#000000';

function initialize() {
    if ( typeof( Storage ) !== "undefined" ) {
        if ( sessionStorage.getObject( "numBubbles" ) === null ) {
            sessionStorage.setObject( "names", ["Regina George", "Aaron Samuels", "Gretchen Wieners", "Cady Heron"] );
            sessionStorage.setObject( "amounts", [80, 50, 30, -20] );
            sessionStorage.setObject( "sizes", [185.51, 150.76, 121.49, 105.03] );
            sessionStorage.setObject( "images", ["reginaGeorge", "aaronSamuels", "gretchenWieners", "cadyHeron"] );
            sessionStorage.setObject( "numBubbles", 4 );
            var angles = [( Math.random() * 2 * Math.PI ), ( Math.random() * 2 * Math.PI )]
            sessionStorage.setObject( "angles", angles );
        }

        redrawCanvas();
    } else {
        console.log( "Browser does not support web storage." );
    }
}

function redrawCanvas() {
    canvas = document.getElementById( 'bubblesCanvas' );
    context = canvas.getContext( '2d' );
    box = document.getElementById( 'box' );

    boxWidth = box.clientWidth - windowOffsetX;
    canvasHeight = document.documentElement.clientHeight - 153;
    canvas.width = boxWidth;
    canvas.height = canvasHeight;
    var ratio = boxWidth / canvasWidth;

    var points = generatePoints( ratio );

    for ( var i = 0; i < sessionStorage.getObject( "numBubbles" ); i++ ) {
        document.getElementsByClassName( "bubbleButton" ).remove();
        drawBubble( points[i][0], points[i][1], sessionStorage.getObject( "sizes" )[i] * ratio,
            sessionStorage.getObject( "names" )[i], sessionStorage.getObject( "amounts" )[i],
            sessionStorage.getObject( "images" )[i] );
    }
}

function drawBubble( x, y, diameter, name, amount, imgSrc ) {
    var radius = diameter / 2;
    var arcX = x + radius; var arcY = y + radius;
    var lineWidth = 3; var horizontalOffset = 61; var verticalOffset = 83;
    var colour = getColour( amount );

    var img = document.createElement( "img" );
    img.src = "resources/img/" + imgSrc + "ProfilePic.png";
    img.onload = function() {
        // draw image
        context.drawImage( img, x, y, diameter, diameter );

        // add button
        var titleText;
        if ( colour == red ) {
            titleText = "Click to confirm that you have paid " + name + ".";
        } else {
            titleText = "Click to confirm that " + name + " has paid you.";
        }
        var button = document.createElement( "button" );
        button.setAttribute( "type", "button" );
        button.setAttribute( "class", "bubbleButton" );
        button.setAttribute( "title", titleText );
        button.style.cssText = ""
                                + "background-color: transparent; "
                                + "border-color: transparent; "
                                + "outline: 0; "
                                + "position: absolute; "
                                + "left: " + ( x + horizontalOffset ) + "px; "
                                + "top: " + ( y + verticalOffset ) + "px; "
                                + "height: " + ( diameter + lineWidth * 2 ) + "px; "
                                + "width: "+ ( diameter + lineWidth * 2 ) + "px; "
                                + "border-radius: " + ( diameter + lineWidth * 2 ) + "px; "
                                + "margin: 0px; "
                                + "border: 0px; "
                                + "padding: 0px; ";
        button.onclick = function(){confirmPayment(name, colour);};

        box.appendChild( button );

        // draw circle
        context.beginPath();
        context.arc( arcX, arcY, radius, 0, 2 * Math.PI, false );
        context.lineWidth = lineWidth;
        context.strokeStyle = getColour( amount );
        context.stroke();

        // add text
        var amountText = "$".concat( Math.abs( amount ) );
        context.font = "12px sans-serif";
        context.fillStyle = "white";
        //context.strokestyle = "black";
        context.lineWidth = 4;
        context.strokeText(name, centerText( name, arcX ), arcY + radius - 17);
        context.strokeText(amountText, centerText( amountText, arcX ), arcY + radius -5);
        //context.css("text-shadow", "2px 2px 0px #FF0000");
        context.fillText( name, centerText( name, arcX ), arcY + radius - 17 );
        context.fillText( amountText, centerText( amountText, arcX ), arcY + radius - 5 );
    };
}

function confirmPayment(name, colour){
    if (colour == red){
        $('#redModal').modal('show');
        document.getElementById("redYes").onclick = function(){delay(name);}
    }else{
        $('#blackModal').modal('show');
        document.getElementById("blackYes").onclick = function(){removeBubble(name);}
    }
}


function datahide()
{
    $("[data-hide]").on("click", function () {
        $("." + $(this).attr("data-hide")).hide();
    });
    //document.getElementById("confirm_alert").hide();
}

/*$(function(){
    $("[data-hide]").on("click", function(){
        $("." + $(this).attr("data-hide")).hide();
        // -or-, see below
        // $(this).closest("." + $(this).attr("data-hide")).hide();
    });
});*/

function delay(name){
    //document.getElementById("confirm_alert").hide().delay(2500).show('medium');
    //.update(name +" confirmed your payment")
    //$("#confirm_alert_button").onclick = function(){removeBubble(name);}
    //$("#confirm_alert").innerHTML = name+" confirmed your payment"
    $("#confirm_alert_text").text(name+" confirmed your payment!");
    $("#confirm_alert").hide().delay(4000).show('medium');
    window.setTimeout(removeBubble, 4000, name);
    $("#confirm_alert").hide().delay(4000).hide('medium');
}

function removeBubble( name ) {
    var numBubbles = sessionStorage.getObject( "numBubbles" );
    var names = sessionStorage.getObject( "names" );
    var found = false;
    var temp;

    for ( var i = 0; i < numBubbles && !found; i++ ) {
        if ( names[i] === name ) {
            temp = sessionStorage.getObject( "names" ); temp.remove( i ); sessionStorage.setObject( "names", temp );
            temp = sessionStorage.getObject( "amounts" ); temp.remove( i ); sessionStorage.setObject( "amounts", temp );
            temp = sessionStorage.getObject( "sizes" ); temp.remove( i ); sessionStorage.setObject( "sizes", temp );
            temp = sessionStorage.getObject( "images" ); temp.remove( i ); sessionStorage.setObject( "images", temp );
            sessionStorage.setObject( "numBubbles", sessionStorage.getObject( "numBubbles" ) - 1 );
            found = true;
        }
    }

    if ( found ) {
        redrawCanvas();
    }
}

function calculateSize( amount ) {
    var size;
    amount = Math.abs( amount );

    if ( amount > 500 ) {
        // static size
        size = MAX_BUBBLE_SIZE;
    } else if ( amount > 150 ) {
        // linear equation scale size
        size = 0.358166 * amount + 170.917;
    } else {
        // quadratic equation scale size
        size = -0.00609539 * Math.pow( amount, 2 ) + 1.95092 * amount + 68.4475;
    }

    return size;
}

function centerText( text, posn ) {
    return posn - context.measureText( text ).width / 2;
}

function getColour( amount ) {
    var colour;

    if ( amount > 0 ) {
        colour = red;
    } else {
        colour = black;
    }

    return colour;
}

function generatePoints( ratio ) {
    var points = [];
    var x; var y; var radius; var angle = 0; var deltaAngle = 0; var biggestRadius = 0;
    var radiusOffset = 0; var bubbleOffset = ( 25 * ratio ); var totalOffset;
    var halfWidth = boxWidth / 2; var halfHeight = canvasHeight / 2;

    for ( var i = 0; i < sessionStorage.getObject( "numBubbles" ); i++ ) {
        radius = ( sessionStorage.getObject( "sizes" )[i] * ratio ) / 2;

        if ( i == 0 ) {
            x = halfWidth - radius;
            y = halfHeight - radius;
            radiusOffset = radius;
        } else {
            if ( i == 1 ) {
                angle = sessionStorage.getObject( "angles" )[0]; deltaAngle = Math.PI / 3;
                biggestRadius = radius;
            } else if ( i == 7 ) {
                radiusOffset += ( 2 * biggestRadius ) + ( bubbleOffset );
                angle = sessionStorage.getObject( "angles" )[1]; deltaAngle = Math.PI / 6;
                biggestRadius = radius;
            } else {
                angle += deltaAngle;
            }

            totalOffset = radiusOffset + bubbleOffset + radius;
            x = halfWidth + totalOffset * Math.cos( angle ) - radius;
            y = halfHeight - totalOffset * Math.sin( angle ) - radius;
        }

        points.push( [x, y] );
    }


    return points;
}

Array.prototype.insert = function( index, item ) {
    this.splice( index, 0, item );
};

Array.prototype.remove = function( index ) {
    this.splice( index, 1 );
};

Storage.prototype.setObject = function( key, object ) {
    return this.setItem( key, JSON.stringify( object ) );
};

Storage.prototype.getObject = function ( key ) {
    return JSON.parse( this.getItem( key ) );
};

Element.prototype.remove = function() {
    this.parentElement.removeChild( this );
};

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for ( var i = 0; i < this.length; i++ ) {
        if ( this[i] && this[i].parentElement ) {
            this[i].parentElement.removeChild( this[i] );
        }
    }
};


