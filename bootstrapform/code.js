function checkEmail()
{
    //check textboxes to make sure they are not empty
    //check to see if text in both boxes are the same
    
    var email = document.getElementById("email").value;
    var confirm = document.getElementById("confirm").value;

    if(email == "") //conditional expression, when is true, the code in the block will be executed
    {
        document.getElementById("email-error").innerHTML = "Please fill in this field";    
    }
    else
    {
        document.getElementById("email-error").innerHTML = "";
    }

    //check to see if confirm box is empty
        if(email == "") //conditional expression, when is true, the code in the block will be executed
    {
        document.getElementById("confirm-error").innerHTML = "Please fill in this field";    
    }
    else
    {
        document.getElementById("confirm-error").innerHTML = "";
    }

    //check if both boxes have the same value
    if( email != confirm) //if the two strings are NOT the same
    {
        //print error
        document.getElementById("email-error").innerHTML = "both emails must be the same";
        document.getElementById("confirm-error").innerHTML = "both emails must be the same"; 
    }   

}

function pizzaOrder()
{
    var output = "<h3>Pizza Order: ";

    //radio buttons
    if( document.getElementById("small").checked == true)
    {
        output += " Small ";
    }
    else if( document.getElementById("medium").checked == true)
    {
        output += " Medium ";
    }
    else
    {
        output += " Large ";
    }

    //checkboxes
    if( document.getElementById("pepperoni").checked == true)
    {
        output += " Pepperoni ";
    }   

    if( document.getElementById("sausage").checked == true)
    {
        output = output + " sausage ";
    }

    if( document.getElementById("mushrooms").checked == true)
    {
        output = output + " mushrooms ";
    }
    //output statement
    document.getElementById("output").innerHTML = output + "</h3>"
}

