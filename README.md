
# WhatsappCustomShow

- WhatsappCustomShow it's a simple plugin for automize and manage all the dirty things for  whatsapp links:
  - Test valid phone
  - Menages multiple numbers selection 
  - Format wa Link

 

## Install
1. Need  jQuery (almost every version) 

2. Put script in the body after jQuery

        <script src="assets/WhatsappCustomShow.js"></script>

## Usage
Ther are two main way to use the plugin with html hook or via pure Jquery

1.  HTML:
	- Single number es: 
	```<a whatsappShow data-text="Message for you" data-numbers="3470000000" target="_blank"> Example 1</a>```
	- Multiple numbers es:
	 ```<a whatsappShow data-text="Message for you" data-numbers="3470000000,3470000001" target="_blank"> Example 2</a>```

2. jQuery:
	```
        	publicWhatsappShow.createWaLinkOnTheFly("3470000000,347000001", "Message for you", true);		
        ```

## Configuration

This is the default configuration:

```javascript
	{
            numbers: '',            
            text: 'DEFAULT%20MESSAGE',
            numberList: [],
            preventMultipleClick: false,//disable multiple numbers popup and selection
            multiple: false, //internal for info
            preserve: false//if false delete elements if have no valid numbers 
        }
```

## Options

`numbers`
Single or multiple wa numbers comma separated


`text`
Text to send


`preventMultipleClick`
Bool, disable multiple numbers popup and selection. Only single mode


`numbers`
Single or multiple wa numbers comma separated


`preserve`
Bool, if false, if there aren't valid numbers delete the html element


## Functions

`createWaLinkOnTheFly`
Create an WhatsappCustomShow element via code (see ex)

`testMobile`
par:phone,  check if the phone par is a valid mobile phone


