// INPUT DATA
const delimiter = document.getElementById("delimiter")
let = delim = ""

const claveXML = document.getElementById("key-xml")
let keyXML = ""

const claveJWT = document.getElementById("key-jwt")
let keyJWT = ""

const input = document.querySelector('input[type="file"]')
let result = ""

var jwt = require('jsonwebtoken');

// ACTION BUTTONS
const getXMLfromText = document.getElementById("txt-xml")
const getTextFromXML = document.getElementById("xml-txt")
const getJWTfromText = document.getElementById("txt-jwt")
const getTextFromJWT = document.getElementById("jwt-txt")
const textFromJSON = document.getElementById("json-txt")
const getJSONfromText = document.getElementById("txt-json")


// INPUT DATA EVENTS
input.addEventListener('change', (e) => {
    console.log(input.files, 'input.files')
    document.getElementById("upload-file-name").innerHTML = input.files[0].name
    const reader = new FileReader()
    reader.onload = () => {
        document.getElementById("input-textarea").innerHTML = reader.result
        result = reader.result
    }
    reader.readAsText(input.files[0])
}, false)

delimiter.addEventListener("change", e => {
    console.log(e.target.value, "value")
    delim = e.target.value
}, false)

claveXML.addEventListener("change", e => {
    console.log(e.target.value, "clave")
    keyXML = e.target.value
}, false)

claveJWT.addEventListener("change", e => {
    console.log(e.target.value, "clave")
    keyJWT = e.target.value
}, false)

// ACTION BUTTONS EVENTS

getXMLfromText.addEventListener('click', e => {

    let validation = validate("txt")

    if (!validation) {
        if (keyXML && /^[0-9]+$/.test(keyXML)) {
            let xml = ""
            let xmlBody = ""
            let txtArray = result.split("\n")
            txtArray.pop()

            xmlBody = txtArray.map(elem => {
                elemArray = elem.split(delim)
                let crypt = vigenere(elemArray[3], keyXML, true)

                return "<cliente><documento>" + elemArray[0] + "</documento><primer-nombre>" + elemArray[1] +
                    "</primer-nombre><apellido>" + elemArray[2] + "</apellido><credit-card>" + crypt +
                    "</credit-card><tipo>" + elemArray[4] + "</tipo><telefono>" + elemArray[5] + "</telefono></cliente>"

            }).join().replace(/,+/g, '')

            xml = "<clientes>" + xmlBody + "</clientes>"

            document.getElementById("output-textarea").innerHTML = xml
            download("vig-encoded.xml", xml)

        } else {
            alert("Tu llave no es válida!")
        }
    } else {
        alert(validation)
    }
}, false)

getTextFromXML.addEventListener("click", e => {

    parser = new DOMParser()
    let xmlFile = parser.parseFromString(result, "text/xml")

    let validation = validate("xml")
    
    if (!validation) {
        if (keyXML) {
            
            let clients = xmlFile.querySelectorAll('clientes')
            let response = ""

            clients.forEach(clientXmlNode => {
                
                let clientXmlArray = [...clientXmlNode.children]
                
                clientXmlArray.map(clientChildren => {
                    
                    clientChildren.getElementsByTagName("credit-card")[0].innerHTML = vigenere(
                        clientChildren.getElementsByTagName("credit-card")[0].textContent,
                        keyXML,
                        false
                    )
                    
                    response = response +
                            clientChildren.getElementsByTagName("documento")[0].textContent + delim + 
                            clientChildren.getElementsByTagName("primer-nombre")[0].textContent + delim +
                            clientChildren.getElementsByTagName("apellido")[0].textContent + delim +
                            clientChildren.getElementsByTagName("credit-card")[0].textContent + delim +
                            clientChildren.getElementsByTagName("tipo")[0].textContent + delim +
                            clientChildren.getElementsByTagName("telefono")[0].textContent + "\n"

                })
            })

            document.getElementById("output-textarea").innerHTML = response
            download("vig-decoded.txt", response)

        } else {
            alert("Inserte una clave númerica para poder descifrar")
        }
    } else {
        alert(validation)
    }
}, false)

getJWTfromText.addEventListener("click", e => {

    let validation = validate("txt")

    if (!validation) {
        if (keyJWT) {
            let json = ""
            let jsonBody = ""
            let txtArray = result.split("\n")
            txtArray.pop()

            jsonBody = txtArray.map(elem => {

                elemArray = elem.split(delim)

                return "{\"documento\":\"" + elemArray[0] + "\",\"primer-nombre\":\"" + elemArray[1] +
                    "\",\"apellido\":\"" + elemArray[2] + "\",\"credit-card\":\"" + elemArray[3] +
                    "\",\"tipo\":\"" + elemArray[4] + "\",\"telefono\":\"" + elemArray[5] + "\"}"

            })

            json = "[" + jsonBody + "]"

            let resJWT = jwt.sign(json, keyJWT)

            document.getElementById("output-textarea").innerHTML = resJWT
            download("token-encoded.txt", resJWT)

        } else {
            alert("Ingrese una clave para cifrar con JWT su texto")
        }

    } else {
        alert(validation)
    }
}, false)

getTextFromJWT.addEventListener("click", e => {

    let validation = validate("token")

    if (!validation) {

        if (keyJWT) {
            let token = result

            let decoded = jwt.verify(token, keyJWT)
            let text = getTextFromJSON(decoded)

            document.getElementById("output-textarea").innerHTML = text
            download("decoded-from-token.txt", text)

        } else {
            alert("Ingrese una clave para descifrar con JWT su texto")
        }
    } else {
        alert(validation)
    }
}, false)

textFromJSON.addEventListener("click", e => {

    let validation = validate("json")

    if (!validation) {

        let json = result
        let text = getTextFromJSON(JSON.parse(json))

        document.getElementById("output-textarea").innerHTML = text
        download("response-fromjson.txt", text)

        
    } else {
        alert(validation)
    }
}, false)

getJSONfromText.addEventListener("click", e => {

    let validation = validate("txt")

    if (!validation) {
        
      let json = ""
      let jsonBody = ""
      let txtArray = result.split("\n")
      txtArray.pop()

      jsonBody = txtArray.map(elem => {

          elemArray = elem.split(delim)

          return "{\"documento\":\"" + elemArray[0] + "\",\"primer-nombre\":\"" + elemArray[1] +
              "\",\"apellido\":\"" + elemArray[2] + "\",\"credit-card\":\"" + elemArray[3] +
              "\",\"tipo\":\"" + elemArray[4] + "\",\"telefono\":\"" + elemArray[5] + "\"}"

      })

      json = "[" + jsonBody + "]"

      document.getElementById("output-textarea").innerHTML = json
      download("responseJSON.json", json)

    } else {
        alert(validation)
    }
}, false)


// TRANSFORM JSON TO TXT FUNCTION
const getTextFromJSON = json => {
    let txtData = ""
    console.log(json, "json")
    json.map(elem => {
        console.log(elem, "elem")
        for (var key in elem) {
            console.log(elem[key])
            txtData = txtData + elem[key] + delim
        }
        txtData = txtData.slice(0, -1)
        txtData = txtData + "\n"
    })
    return txtData
}


// DOWNLOAD RESPONSE
const download = (filename, text) => {
    let element = document.getElementById('download');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    document.getElementById('dwn-btn').disabled = false
}


// VIGENERE CRYPT
const vigenere = (input, key, forward) => {
    if (key == null) key = "";
    var alphabet =
        "0123456789";

    // Validate key: ignora caracteres en la key que no estén en el abedecedario
    key = key.toUpperCase();
    var key_len = key.length;
    var i;
    var adjusted_key = "";
    for (i = 0; i < key_len; i++) {
        var key_char = alphabet.indexOf(key.charAt(i));
        if (key_char < 0) continue;
        adjusted_key += alphabet.charAt(key_char);
    }
    key = adjusted_key;
    key_len = key.length;
    if (key_len == 0) {
        alert("No has ingresado una key válida!");
        key = "a";
        key_len = 1;
    }

    // Transform input:
    var input_len = input.length;
    var output = "";
    var key_index = 0;

    for (i = 0; i < input_len; i++) {
        var input_char = input.charAt(i);

        var input_char_value = alphabet.indexOf(input_char);
        if (input_char_value < 0) {
            output += input_char;
            continue;
        }
        if (forward)
            input_char_value += alphabet.indexOf(key.charAt(key_index));
        else input_char_value -= alphabet.indexOf(key.charAt(key_index));
        input_char_value += 10;
        input_char_value %= 10;
        output += alphabet.charAt(input_char_value);
        key_index = (key_index + 1) % key_len;
    }
    return output;
}

// VALIDATIONS
const validate = (type) => {
    let msg = ""
    if (result) {
        if (delim) {
            if (/^[a-z0-9]+$/.test(delim)) {
                msg = msg + " Tu delimitador no puede ser un caracter alfanumérico"
            } else {

                switch (type) {
                    case "xml":
                        if (input.files[0].name.split('.')[1] != "xml") {
                            msg = msg + " Has escogido procesar un archivo .xml pero el archivo que has subido es: " +
                                input.files[0].name.split('.')[1] + " "
                        }
                        break;
                    case "json":
                        if (input.files[0].name.split('.')[1] != "json") {
                            msg = msg + " Has escogido procesar un archivo .json pero el archivo que has subido es: " +
                                input.files[0].name.split('.')[1] + " "
                        }
                        break;
                    case "txt":
                        if (input.files[0].name.split('.')[1] != "txt") {
                            msg = msg + " Has escogido procesar un archivo .txt pero el archivo que has subido es: " +
                                input.files[0].name.split('.')[1] + " "
                        }
                        break;
                    case "token":
                        if (input.files[0].name.split('.')[1] != "txt") {
                            msg = msg + " Has escogido procesar un token pero el archivo que has subido es: " +
                                input.files[0].name.split('.')[1] + " "
                        }
                        break;
                }


            }

        } else {
            msg = msg + "Ingrese un delimitador porfavor "
        }
    } else {
        msg = msg + "Ingrese un archivo para procesar porfavor "
    }
    return msg

}