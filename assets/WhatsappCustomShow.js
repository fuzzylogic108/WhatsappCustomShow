var publicWhatsappShow = null;
(function ($) {

    //example
    //<a whatsappShow data-text="provawa" data-numbers="3470684311,3330684311" target="_blank"> prova wa</a>
    $.fn.whatsappShow = function (options) {

        // Default options
        var settings = $.extend({
            numbers: '',
            text: 'Click%20on%20SEND%20to%20ensert%20text%20message',
            numberList: [],
            numberListOrg: [],
            preventMultipleClick: false,
            multiple: false,
            waevent: null,
            preserve: false,
            url: "https://api.whatsapp.com/send?phone=",
            urlWF: "https://api.whatsapp.com/send?"
        }, options);
        
            //on desktop
            //settings.url = "whatsapp://send?phone=";
            //settings.urlWF = "whatsapp://send?";
        
        
        setElement(this, settings);

        $(this).on("wa-tels-assign", function (event, tels, reset, preserve) {

            return assignPhones(this, tels, reset, preserve);

        });

        return this;

    };
    //privates functions

    //recover settings for various pourposes
    function recoverSettings (element) {

        return $(element)[0].waSettings || null;
    };

    
    function assignPhones(element, tels, reset, preserve) {

        var settings = recoverSettings(element);

        settings.numbers = reset ?
            tels || "" :
            settings.numbers.length ? settings.numbers + "," + tels : tels;

        //reset preserve
        settings.preserve = preserve || false;

        return setElement(element, settings);

    };

    function setElement (element, settings) {

        var _element;

        if (element) {
            _element = element;

        }

        //check
        if (!_element) return;

       
        settings = settings || recoverSettings(_element);

        if (settings.numbers == null && !settings.preserve)
            return $(_element).remove();//remove element if not preserve or not numbers present

        settings.numberList = settings.numbers.split(',');
        settings.numberListOrg = settings.numbers.split(',');

        //delete invalid phones
        settings.numberList = settings.numberList.filter(function (telefono, index, arr) {


            if (!publicWhatsappShow.testMobile(telefono))
                return false;

            return true;
        });
        // fix phonmes numbers with international prefix
        $.each(settings.numberList, function (index, telefono) {

            var phoneNumLib = TPhoneUtil.parse(telefono);
            var phone = phoneNumLib.phone;
            var countryCode = phoneNumLib.countryCode;

            settings.numberList[index] = countryCode.replace('+', '') + phone;


        });

        if (settings.numberList.length == 0 && !settings.preserve)
            return $(_element).remove();///remove element if not preserve or not numbers present

        if (settings.numberList.length == 0) {

          
            $(_element).attr("href", settings.urlWF + "text=" + settings.text);

        } else if (settings.numberList.length == 1) {//add href
            settings.multiple = false;
            $(_element).attr("href", settings.url + settings.numberList[0] + "&text=" + settings.text);
            $(_element).addClass("walinkevent");

        }
        else {
            //create function for alert multiple numbers selection
            settings.multiple = true;
            $(_element).css("cursor", "pointer");

            $(_element).on("click", function () {
               
                if (!settings.preventMultipleClick)
                    publicWhatsappShow.doModal(settings.numberList, settings.numberListOrg, settings.text, settings.url);
            });
        }
        if (settings.multiple == false)
            $(_element).click(function () {
             
                // if you wanrt to send event
                if (settings.waevent != null) {
               
                   
                }
                //else
                  //  ga2gtm('Immobile', 'ImmobileInviaWhatsapp');

            });
        $(_element)[0].waSettings = settings;

        return this;
    };
    //public object and functions
    publicWhatsappShow = {

        //build modal for 
        doModal: function (numbers, numbersOrg, text, url) {
            html = '<div id="dynamicModalWa" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
            html += '<div class="modal-dialog modal-sm">';
            html += '<div class="modal-content">';
            html += '<div class="modal-header">';
            html += '<a class="close" data-dismiss="modal">×</a>';
            html += '<h4> Numeri a cui inviare</h4>';
            html += '</div>';
            html += '<div class="modal-body">';
            html += '<div class="form-group">';
            $.each(numbers, function (index, phone) {
                html += '<a class="walinkevent" href="' + url + phone + '&text=' + text + '" alt="Invio immobile tramite messaggio Whatsapp " target="_blank">';
                html += ' <i class="animation-icon-scale  green fa fa-2x fab fa-whatsapp" style="color: #25D366;"></i> ' + numbersOrg[index];
                html += '</a><br/><br/>';
            });
        
            html += '</div>';




            html += '</div>';
            html += '<div class="modal-footer">';
            html += '<span class="btn btn-danger" data-dismiss="modal">Chiudi</span>';
            html += '</div>';  // content
            html += '</div>';  // dialog
            html += '</div>';  // footer
            html += '</div>';  // modalWindow
            $('body').append(html);
            $("#dynamicModalWa").css("z-index", 1100);
            $("#dynamicModalWa").modal();
            $("#dynamicModalWa").modal('show');


            $(".walinkevent").click(function () {
             
                if (settings.waevent != null) {
                    eval(settings.waevent);
                }
               
            });


            $('#dynamicModalWa').on('hidden.bs.modal', function (e) {
                $('#dynamicModalWa').remove();
                $(".walinkevent").unbind("click");
            });

        },

        //valid phone
        testMobile: function (telefono) {
            
            return TPhoneUtil.isValidNumber(telefono);
        },
        // create link for click (for ios ad es...)
        createWaLinkOnTheFly: function (numbers, text, autoclick = false) {
            var link = document.createElement("a");
            link.target = "_blank";
            $(link).whatsappShow({ numbers: numbers, text: text });
            if (autoclick) link.click();
            return link;
        },
        //init all elements with whatsappshow attributes
        init: function (preventMultipleClick = false) {
            
            $("a[whatsappshow]").each(function () {
                var numbers = $(this).data('numbers') || "";
                var text = $(this).data('text');
                var preserve = $(this).data('preserve');
                var waevent = $(this).data('waevent') || null;
                if (waevent == "") waevent = null;
                $(this).whatsappShow({
                    numbers: numbers.toString(),
                    text: text,
                    preserve: preserve,
                    preventMultipleClick: preventMultipleClick,
                    waevent: waevent
                });



            });
        }
    };

    //ready init 
    publicWhatsappShow.init();

}(jQuery));