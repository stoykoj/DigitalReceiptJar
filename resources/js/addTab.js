// addTab.js

function getUserInput() {
    var other_person;

    if ( ( document.getElementById( "other_user" ).value ) != null && ( document.getElementById( "other_user" ).value ) != "" ) {
        other_person = document.getElementById( "other_user" ).value;
    } else if ( ( document.getElementById( "other_name" ).value ) != null && ( document.getElementById( "other_name" ).value ) != "" ) {
        other_person = document.getElementById( "other_name" ).value
    } else {
        alert( "ERROR: Invalid input for names." +
            "\n\t     Missing username or name/email!" +
            "\n\t     (If they have an account, please enter their" +
            "\n\t     username, otherwise please enter their name" +
            "\n\t     and email address.)");
    }

    if ( other_person != null ) {
        if ( document.getElementById( "first_selection" ).value === document.getElementById( "second_selection" ).value ) {
            alert( "ERROR: Invalid input for relationship." +
                "\n\t     Borrower cannot be the same person as loaner!" );
        } else {
            addBubble( other_person, document.getElementById( "amount_owed" ).value );
        }
    }
}

function addBubble( otherUserName, amountOwed ) {
    amountOwed = amountOwed.trim().replace( "$", "" ).replace( ",", "" );

    if ( !isNaN( amountOwed ) ) {
        if ( amountOwed > 0 ) {
            var added = false;
            var posn;
            var numBubbles = sessionStorage.getItem( "numBubbles" );

            if ( document.getElementById( "first_selection" ).value != "You" ) {
                amountOwed *= -1;
            }

            for ( var i = 0; i < numBubbles && !added; i++ ) {
                if ( Math.abs( amountOwed ) >= Math.abs( sessionStorage.getObject( "amounts" )[i] ) ) {
                    posn = i;
                    added = true;
                }
            }

            if ( !added ) {
                if ( numBubbles == 0 ) {
                    posn = 0;
                } else {
                    posn = numBubbles;
                }
            }

            var temp;
            temp = sessionStorage.getObject( "names" ); temp.insert( posn, otherUserName ); sessionStorage.setObject( "names", temp );
            temp = sessionStorage.getObject( "amounts" ); temp.insert( posn, amountOwed ); sessionStorage.setObject( "amounts", temp );
            temp = sessionStorage.getObject( "sizes" ); temp.insert( posn, calculateSize( amountOwed ) ); sessionStorage.setObject( "sizes", temp );
            temp = sessionStorage.getObject( "images" ); temp.insert( posn, "default" ); sessionStorage.setObject( "images", temp );
            sessionStorage.setObject( "numBubbles", sessionStorage.getObject( "numBubbles" ) + 1 );

            document.getElementById( "next_btn" ).setAttribute( "href", "mainscreen.html" );
        } else {
            alert( "ERROR: Invalid format for amount." +
                "\n\t     Amount must be greater than 0!" );
        }
    } else {
        alert( "ERROR: Invalid format for amount." +
            "\n\t     No alphabets or special characters please!" );
    }
}

function updateOptionsUserName() {
    var otherUserName = document.getElementById( "other_user" ).value;
    document.getElementById( "other_option" ).text = otherUserName;
    document.getElementById( "other_option2" ).text = otherUserName;
}

function updateOptionsName() {
    var otherName = document.getElementById( "other_name" ).value;
    document.getElementById( "other_option" ).text = otherName;
    document.getElementById( "other_option2" ).text = otherName;
}





