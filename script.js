function help_numbers() {
    var help_orgs = [
        {"name": "Aware", "contact": "1800 804 848"},
        {"name": "Samaritans", "contact": "116 123"},
        {"name": "Text Support", "contact": "50808"},
        {"name": "Pieta House", "contact": "1800 247 247"},
        {"name": "Text SpunOut", "contact": "086 1800 280"},
        {"name": "Hanover Medical", "contact": "01 675 0040"},
        {"name": "Out of hours doctor (DDoc)", "contact": "1850 224 477"},
        {"name": "Out of hours doctor (Dub Doc)", "contact": "01 454 5607"},
        {"name": "Emergency", "contact": "999 / 112 "},
    ]

    help_orgs.forEach(row => {
        document.getElementById('help_org_body').innerHTML += `<tr><td>${row['name']}</td><td>${row['contact']}</td>`;
    })

}

function clear_form() {
    // remove all values from the form and removes any remaining valid/invalid visuals
    document.getElementById('contact_form').classList.remove('was-validated', 'valid', 'invalid');
    var input_ids = ['form_name', 'form_email', 'form_phone', 'form_message']
    input_ids.forEach(input_id => {
        document.getElementById(input_id).value = null;
        // clear any errors
        document.getElementById(input_id + '_error').classList.replace('error-active', 'error');
        // there is a corresponding CSS that sets the background for this class to white
        document.getElementById(input_id).classList.add('not_checked');
        }
    );
    // set the submit button to disbled
    document.getElementById('contact_form_button').disabled=true;
}

function load_now() {
    clear_form();
    help_numbers();
}

// since I'm not actually sending anything, I will show an alert with the form data
function send_message() {
    var input_ids = ['form_name', 'form_email', 'form_phone', 'form_message']
    var alert_str = "Thank you for contacting us!\n Your message:\n"
    input_ids.forEach(input_id => {
        alert_str += document.getElementById(input_id).name + ': ';
        alert_str += document.getElementById(input_id).value + '\n';
    })
    clear_form();
    alert(alert_str);
}

/*
when the user clicks on the image, they are going to see the image enlarged with
some text and a close button
I'm going the information frome this https://www.w3schools.com/howto/howto_css_overlay.asp guide
to achieve this
*/
function gallery_view(id) {
    // id = id of the division that the image is inside
    var parent_div = document.getElementById(id);
    // getElementByClassName returns an array of elements with the given class name in the parent element
    // there is only 1 gallery_image, at index 0 of course
    var gallery_image = parent_div.getElementsByClassName('gallery_image')[0];
    // analogically for the hidden text
    var gallery_text = parent_div.getElementsByClassName('gallery_text')[0]
    var overlay = document.getElementById("overlay");
    overlay.classList.replace("overlay_hidden", "overlay_showing")

    /* apparently JavaScript doesn't have a simple sleep() method - luckily w3schools have my back:
    https://www.w3schools.com/jsref/met_win_settimeout.asp
    This waits a second (the last parameter, time in MS), to make sure that the overlay is drawn
    then it plops the image and the text in it
    */
    setTimeout(() =>  {
            overlay.innerHTML = `<div id="overlay_content">\n<img id="overlay_image" src="${gallery_image.src}"/>\n<p id="overlay_text">${gallery_text.innerHTML}"</p>\n</div>`;
            /* the border-* and rounded classes are part of bootstrap
            probably not the best thing to use border-warning just because I want the colour, but
            it's simple */
            document.getElementById('overlay_image').classList.add("border", "border-2", "border-warning", "rounded");
        }, 1000);
}

/*
This hides the removes the children elements from the overlay and removes it
*/
function hide_overlay() {
    var overlay = document.getElementById('overlay');
    var overlay_content = document.getElementById('overlay_content');
    overlay.removeChild(overlay_content); // https://catalin.red/removing-an-element-with-plain-javascript-remove-method/
    overlay.classList.replace("overlay_showing", "overlay_hidden")
}

/*
Makes the error div visible and sends the error message to it
*/
function send_error(id, message) {
    document.getElementById(id).classList.remove("error");
    document.getElementById(id).classList.add("error_active");
    document.getElementById(id).innerText += message;
}

/*
Clears the error field
*/
function clear_errors(id) {
        document.getElementById(id + '_error').innerText = '';
        document.getElementById(id + '_error').classList.replace('error-active', 'error');
}

/*
The form field can't let the user enter just anything, let's validate!
Using custom validity [https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/setCustomValidity] to 
increase the granularity of existing html validation
*/
function validate_me(id) {
    var input = document.getElementById(id); 
    input.classList.add('not_checked');
    // without this, the validation colours won't work
    input.classList.remove('not_checked');
    switch(input.type) {
        case 'text': 
            clear_errors(id);
            // a flag that keeps a state (if true, there are errors in the field)
            var error_flag = false;
            if (input.name = 'name') {
                // there has to be 2 or more words
                words = input.value.split(' ');
                if (words.length < 2 || words.includes("")) {
                    error_flag = true;
                    input.classList.add('invalid');
                    send_error(id + '_error', 'Please enter both name and surname\n');
                    // only letters dashes and spaces are allowed
                } 
                if (!(/^[-\sa-zA-Z]+$/.test(input.value))) {
                    error_flag = true;
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                    send_error(id + '_error', 'Only letters dashes and spaces are allowed\n');
                }
                if (error_flag == false) {
                    // all is good
                    input.classList.remove('invalid');
                    input.classList.add('valid');
                }
            }
        break;
        case 'email':
            clear_errors(id);
            // this regex is probably a bit lax, but better than nothing
            if (!(/[^\s].?@[^.]+\.[^.]{2,}$/.test(input.value))) {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                    send_error(id + '_error', 'A valid email has to have a "@" in th middle and a "." towards the end\n');
            } else {
                    input.classList.remove('invalid');
                    input.classList.add('valid');
            }
        break;
        /* tel input fields don't validate automatically, because formats are too different
        so it needs to be validated "manually" */
        case 'tel':
            clear_errors(id);
            // has to start with a + or a digit, only digits, dashes, spaces and dots are acceptable after
            // apparently there is at least one countr with 4 digit phone numbers [https://en.wikipedia.org/wiki/Telephone_numbers_in_Niue]
            if (!(/^(?:\+|\d)\d[-\s.\d]+$/.test(input.value)) || input.value.length < 4) {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                    send_error(id + '_error', 'A valid phone number can start with "+" or a digit, followed by at least 3 digits. Spaces, "-", "." are allowed as separators.\n');
            } else {
                    input.classList.remove('invalid');
                    input.classList.add('valid');
            }
        break;
        case 'textarea': 
            clear_errors(id);
            // this fields just can't be empty
            if (input.value == "") {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                    send_error(id + '_error', 'The message can\'t be empty.\n');
            } else {
                    input.classList.remove('invalid');
                    input.classList.add('valid');
            }
        break;
    }
    // check if there are any problems to enable/disable the submit button
    var input_ids = ['form_name', 'form_email', 'form_phone', 'form_message']
    button = document.getElementById('contact_form_button');
    /* set the button to enabled, if there is at least one invalid field,
    it will be disabled below*/ 
    button.disabled = false; // if all is good, the user can submit
    input_ids.forEach(input_id => {
        var valid = document.getElementById(input_id).classList.contains('valid');
        // if validity is false, it's invalid
        if (valid==false) {
            button.disabled = true; 
            return 0; // no need to carry on
        } 
    });
}
