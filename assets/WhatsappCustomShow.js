var publicWhatsappShow = null;
(function ($) {
    
    //Example
    //<a whatsappShow data-text="provawa" data-numbers="3470000000,347000001" target="_blank"> test wa</a>
    $.fn.whatsappShow = function (options) {

        // Default options
        var settings = $.extend({
            numbers: '',            
            text: 'DEFAULT%20MESSAGE',
            numberList: [],
            preventMultipleClick: false,//disable multiple numbers popup and selection
            multiple: false, //internal for info
            preserve: false//if false delete elements if have no valid numbers 
        }, options);
        //private function

        setElement(this, settings);

        $(this).on("wa-tels-assign", function (event, tels, reset, preserve) {

            return assignPhones(this, tels, reset, preserve);

        });

        return this;

    };

    recoverSettings = function (element) {

        return $(element)[0].waSettings || null;
    };

    assignPhones = function (element, tels, reset, preserve) {

        var settings = recoverSettings(element);

        settings.numbers = reset ?
            tels || "" :
            settings.numbers.length ? settings.numbers + "," + tels : tels;

        //riassegna il preserve
        settings.preserve = preserve || false;

        return setElement(element, settings);

    };
    
    setElement = function (element, settings) {

        var _element;

        if (element) {
            _element = element;

        }

        //check
        if (!_element) return;

        //settings
        settings = settings || recoverSettings(_element);

        if (settings.numbers == null && !settings.preserve)
            return $(_element).remove();//rimuovo l'elemento se non ho numeri o se non è richiesto il preserve

        settings.numberList = settings.numbers.split(',');

        //deletes all non valid phone
        settings.numberList = settings.numberList.filter(function (phone, index, arr) {

            if (!publicWhatsappShow.testMobile(phone))
                return false;

            return true;
        });
        // fix for numbers because wa recognizes only the format (for it ) 39number
        $.each(settings.numberList, function (index, phone) {

            if (phone.startsWith("+") > -1)
                phone = phone.padStart(1);
            if (phone.startsWith("00" ) > -1)
                phone = phone.padStart(2);
            //if (phone.startsWith("+") == -1 && phone.startsWith("00") == -1)
            //    settings.numberList[index] = "39" + phone;


        });

        if (settings.numberList.length == 0 && !settings.preserve)
            return $(_element).remove();//delete element if not preserve and no number 

        if (settings.numberList.length == 0) {

            //preserve is true but should delete the href
            $(_element).attr("href", "");

        }else if (settings.numberList.length == 1) {//add href if not exists

            settings.multiple = false;
            $(_element).attr("href", "https://api.whatsapp.com/send?phone=" + settings.numberList[0] + "&text=" + settings.text);

        }
        else {
            //function to create popup numbers selection
            settings.multiple = true;
            $(_element).css("cursor", "pointer");

            $(_element).on("click", function () {

                if (!settings.preventMultipleClick)
                    publicWhatsappShow.doModal(settings.numberList, settings.text);
            });
        }


        $(_element)[0].waSettings = settings;

        return this;
    };
    
    publicWhatsappShow = {
        doModal: function (phones, text) {
            html = '<div id="dynamicModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
            html += '<div class="modal-dialog modal-sm">';
            html += '<div class="modal-content">';
            html += '<div class="modal-header">';
            html += '<a class="close" data-dismiss="modal">×</a>';
            html += '<h4>Select numbers </h4>';
            html += '</div>';
            html += '<div class="modal-body">';
            html += '<div class="form-group">';
            $.each(phones, function (index, phone) {
                html += '<a href="https://api.whatsapp.com/send?phone=' + phone + '&text=' + text + '" alt="Send to whatsapp" target="_blank">';
                html += ' <i class="animation-icon-scale waGreen fab fa-2x fa-whatsapp"></i> ' + phone;
                html += '</a><br/><br/>';
            });

            html += '</div>';




            html += '</div>';
            html += '<div class="modal-footer">';
            html += '<span class="btn btn-primary" data-dismiss="modal">Close</span>';
            html += '</div>';  // content
            html += '</div>';  // dialog
            html += '</div>';  // footer
            html += '</div>';  // modalWindow
            $('body').append(html);
            $("#dynamicModal").modal();
            $("#dynamicModal").modal('show');

            $('#dynamicModal').on('hidden.bs.modal', function (e) {
                $(this).remove();
            });

        },
        testMobile: function (phone) {
            const regex = /^((00|\+)\d{2,3}[\. ]??)??3\d{2}[\. ]??\d{6,7}$/gm;
            //delete all not valid phones
            if (regex.test(phone))
                return true;
            else
                return false;
        },
        createWaLinkOnTheFly: function (numbers, text, autoclick = false) {
            var link = document.createElement("a");
            link.target = "_blank";
            $(link).whatsappShow({ numbers: numbers, text: text });
            if (autoclick) link.click();
            return link;
        },
        init: function (preventMultipleClick = false) {
            //init all elements that have whatsappshow attribiute
            $("a[whatsappshow]").each(function () {
                var numbers = $(this).data('numbers') || "";
                var text = $(this).data('text');
                var preserve = $(this).data('preserve');
                $(this).whatsappShow({
                    numbers: numbers.toString(),
                    text: text,
                    preserve: preserve,
                    preventMultipleClick: preventMultipleClick
                });



            });
        }
    };
    //init in jquery ready
    publicWhatsappShow.init();
    
}(jQuery));