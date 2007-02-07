/**
* @module button
* @description <p>The button module enables the creation of rich, graphical 
* buttons that function like traditional HTML form buttons.  With the optional 
* menu module, the button module can be used to create menu buttons and split 
* buttons; widgets that are not available natively in HTML.  In total, the 
* button module supports the following types:</p>
* 
* <dl>
* <dt>button</dt>
* <dd>Basic push button that can execute a user-specified command when 
* pressed.</dd>
* <dt>submit</dt>
* <dd>Submits the parent form when pressed.</dd>
* <dt>reset</dt>
* <dd>Resets the parent form when pressed.</dd>
* <dt>checkbox</dt>
* <dd>Maintains a "checked" state that can be toggled on and off.</dd>
* <dt>radio</dt>
* <dd>Maintains a "checked" state that can be toggled on and off.  Use with 
* the ButtonGroup class to create a set of controls that are mutually 
* exclusive; checking one button in the set will uncheck all others in the 
* group.</dd>
* <dt>menubutton</dt>
* <dd>When pressed will show/hide a menu.</dd>
* <dt>splitbutton</dt>
* <dd>Can execute a user-specified command or display a menu when pressed.</dd>
* </dl>
* @title Button Library
* @namespace YAHOO.widget
* @requires yahoo, dom, element, event
* @optional container, menu
* @beta
*/


(function() {

// Shorthard for utilities

var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.lang,


    // Private member variables

    m_oButtons = {},
    m_oFocusedButton = null;



//  Constructor


/**
* The Button class Creates a rich, graphical button.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;input&#62;</code>, <code>&#60;a&#62;</code> or 
* <code>&#60;span&#62;</code> element to be used to create the button.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="http://www.w3.org/
* TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-
* 48250443">HTMLAnchorElement</a>|<a href="http://www.w3.org/TR/2000/WD-
* DOM-Level-1-20000929/level-one-html.html#ID-33759296">HTMLElement</a>} 
* p_oElement Object reference for the <code>&#60;input&#62;</code>, 
* <code>&#60;a&#62;</code> or <code>&#60;span&#62;</code> element to be 
* used to create the button.
* @param {Object} p_oElement Object literal specifying a set of attributes 
* used to configure the button.
* @param {Object} p_oAttributes Optional. Object literal specifying a set of 
* attributes used to configure the button.
* @namespace YAHOO.widget
* @class Button
* @constructor
* @extends YAHOO.util.Element
*/
YAHOO.widget.Button = function(p_oElement, p_oAttributes) {

    var fnSuperClass = YAHOO.widget.Button.superclass.constructor;

    if(
        arguments.length == 1 && 
        !Lang.isString(p_oElement) && 
        !p_oElement.nodeName
    ) {

        if(!p_oElement.id) {

            p_oElement.id = Dom.generateId();

            YAHOO.log(
                "No value specified for the button's \"id\" attribute. " +
                "Setting  button id to \"" + p_oElement.id + "\".",
                "warn"
            );

        }

        this.logger = new YAHOO.widget.LogWriter("Button " + p_oElement.id);

        this.logger.log(
                "No source HTML element.  "  +
                "Building the button using the set of attributes."
            );

        fnSuperClass.call(
            this,
            (this._createButtonElement(p_oElement.type)),
            p_oElement
        );

    }
    else {

        var oConfig = {
        
            element: null,
            attributes: (p_oAttributes || {})
            
        };


        if(Lang.isString(p_oElement)) {

            var me = this;

            Event.onAvailable(p_oElement, function() {

                var sTagName = this.tagName.toUpperCase();
            
                if(sTagName == me.TAG_NAME) {
            
                    oConfig.attributes.id = this.id;
            
                }
                else if(sTagName == "INPUT" && !oConfig.attributes.id) {
            
                    oConfig.attributes.id = Dom.generateId();
            
                    YAHOO.log(
                        "No value specified for the button's \"id\" " +
                        "attribute. Setting button id to \"" + 
                        oConfig.attributes.id + "\".",
                        "warn"
                    );
                
                }
            
                me.logger = new YAHOO.widget.LogWriter(
                                    "Button " + oConfig.attributes.id
                                        );
            
                me.logger.log(
                        "Building the button using an existing HTML " + 
                        "element as a source element." 
                    );
            
            
                oConfig.attributes.srcelement = this;
            
                initConfig.call(me, oConfig);
            
            
                if(!oConfig.element) {
            
                    me.logger.log(
                            "Source element could not be used as is.  " +
                            "Creating a new HTML element for the button."
                        );
            
                    oConfig.element = 
                        me._createButtonElement(oConfig.attributes.type);
            
                }
            
                fnSuperClass.call(me, oConfig.element, oConfig.attributes);

            });

        }
        else {

            var sTagName = p_oElement.tagName.toUpperCase();

            if(sTagName == this.TAG_NAME) {

                if(p_oElement.id) {

                    oConfig.attributes.id = p_oElement.id;
                
                }
                else {

                    oConfig.attributes.id = Dom.generateId();

                    YAHOO.log(
                        "No value specified for the button's \"id\" " +
                        "attribute. Setting button id to \"" + 
                        oConfig.attributes.id + "\".",
                        "warn"
                    );

                }


            }
            else if(sTagName == "INPUT" && !oConfig.attributes.id) {

                oConfig.attributes.id = Dom.generateId();

                YAHOO.log(
                    "No value specified for the button's \"id\" " +
                    "attribute. Setting button id to \"" + 
                    oConfig.attributes.id + "\".",
                    "warn"
                );
            
            }

            this.logger = 
                new YAHOO.widget.LogWriter("Button " + oConfig.attributes.id);

            this.logger.log(
                    "Building the button using an existing HTML element as " + 
                    "a source element." 
                );


            oConfig.attributes.srcelement = p_oElement;
    
            initConfig.call(this, oConfig);
    
    
            if(!oConfig.element) {

                this.logger.log(
                        "Source element could not be used as is.  " +
                        "Creating a new HTML element for the button."
                    );
        
                oConfig.element = 
                    this._createButtonElement(oConfig.attributes.type);
        
            }
        
            fnSuperClass.call(this, oConfig.element, oConfig.attributes);
        
        }

    }

};



// Private methods


/**
* @method getFirstElement
* @description Returns an HTML element's first HTML element node.
* @private
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-58190037">HTMLElement</a>} p_oElement Object 
* reference specifying the element to be evaluated.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-58190037">HTMLElement</a>}
*/
function getFirstElement(p_oElement) {

    var oFirstChild = p_oElement.firstChild;

    if(oFirstChild) {

        if(oFirstChild.nodeType == 1) {

            return oFirstChild;

        }
        else {

            var oNextSibling = oFirstChild.nextSibling;

            if(oNextSibling && oNextSibling.nodeType == 1) {
            
                return oNextSibling;
            
            }

        }

    }

}


/**
* @method createInputElement
* @description Creates an <code>&#60;input&#62;</code> element of the 
* specified type.
* @private
* @param {String} p_sType String specifying the type of 
* <code>&#60;input&#62;</code> element to create.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>}
*/
function createInputElement(p_sType) {

    var oInput;

    if(navigator.userAgent.indexOf("MSIE") != -1) {

        oInput = document.createElement(
                        "<input type=\"" + p_sType + "\" name=\" \">"
                    );

    }
    else {
    
        oInput = document.createElement("input");
        oInput.type = p_sType;

    }


    return oInput;

}


/**
* @method setAttributesFromSrcElement
* @description Gets the values for all the attributes of the source element 
* (either <code>&#60;input&#62;</code> or <code>&#60;a&#62;</code>) that map to
* YAHOO.widget.Button attributes and sets them into a collection that is
* passed to the YAHOO.widget.Button constructor.
* @private
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="http://www.w3.org/
* TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-
* 48250443">HTMLAnchorElement</a>} p_oElement Object reference to the HTML 
* element (either <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code>) 
* used to create the button.
* @param {Object} p_oAttributes Object reference for the collection of 
* attributes used to configure the button.
*/
function setAttributesFromSrcElement(p_oElement, p_oAttributes) {

    var me = this;

    /**
    * @method setAttributeFromDOMAttribute
    * @description Gets the value of the specified DOM attribute and sets it 
    * into the collection of attributes used to configure the button.
    * @private
    * @param {String} p_sAttribute String representing the name of the 
    * attribute to retrieve from the DOM element.
    */
    function setAttributeFromDOMAttribute(p_sAttribute) {

        if( !(p_sAttribute in p_oAttributes) ) {

            /*
                Need to use "getAttributeNode" instead of "getAttribute" 
                because using "getAttribute," IE will return the innerText of 
                a <BUTTON> for the value attribute rather than the value of 
                the "value" attribute.
            */
    
            var oAttribute = p_oElement.getAttributeNode(p_sAttribute);
    

            if(oAttribute && ("value" in oAttribute)) {

                me.logger.log(
                    "Setting attribute \"" + p_sAttribute + "\" using " +
                    "source element's attribute value of \"" + 
                    oAttribute.value + "\""
                );

                p_oAttributes[p_sAttribute] = oAttribute.value;

            }

        }
    
    }


    /**
    * @method setFormElementProperties
    * @description Gets the value of the attributes from the form element and 
    * sets them into the collection of attributes used to configure the button.
    * @private
    */
    function setFormElementProperties() {

        setAttributeFromDOMAttribute("type");

        if( !("disabled" in p_oAttributes) ) {

            p_oAttributes.disabled = p_oElement.disabled;

        }

        setAttributeFromDOMAttribute("name");
        setAttributeFromDOMAttribute("value");
        setAttributeFromDOMAttribute("title");

    }


    var sSrcElementTagName = p_oElement.tagName.toUpperCase();


    if( !("label" in p_oAttributes) ) {

        // Set the "label" property
    
        var sText = sSrcElementTagName == "INPUT" ? 
                        p_oElement.value : p_oElement.innerHTML;
    
    
        if(sText && sText.length > 0) {
            
            p_oAttributes.label = sText;
            
        } 

    }


    setAttributeFromDOMAttribute("tabindex");
    setAttributeFromDOMAttribute("accesskey");


    switch(sSrcElementTagName) {
    
        case "A":
        
            p_oAttributes.type = "link";

            setAttributeFromDOMAttribute("href");
            setAttributeFromDOMAttribute("target");

        break;

        case "INPUT":

            setFormElementProperties();

            if( !("checked" in p_oAttributes) ) {
    
                p_oAttributes.checked = p_oElement.checked;
    
            }

        break;

        case "BUTTON":

            setFormElementProperties();
            
            p_oElement.removeAttribute("name");
            p_oElement.removeAttribute("value");

            p_oElement.setAttribute("type", "button");

        break;
    
    }

}


/**
* @method initConfig
* @description Initializes the set of attributes that are used to instantiate 
* the button.
* @private
* @param {Object} Object representing the button's set of 
* configuration attributes.
*/
function initConfig(p_oConfig) {

    var oAttributes = p_oConfig.attributes,
        oSrcElement = oAttributes.srcelement,
        sSrcElementTagName = oSrcElement.tagName.toUpperCase();


    if(sSrcElementTagName == this.TAG_NAME) {

        p_oConfig.element = oSrcElement;

        var oFirstChild = getFirstElement(p_oConfig.element);

        Dom.addClass(oFirstChild, "first-child");

        if(oFirstChild) {

            var oButton = getFirstElement(oFirstChild);


            if(oButton) {

                var sButtonTagName = oButton.tagName.toUpperCase();


                if(sButtonTagName == "A" || sButtonTagName == "BUTTON") {

                    setAttributesFromSrcElement.call(
                            this, 
                            oButton, 
                            oAttributes
                        );
                
                }
            
            }

        }
    
    }
    else if(sSrcElementTagName == "INPUT") {

        setAttributesFromSrcElement.call(this, oSrcElement, oAttributes);
    
    }

}


YAHOO.extend(YAHOO.widget.Button, YAHOO.util.Element, {


// Protected properties


/** 
* @property _button
* @description Object reference to the button's internal 
* <code>&#60;a&#62;</code> or <code>&#60;button&#62;</code> element.
* @default null
* @protected
* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-48250443">HTMLAnchorElement</a>|<a href="
* http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-
* 34812697">HTMLButtonElement</a>
*/
_button: null,


/** 
* @property _menu
* @description Object reference to the button's menu.
* @default null
* @protected
* @type YAHOO.widget.Menu
*/
_menu: null,


/** 
* @property _onclick
* @description Object reference to the button's current value for the "onclick"
* configuration attribute.
* @default null
* @protected
* @type Object
*/
_onclick: null,


/** 
* @property _activationKeyPressed
* @description Boolean indicating if the key(s) that toggle the button's 
* "active" state have been pressed.
* @default false
* @protected
* @type Boolean
*/
_activationKeyPressed: false,


/** 
* @property _activationButtonPressed
* @description Boolean indicating if the mouse button that toggles the button's
* "active" state has been pressed.
* @default false
* @protected
* @type Boolean
*/
_activationButtonPressed: false,


/** 
* @property _hasKeyEventHandlers
* @description Boolean indicating if the button's "blur", "keydown" and 
* "keyup" event handlers are assigned
* @default false
* @protected
* @type Boolean
*/
_hasKeyEventHandlers: false,


/** 
* @property _hasMouseEventHandlers
* @description Boolean indicating if the button's "mouseout" and "mousedown" 
* and "mouseup" event handlers are assigned
* @default false
* @protected
* @type Boolean
*/
_hasMouseEventHandlers: false,


/** 
* @property _checkable
* @description Boolean indicating if the button is of type "radio" or "checbox." 
* @default false
* @protected
* @type Boolean
*/
_checkable: false,



// Constants


/**
* @property TAG_NAME
* @description The name of the tag to be used for the button's root element. 
* @default "SPAN"
* @final
* @type String
*/
TAG_NAME: "SPAN",


/**
* @property CHECK_ACTIVATION_KEYS
* @description Array of numbers representing keys that (when pressed) toggle 
* the button's "checked" attribute.
* @default [32]
* @final
* @type Array
*/
CHECK_ACTIVATION_KEYS: [32],


/**
* @property ACTIVATION_KEYS
* @description Array of numbers representing keys that (when presed) toggle 
* the button's "active" state.
* @default [13, 32]
* @final
* @type Array
*/
ACTIVATION_KEYS: [13, 32],


/**
* @property OPTION_AREA_WIDTH
* @description Width (in pixels) of the area of a split button that when 
* pressed will display a menu.
* @default 20
* @final
* @type Number
*/
OPTION_AREA_WIDTH: 20,


/**
* @property CSS_CLASS_NAME
* @description String representing the CSS class(es) to be applied to the 
* button's root element.
* @default "yuibutton"
* @final
* @type String
*/
CSS_CLASS_NAME: "yuibutton",


/**
* @property RADIO_DEFAULT_TITLE
* @description String representing the default title applied to buttons of 
* type "radio." 
* @default "Unchecked.  Click to check."
* @final
* @type String
*/
RADIO_DEFAULT_TITLE: "Unchecked.  Click to check.",


/**
* @property RADIO_CHECKED_TITLE
* @description String representing the title applied to buttons of type "radio" 
* when checked.
* @default "Checked.  Click to uncheck."
* @final
* @type String
*/
RADIO_CHECKED_TITLE: "Checked.  Click to uncheck.",


/**
* @property CHECKBOX_DEFAULT_TITLE
* @description String representing the default title applied to buttons of 
* type "checkbox." 
* @default "Unchecked.  Click to check."
* @final
* @type String
*/
CHECKBOX_DEFAULT_TITLE: "Unchecked.  Click to check.",


/**
* @property CHECKBOX_CHECKED_TITLE
* @description String representing the title applied to buttons of type 
* "checkbox" when checked.
* @default "Checked.  Click to uncheck."
* @final
* @type String
*/
CHECKBOX_CHECKED_TITLE: "Checked.  Click to uncheck.",


/**
* @property MENUBUTTON_DEFAULT_TITLE
* @description String representing the default title applied to buttons of 
* type "menubutton." 
* @default "Menu collapsed.  Click to expand."
* @final
* @type String
*/
MENUBUTTON_DEFAULT_TITLE: "Menu collapsed.  Click to expand.",


/**
* @property MENUBUTTON_MENU_VISIBLE_TITLE
* @description String representing the title applied to buttons of type 
* "menubutton" when the button's menu is visible. 
* @default "Menu expanded.  Click or press Esc to collapse."
* @final
* @type String
*/
MENUBUTTON_MENU_VISIBLE_TITLE: 
    "Menu expanded.  Click or press Esc to collapse.",


/**
* @property SPLITBUTTON_DEFAULT_TITLE
* @description  String representing the default title applied to buttons of 
* type "splitebutton." 
* @default "Menu collapsed.  Click inside option region or press Ctrl + Shift + M to show the menu."
* @final
* @type String
*/
SPLITBUTTON_DEFAULT_TITLE: 
    "Menu collapsed.  Click inside option region or press Ctrl + Shift + M to show the menu.",


/**
* @property SPLITBUTTON_OPTION_VISIBLE_TITLE
* @description String representing the title applied to buttons of type 
* "splitbutton" when the button's menu is visible. 
* @default "Menu expanded.  Press Esc or Ctrl + Shift + M to hide the menu."
* @final
* @type String
*/
SPLITBUTTON_OPTION_VISIBLE_TITLE: 
    "Menu expanded.  Press Esc or Ctrl + Shift + M to hide the menu.",


/**
* @property SUBMIT_TITLE
* @description String representing the title applied to buttons of 
* type "submit." 
* @default "Click to submit form."
* @final
* @type String
*/
SUBMIT_TITLE: "Click to submit form.",



// Protected attribute setter methods


/**
* @method _setType
* @description Sets the value of the button's "type" attribute.
* @protected
* @param {String} p_sType String indicating the value for the button's 
* "type" attribute.
*/
_setType: function(p_sType) {

    this._checkable = (p_sType == "checkbox" || p_sType == "radio");
    
    if(p_sType == "splitbutton") {

        this.on("option", this._onOption);

    }

},


/**
* @method _setLabel
* @description Sets the value of the button's "label" attribute.
* @protected
* @param {String} p_sLabel String indicating the value for the button's 
* "label" attribute.
*/
_setLabel: function(p_sLabel) {

    this._button.innerHTML = p_sLabel;                

},


/**
* @method _setTabIndex
* @description Sets the value of the button's "tabindex" attribute.
* @protected
* @param {Number} p_nTabIndex Number indicating the value for the button's 
* "tabindex" attribute.
*/
_setTabIndex: function(p_nTabIndex) {

    this._button.tabIndex = p_nTabIndex;

},


/**
* @method _setTitle
* @description Sets the value of the button's "title" attribute.
* @protected
* @param {String} p_nTabIndex Number indicating the value for the button's 
* "title" attribute.
*/
_setTitle: function(p_sTitle) {

    if(this.get("type") != "link") {

        var sTitle = p_sTitle;

        if(!sTitle) {


            var sType = this.get("type");

            switch(sType) {

                case "radio":

                    sTitle = this.RADIO_DEFAULT_TITLE;

                break;

                case "checkbox":

                    sTitle = this.CHECKBOX_DEFAULT_TITLE;

                break;
                
                case "menubutton":

                    sTitle = this.MENUBUTTON_DEFAULT_TITLE;

                break;

                case "splitbutton":

                    sTitle = this.SPLITBUTTON_DEFAULT_TITLE;

                break;

                case "submit":

                    sTitle = this.SUBMIT_TITLE;

                break;

            }

        }

        this._button.title = sTitle;

    }

},


/**
* @method _setDisabled
* @description Sets the value of the button's "disabled" attribute.
* @protected
* @param {Boolean} p_bDisabled Boolean indicating the value for the button's 
* "disabled" attribute.
*/
_setDisabled: function(p_bDisabled) {

    if(this.get("type") != "link") {

        if(p_bDisabled) {

            if(this.hasFocus()) {
            
                this.blur();
            
            }

            this._button.setAttribute("disabled", "disabled");

            this.addClass("disabled");

        }
        else {

            this._button.removeAttribute("disabled");

            this.removeClass("disabled");
        
        }

    }

},


/**
* @method _setAccessKey
* @description Sets the value of the button's "accesskey" attribute.
* @protected
* @param {String} p_sAccessKey String indicating the value for the button's 
* "accesskey" attribute.
*/
_setAccessKey: function(p_sAccessKey) {

    this._button.accessKey = p_sAccessKey;

},


/**
* @method _setHref
* @description Sets the value of the button's "href" attribute.
* @protected
* @param {String} p_sHref String indicating the value for the button's 
* "href" attribute.
*/
_setHref: function(p_sHref) {

    if(this.get("type") == "link") {

        this._button.href = p_sHref;
    
    }

},


/**
* @method _setTarget
* @description Sets the value of the button's "target" attribute.
* @protected
* @param {String} p_sTarget String indicating the value for the button's 
* "target" attribute.
*/
_setTarget: function(p_sTarget) {

    if(this.get("type") == "link") {

        this._button.setAttribute("target", p_sTarget);
    
    }

},


/**
* @method _setChecked
* @description Sets the value of the button's "target" attribute.
* @protected
* @param {Boolean} p_bChecked Boolean indicating the value for the button's 
* "checked" attribute.
*/
_setChecked: function(p_bChecked) {

    if(this._checkable) {

        var sType = this.get("type"),
            sTitle;

        if(p_bChecked) {

            this.addClass("checked");
            
            sTitle = (sType == "radio") ? 
                        this.RADIO_CHECKED_TITLE : 
                        this.CHECKBOX_CHECKED_TITLE;
        
        }
        else {

            this.removeClass("checked");

            sTitle = (sType == "radio") ? 
                        this.RADIO_DEFAULT_TITLE : 
                        this.CHECKBOX_DEFAULT_TITLE;
        
        }

        this.set("title", sTitle);

    }

},


/**
* @method _setOnClick
* @description Sets the value of the button's "onclick" attribute.
* @protected
* @param {Object} p_oObject Object indicating the value for the button's 
* "onclick" attribute.
*/
_setOnClick: function(p_oObject) {

    /*
        Remove any existing listeners if a "click" event handler has already 
        been specified.
    */

    if(this._onclick && (this._onclick != p_oObject)) {

        this.removeListener("click", this._onclick.fn);

        this._onclick = null;

    }


    if(
        !this._onclick && 
        Lang.isObject(p_oObject) && 
        Lang.isFunction(p_oObject.fn)
    ) {

        this.on("click", p_oObject.fn, p_oObject.obj, p_oObject.scope);

        this._onclick = p_oObject;

    }

},


/**
* @method _setMenu
* @description Sets the value of the button's "menu" attribute.
* @protected
* @param {Object} p_oMenu Object indicating the value for the button's 
* "menu" attribute.
*/
_setMenu: function(p_oMenu) {

    if(!YAHOO.widget.Menu) {

        this.logger.log("YAHOO.widget.Menu dependency not met.", "error");

        return false;
    
    }

    var oMenu;

    function initMenu() {
    
        if(oMenu) {
    
            oMenu.showEvent.subscribe(this._onMenuShow, this, true);
            oMenu.hideEvent.subscribe(this._onMenuHide, this, true);
            oMenu.keyDownEvent.subscribe(this._onMenuKeyDown, this, true);
    
            var oSrcElement = oMenu.srcElement;
    
            if(oSrcElement && oSrcElement.tagName.toUpperCase() == "SELECT") {
    
                oSrcElement.style.display = "none";
    
                oMenu.renderEvent.subscribe(this._onMenuRender, this, true);
    
            }
    
            oMenu.cfg.setProperty(
                        "container", 
                        (
                            this.get("container") || 
                            this.get("srcelement").parentNode || 
                            document.body
                        )
                    );
    
            this._menu = oMenu;
    
        }
        else {
    
            this._menu.destroy();
            this._menu = null;
    
        }
    
    }


    if(p_oMenu instanceof YAHOO.widget.Menu) {

        oMenu = p_oMenu;
        
        initMenu.call(this);

    }
    else if(Lang.isArray(p_oMenu)) {

        var me = this;

        this.on("appendTo", function() {

            oMenu = new YAHOO.widget.Menu(
                                        Dom.generateId(), 
                                        { lazyload: true, itemdata: p_oMenu }
                                    );
    
            initMenu.call(me);
        
        });

       
    }
    else if(Lang.isString(p_oMenu)) {

        var me = this;

        Event.onContentReady(p_oMenu, function() {

            oMenu = new YAHOO.widget.Menu(this, { lazyload: true });

            initMenu.call(me);
        
        });
    
    }
    else if(p_oMenu && p_oMenu.nodeName) {

        oMenu = new YAHOO.widget.Menu(p_oMenu, { lazyload: true });
    
        initMenu.call(this);
    
    }

},



// Protected methods


/**
* @method _createButtonElement
* @description Creates the button's element.
* @protected
* @param {String} p_sType String indicating the type of element to create.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
* level-one-html.html#ID-58190037">HTMLElement</a>}
*/
_createButtonElement: function(p_sType) {

    var sTagName = this.TAG_NAME,
        oElement = document.createElement(sTagName);

    oElement.innerHTML =  
    
        "<" + sTagName + " class=\"first-child\">" + 
        (p_sType == "link" ? "<a></a>" : "<button type=\"button\"></button>") + 
        "</" + sTagName + ">";

    return oElement;

},


/**
* @method _isActivationKey
* @description Determines if the specified keycode is one that toggles the 
* button's "active" state.
* @protected
* @param {Number} p_nKeyCode Number representing the keycode to be evaluated.
* @return {Boolean}
*/
_isActivationKey: function(p_nKeyCode) {

    var aKeyCodes = this._checkable ? 
            this.CHECK_ACTIVATION_KEYS : this.ACTIVATION_KEYS,

        nKeyCodes = aKeyCodes.length;

    if(nKeyCodes > 0) {

        var i = nKeyCodes - 1;

        do {

            if(p_nKeyCode == aKeyCodes[i]) {

                return true;

            }

        }
        while(i--);
    
    }

},


/**
* @method _isSplitButtonOptionKey
* @description Determines if the specified keycode is one that toggles the 
* display of the split button's menu.
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @return {Boolean}
*/
_isSplitButtonOptionKey: function(p_oEvent) {

    return (
        p_oEvent.ctrlKey && 
        p_oEvent.shiftKey && 
        Event.getCharCode(p_oEvent) == 77
    );

},


_originalMaxHeight: -1,


/**
* @method _showMenu
* @description Shows the button's menu.
* @protected
*/
_showMenu: function() {

    var oMenu = this._menu;

    if(oMenu) {

        YAHOO.widget.MenuManager.hideVisible();

        oMenu.cfg.applyConfig({
                context:[this.get("id"), "tl", "bl"], 
                clicktohide: false,
                constraintoviewport: false,
                visible: true
            });
            
        oMenu.cfg.fireQueue();

        var nViewportHeight = Dom.getViewportHeight(),
            nMenuHeight = oMenu.element.offsetHeight;


        if((oMenu.cfg.getProperty("y") + nMenuHeight) > nViewportHeight) {

            this.logger.log("Current menu position will place a portion, or " +
                "the entire menu outside the boundary of the viewport.  " + 
                "Repositioning the menu to stay inside the viewport.");

            oMenu.align("bl", "tl");

            var nY = oMenu.cfg.getProperty("y"),

                nScrollTop = (
                                document.documentElement.scrollTop || 
                                document.body.scrollTop
                            );
            

            if(nScrollTop >= nY) {

                if(this._originalMaxHeight == -1) {

                    this._originalMaxHeight = 
                            oMenu.cfg.getProperty("maxheight");

                }

                oMenu.cfg.setProperty(
                            "maxheight", 
                            (nMenuHeight - ((nScrollTop - nY) + 20))
                        );

                oMenu.align("bl", "tl");

            }

        }

        oMenu.cfg.setProperty("constraintoviewport", true);

    }            

},


/**
* @method _hideMenu
* @description Hides the button's menu.
* @protected
*/
_hideMenu: function() {

    var oMenu = this._menu;

    if(oMenu && oMenu.cfg.getProperty("visible")) {

        oMenu.hide();

    }

},


/**
* @method _submitForm
* @description Submits the form to which the button belongs.
* @protected
*/
_submitForm: function() {

    var oForm = this.getForm();

    if(oForm) {

        YAHOO.widget.Button.addHiddenFieldsToForm(oForm);

        this.createHiddenField();
        
        oForm.submit();
    
    }

},



// Protected event handlers


/**
* @method _onMouseOver
* @description "mouseover" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseOver: function(p_oEvent) {

    if(!this.get("disabled")) {

        if(!this._hasMouseEventHandlers) {

            this.on("mouseout", this._onMouseOut);
            this.on("mousedown", this._onMouseDown);
            this.on("mouseup", this._onMouseUp);

            this._hasMouseEventHandlers = true;

        }

        this.addClass("hover");

        if(this._activationButtonPressed) {

            this.addClass("active");

        }


        if(this._bOptionPressed) {

            this.addClass("activeoption");
        
        }

    }

},


/**
* @method _onMouseOut
* @description "mouseout" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseOut: function(p_oEvent) {

    if(!this.get("disabled")) {

        this.removeClass("hover");

        if(this.get("type") != "menubutton") {

            this.removeClass("active");

        }

        if(this._activationButtonPressed || this._bOptionPressed) {

            Event.on(document, "mouseup", this._onDocumentMouseUp, this, true);

        }

    }
    
},


/**
* @method _onDocumentMouseUp
* @description "mouseup" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onDocumentMouseUp: function(p_oEvent, p_oButton) {

    this._activationButtonPressed = false;
    this._bOptionPressed = false;

    var sType = this.get("type");

    if(sType == "menubutton" || sType == "splitbutton") {

        this.removeClass((sType == "menubutton" ? "active" : "activeoption"));

        this._hideMenu();

    }

    Event.removeListener(document, "mouseup", this._onDocumentMouseUp);

},


/**
* @method _onMouseDown
* @description "mousedown" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseDown: function(p_oEvent) {

    if(!this.get("disabled")) {

        if((p_oEvent.which || p_oEvent.button) == 1) {

            if(!this.hasFocus()) {
            
                this.focus();
            
            }


            var sType = this.get("type");


            if(sType == "splitbutton") {
            
                var oElement = this.get("element"),
                    nX = Event.getPageX(p_oEvent) - Dom.getX(oElement);

                if(
                    (
                        oElement.offsetWidth - 
                        this.OPTION_AREA_WIDTH
                    ) < nX
                ) {
                    
                    this.fireEvent("option", p_oEvent);

                }
                else {

                    this.addClass("active");

                    this._activationButtonPressed = true;

                }

            }
            else if(sType == "menubutton") {

                if(this.hasClass("active")) {

                    this._hideMenu();

                    this._activationButtonPressed = false;

                }
                else {

                    this._showMenu();

                    this._activationButtonPressed = true;
                
                }

            }
            else {
    
                this.addClass("active");

                this._activationButtonPressed = true;
            
            }



            if(sType == "splitbutton" || sType == "menubutton") {

                var me = this;

                
                function onMouseUp() {
                
                    me._hideMenu();
                    me.removeListener("mouseup", onMouseUp);
                
                }


                this._hideMenuTimerId = window.setTimeout(function() {
                
                    me.on("mouseup", onMouseUp);
                
                }, 250);

            }

        }

    }
    
},


/**
* @method _onMouseUp
* @description "mouseup" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onMouseUp: function(p_oEvent) {

    if(!this.get("disabled")) {


        if(this._hideMenuTimerId) {

            window.clearTimeout(this._hideMenuTimerId);

        }


        if(this._checkable) {

            this.set("checked", !(this.get("checked")));
        
        }


        this._activationButtonPressed = false;
        

        if(this.get("type") != "menubutton") {

            this.removeClass("active");
        
        }
    
    }
    
},


/**
* @method _onFocus
* @description "focus" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button that
* fired the event.
*/
_onFocus: function(p_oEvent, p_oButton) {

    if(!this.get("disabled")) {

        this.addClass("focus");

        if(this._activationKeyPressed) {

            this.addClass("active");
       
        }

        m_oFocusedButton = this;


        if(!this._hasKeyEventHandlers) {

            var oElement = this._button;

            Event.on(oElement, "blur", this._onBlur, this, true);
            Event.on(oElement, "keydown", this._onKeyDown, this, true);
            Event.on(oElement, "keyup", this._onKeyUp, this, true);

            this._hasKeyEventHandlers = true;

        }


        this.fireEvent("focus", p_oEvent);

    }

},


/**
* @method _onBlur
* @description "blur" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onBlur: function(p_oEvent, p_oButton) {

    if(!this.get("disabled")) {

        this.removeClass("focus");

        if(this.get("type") != "menubutton") {

            this.removeClass("active");

        }    

        if(this._activationKeyPressed) {

            Event.on(document, "keyup", this._onDocumentKeyUp, this, true);

        }


        m_oFocusedButton = null;

        this.fireEvent("blur", p_oEvent);

    }
   
},


/**
* @method _onDocumentKeyUp
* @description "keyup" event handler for the document.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onDocumentKeyUp: function(p_oEvent, p_oButton) {

    if(this._isActivationKey(Event.getCharCode(p_oEvent))) {

        this._activationKeyPressed = false;
        
        Event.removeListener(document, "keyup", this._onDocumentKeyUp);
    
    }

},


/**
* @method _onKeyDown
* @description "keydown" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onKeyDown: function(p_oEvent, p_oButton) {

    if(!this.get("disabled")) {

        if(
            this.get("type") == "splitbutton" && 
            this._isSplitButtonOptionKey(p_oEvent)
        ) {

            this.fireEvent("option", p_oEvent);

        }
        else if(this._isActivationKey(Event.getCharCode(p_oEvent))) {

            if(this.get("type") == "menubutton") {

                this._showMenu();

            }
            else {

                this._activationKeyPressed = true;
                
                this.addClass("active");
            
            }
        
        }


        var oMenu = this._menu;

        if(
            oMenu && oMenu.cfg.getProperty("visible") && 
            Event.getCharCode(p_oEvent) == 27
        ) {
        
            oMenu.hide();
            this.focus();
        
        }

    }

},


/**
* @method _onKeyUp
* @description "keyup" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onKeyUp: function(p_oEvent, p_oButton) {

    if(!this.get("disabled")) {

        if(this._isActivationKey(Event.getCharCode(p_oEvent))) {


            if(this._checkable) {

                this.set("checked", !(this.get("checked")));
            
            }

            this._activationKeyPressed = false;

            if(this.get("type") != "menubutton") {

                this.removeClass("active");

            }

        }

    }

},


/**
* @method _onClick
* @description "click" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onClick: function(p_oEvent) {

    var sType = this.get("type");

    switch(sType) {

        case "submit":

            this._submitForm();
        
        break;

        case "reset":

            var oForm = this.getForm();

            if(oForm) {

                oForm.reset();
            
            }

        break;

        case "splitbutton":

            this._hideMenu();

            var oSrcElement = this.get("srcelement");

            if(oSrcElement && oSrcElement.type == "submit") {

                this._submitForm();
            
            }
        
        break;

    }

},


/**
* @method _onAppendTo
* @description "appendTo" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onAppendTo: function(p_oEvent) {

    var oForm = this.getForm();
    
    if(oForm) {

        Event.on(oForm, "reset", this._onFormReset, this, true);
        Event.on(oForm, "submit", this._onFormSubmit, this, true);
    
    }

},


/**
* @method _onFormSubmit
* @description "submit" event handler for the button's form.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onFormSubmit: function(p_oEvent, p_oButton) {

    var sType = this.get("type"),
        oMenu = this.getMenu();
    
    
    if(sType == "radio" || sType == "checkbox") {
    
        YAHOO.log("Creating hidden field for button: " + this);
    
        this.createHiddenField();
    
    }
    else if(oMenu) {
    
        var oSrcElement = oMenu.srcElement;
    
        if(
            !oSrcElement || 
            (oSrcElement && oSrcElement.tagName.toUpperCase() != "SELECT")
        ) {
    
            var aItems = oMenu.getItems(),
                nItems = aItems.length,
                oValue = null,
                oItem = null;
            
        
            for(var n=0; n<nItems; n++) {
            
                oItem = aItems[n];
                
                if(oItem.cfg.getProperty("selected")) {
        
                    oValue = (!oItem.value || oItem.value === "") ? 
                                oItem.cfg.getProperty("text") : 
                                oItem.value;
    
                    break;
                
                }
            
            }
            
    
            if(oValue) {
    
                var oField = createInputElement("hidden");
    
                oField.name = this.get("name") + "_options";
                oField.value = oValue;
    
                this.getForm().appendChild(oField);
    
            }
    
        }                
    
    }

},


/**
* @method _onFormReset
* @description "reset" event handler for the button's form.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onFormReset: function(p_oEvent, p_oButton) {

    if(this._checkable) {

        this.resetValue("checked");

    }
    
},


/**
* @method _onDocumentMouseDown
* @description "mousedown" event handler for the document.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onDocumentMouseDown: function(p_oEvent, p_oButton) {

    var oTarget = Event.getTarget(p_oEvent),
        oButtonElement = this.get("element"),
        oMenuElement = this._menu.element;

    if(
        oTarget != oButtonElement && 
        !Dom.isAncestor(oButtonElement, oTarget) && 
        oTarget != oMenuElement && 
        !Dom.isAncestor(oMenuElement, oTarget)
    ) {

        this._hideMenu();

        Event.removeListener(
                document, 
                "mousedown", 
                this._onDocumentMouseDown
            );    
    
    }

},


/**
* @method _onOption
* @description "option" event handler for the button.
* @protected
* @param {Event} p_oEvent Object representing the DOM event object passed 
* back by the event utility (YAHOO.util.Event).
*/
_onOption: function(p_oEvent) {

    if(this.hasClass("activeoption")) {

        this._hideMenu();

        this._bOptionPressed = false;

    }
    else {

        this._showMenu();    

        this._bOptionPressed = true;

    }

},


/**
* @method _onMenuShow
* @description "show" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onMenuShow: function(p_sType, p_aArgs, p_oButton) {

    Event.on(document, "mousedown", this._onDocumentMouseDown, this, true);

    var sTitle,
        sClass;
    
    if(this.get("type") == "splitbutton") {

        sTitle = this.SPLITBUTTON_OPTION_VISIBLE_TITLE;
        sClass = "activeoption";
    
    }
    else {

        sTitle = this.MENUBUTTON_MENU_VISIBLE_TITLE;        
        sClass = "active";

    }

    this.addClass(sClass);
    this.set("title", sTitle);

},


/**
* @method _onMenuHide
* @description "hide" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onMenuHide: function(p_sType, p_aArgs, p_oButton) {
    
    if(this._originalMaxHeight != -1) {
    
        this._menu.cfg.setProperty("maxheight", this._originalMaxHeight);

    }


    var sTitle,
        sClass;
    
    if(this.get("type") == "splitbutton") {
    
        sTitle = this.SPLITBUTTON_DEFAULT_TITLE;
        sClass = "activeoption";
    
    }
    else {

        sTitle = this.MENUBUTTON_DEFAULT_TITLE;        
        sClass = "active";
    }


    this.removeClass(sClass);
    this.set("title", sTitle);

},


/**
* @method _onMenuKeyDown
* @description "keydown" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onMenuKeyDown: function(p_sType, p_aArgs, p_oButton) {

    var oEvent = p_aArgs[0];

    if(Event.getCharCode(oEvent) == 27) {

        this.focus();

        if(this.get("type") == "splitbutton") {
        
            this._bOptionPressed = false;
        
        }

    }

},


/**
* @method _onMenuRender
* @description "render" event handler for the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.Button} p_oButton Object representing the button.
*/
_onMenuRender: function(p_sType, p_aArgs, p_oButton) {

    var aItems = this._menu.getItems(),
        nItems = aItems.length,
        oItem;

    if(nItems > 0) {

        var i = nItems - 1;

        do {

            oItem = aItems[i];

            if(oItem) {

                oItem.cfg.setProperty("onclick", {
                
                    fn: this._onMenuItemClick,
                    obj: oItem,
                    scope: this
                
                });

            }
        
        }
        while(i--);

    }

},


/**
* @method _onMenuItemClick
* @description "click" event handler for the items in the button's menu.
* @private
* @param {String} p_sType String representing the name of the event that 
* was fired.
* @param {Array} p_aArgs Array of arguments sent when the event was fired.
* @param {YAHOO.widget.MenuItem} p_oItem Object representing the menu item 
* that fired the event.
*/
_onMenuItemClick: function(p_sType, p_aArgs, p_oItem) {

    this._menu.srcElement.selectedIndex = p_oItem.index;

    if(this.get("srcelement").type == "submit") {

        this._submitForm();

    }

},



// Public methods


/**
* @method createHiddenField
* @description Creates the button's hidden form field and appends it to its
* parent form.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>}
*/
createHiddenField: function () {

    if(!this.get("disabled")) {

        var oField = createInputElement(
                        (this._checkable ? this.get("type") : "hidden")
                    );
    
    
        oField.id = this.get("id");
        oField.name = this.get("name");
        oField.value = this.get("value");
    
        if(this._checkable) {
    
            oField.checked = this.get("checked");
            oField.style.display = "none";        
        }
    

        var oForm = this.getForm();
    
        if(oForm) {
    
            oForm.appendChild(oField);
        
        }


        return oField;

    }

},


/**
* @method init
* @description The Button class's initialization method.
* @param {String} p_oElement String specifying the id attribute of the 
* <code>&#60;input&#62;</code>, <code>&#60;a&#62;</code> or 
* <code>&#60;span&#62;</code> element to be used to create the button.
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-6043025">HTMLInputElement</a>|<a href="http://www.w3.org/
* TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-
* 48250443">HTMLAnchorElement</a>|<a href="http://www.w3.org/TR/2000/WD-
* DOM-Level-1-20000929/level-one-html.html#ID-33759296">HTMLElement</a>} 
* p_oElement Object reference for the <code>&#60;input&#62;</code>, 
* <code>&#60;a&#62;</code> or <code>&#60;span&#62;</code> element to be 
* used to create the button.
* @param {Object} p_oElement Object literal specifying a set of attributes 
* used to configure the button.
* @param {Object} p_oAttributes Optional. Object literal specifying a set of 
* attributes used to configure the button.
*/
init: function(p_oElement, p_oAttributes) {

    var sTagName = p_oAttributes.type == "link" ? "A" : "BUTTON",
        oSrcElement = p_oAttributes.srcelement;


    this._button = p_oElement.getElementsByTagName(sTagName)[0];


    YAHOO.widget.Button.superclass.init.call(
            this, p_oElement, 
            p_oAttributes
        );


    m_oButtons[this.get("id")] = this;


    this.addClass(this.CSS_CLASS_NAME);
    this.addClass(this.get("type"));

    Event.on(this._button, "focus", this._onFocus, this, true);
    this.on("mouseover", this._onMouseOver);
    this.on("click", this._onClick);
    this.on("appendTo", this._onAppendTo);
    
    var oContainer = this.get("container"),
        oElement = this.get("element");


    if(oContainer) {

        if(Lang.isString(oContainer)) {

            var me = this;

            Event.onContentReady(oContainer, function() {

                me.appendTo(this);            
            
            });

        }
        else {

            this.appendTo(oContainer);

        }

    }
    else if(
        !Dom.inDocument(oElement) && 
        oSrcElement && 
        oSrcElement.tagName.toUpperCase() == "INPUT"
    ) {

        var oParentNode = oSrcElement.parentNode;

        if(oParentNode) {

            this.fireEvent("beforeAppendTo", {
                type: "beforeAppendTo",
                target: oParentNode
            });
    
            oParentNode.replaceChild(oElement, oSrcElement);
    
            this.fireEvent("appendTo", {
                type: "appendTo",
                target: oParentNode
            });
        
        }

    }
    else if(
        Dom.inDocument(oElement) && 
        oSrcElement.tagName.toUpperCase() == "SPAN"
    ) {

        var oForm = this.getForm();
        
        if(oForm) {
    
            Event.on(oForm, "reset", this._onFormReset, this, true);
            Event.on(oForm, "submit", this._onFormSubmit, this, true);
        
        }

    }


    this.logger.log("Initialization completed.");

},


/**
* @method initAttributes
* @description Initializes all of the attributes used to configure the button.
* @param {Object} p_oAttributes Object literal specifying a set of 
* attributes used to configure the button.
*/
initAttributes: function(p_oAttributes) {

    var oAttributes = p_oAttributes || {};

    YAHOO.widget.Button.superclass.initAttributes.call(this, oAttributes);


    /**
    * @config type
    * @description String specifying the button's type.  Possible values are: 
    * "button," "link," "submit," "reset," "checkbox," "radio," "menubutton," 
    * and "splitbutton."
    * @default "button"
    * @type String
    */
    this.setAttributeConfig("type", {

        value: (oAttributes.type || "button"),
        validator: Lang.isString,
        writeOnce: true,
        method: this._setType

    });


    /**
    * @config label
    * @description String specifying the button's text label or innerHTML.
    * @default null
    * @type String
    */
    this.setAttributeConfig("label", {

        value: oAttributes.label,
        validator: Lang.isString,
        method: this._setLabel

    });


    /**
    * @config value
    * @description Object specifying the value for the button.
    * @default null
    * @type Object
    */
    this.setAttributeConfig("value", {

        value: oAttributes.value

    });


    /**
    * @config name
    * @description String specifying the name for the button.
    * @default null
    * @type String
    */
    this.setAttributeConfig("name", {

        value: oAttributes.name,
        validator: Lang.isString

    });


    /**
    * @config tabindex
    * @description Number specifying the tabindex for the button.
    * @default null
    * @type Number
    */
    this.setAttributeConfig("tabindex", {

        value: oAttributes.tabindex,
        validator: Lang.isNumber,
        method: this._setTabIndex

    });


    /**
    * @config title
    * @description String specifying the title for the button.
    * @default null
    * @type String
    */
    this.configureAttribute("title", {

        value: oAttributes.title,
        validator: Lang.isString,
        method: this._setTitle

    });


    /**
    * @config disabled
    * @description Boolean indicating if the button should be disabled.  
    * (Disabled buttons are dimmed and will not respond to user input 
    * or fire events.)
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("disabled", {

        value: (oAttributes.disabled || false),
        validator: Lang.isBoolean,
        method: this._setDisabled

    });


    /**
    * @config href
    * @description String specifying the href for the button.  Applies only to 
    * buttons of type "link."
    * @type String
    */
    this.setAttributeConfig("href", {

        value: oAttributes.href,
        validator: Lang.isString,
        method: this._setHref

    });


    /**
    * @config target
    * @description String specifying the target for the button.  Applies only  
    * to buttons of type "link."
    * @type String
    */
    this.setAttributeConfig("target", {

        value: oAttributes.target,
        validator: Lang.isString,
        method: this._setTarget

    });


    /**
    * @config checked
    * @description Boolean indicating if the button is checked.  Applies only
    * to buttons of type "radio" and "checkbox."
    * @default false
    * @type Boolean
    */
    this.setAttributeConfig("checked", {

        value: (oAttributes.checked || false),
        validator: Lang.isBoolean,
        method: this._setChecked

    });


	/**
	* @config container
	* @description HTML element reference or string specifying the id 
	* attribute of the HTML element that the button's markup should be 
	* rendered into.
	* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
	* level-one-html.html#ID-58190037">HTMLElement</a>|String
	* @default null
	*/
    this.setAttributeConfig("container", {

        value: oAttributes.container

    });


	/**
	* @config srcelement
    * @description Object reference to the HTML element (either 
    * <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code>) used to 
    * create the button.
	* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
	* level-one-html.html#ID-58190037">HTMLElement</a>|String
	* @default null
	*/
    this.setAttributeConfig("srcelement", {

        value: oAttributes.srcelement,
        writeOnce: true

    });


	/**
	* @config onclick
    * @description Object literal representing the code to be executed when 
    * the button is clicked.  Format:<br> <code> {<br> 
    * <strong>fn:</strong> Function,   &#47;&#47; The handler to call when the 
    * event fires.<br> <strong>obj:</strong> Object, &#47;&#47; An object to 
    * pass back to the handler.<br> <strong>scope:</strong> Object &#47;&#47; 
    * The object to use for the scope of the handler.<br> } </code>
    * @type Object
	* @default null
	*/
    this.setAttributeConfig("onclick", {

        value: oAttributes.onclick,
        method: this._setOnClick
    
    });


	/**
	* @config menu
    * @description Object reference to the HTML element (either 
    * <code>&#60;input&#62;</code> or <code>&#60;span&#62;</code>) used to 
    * create the button.
	* @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
	* level-one-html.html#ID-58190037">HTMLElement</a>|String
	* @default null
	*/
    this.setAttributeConfig("menu", {

        value: null,
        method: this._setMenu
    
    });

},


/**
* @method focus
* @description Causes the button to receive the focus and fires the button's
* "focus" event.
*/
focus: function() {

    if(!this.get("disabled")) {

        this._button.focus();
    
    }

},


/**
* @method blur
* @description Causes the button to lose focus and fires the button's
* "blur" event.
*/
blur: function() {

    if(!this.get("disabled")) {

        this._button.blur();

    }

},


/**
* @method hasFocus
* @description Returns a boolean indicating whether or not the button has focus.
* @return {Boolean}
*/
hasFocus: function() {

    return (m_oFocusedButton == this);

},


/**
* @method isActive
* @description Returns a boolean indicating whether or not the button is active.
* @return {Boolean}
*/
isActive: function() {

    return this.hasClass("active");

},


/**
* @method getMenu
* @description Returns a reference to the button's menu.
* @return {YAHOO.widget.Menu}
*/
getMenu: function() {

    return this._menu;

},


/**
* @method getForm
* @description Returns a reference to the button's menu.
* @return {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-40002357">HTMLFormElement</a>}
*/
getForm: function() {

    return this._button.form;

},


/**
* @method destroy
* @description Removes the button's element from its parent element and 
* removes all event handlers.
*/
destroy: function() {

    this.logger.log("Destroying ...");

    var oElement = this.get("element"),
        oParentNode = oElement.parentNode,
        oMenu = this._menu;

    if(oMenu) {

        this.logger.log("Destroying menu.");

        oMenu.destroy();

    }

    this.logger.log("Removing DOM event handlers.");

    Event.purgeElement(oElement);
    Event.purgeElement(this._button);
    Event.removeListener(document, "mouseup", this._onDocumentMouseUp);
    Event.removeListener(document, "keyup", this._onDocumentKeyUp);
    Event.removeListener(document, "mousedown", this._onDocumentMouseDown);

    var oForm = this.getForm();
    
    if(oForm) {

        Event.removeListener(oForm, "reset", this._onFormReset);
    
    }


    oParentNode.removeChild(oElement);

    this.logger.log("Removing from document.");

    delete m_oButtons[this.get("id")];

    this.logger.log("Destroyed.");

},


/**
* @method toString
* @description Returns a string representing the button.
* @return {String}
*/
toString: function() {

    return ("Button " + this.get("id"));

}

});


/**
* @method addHiddenFieldsToForm
* @description Searches the specified form and adds hidden fields for instances 
* of YAHOO.widget.Button that are of type "radio," "checkbox," "menubutton," 
* and "splitbutton."
* @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
* one-html.html#ID-40002357">HTMLFormElement</a>} p_oForm Object reference 
* for the form to search.
*/
YAHOO.widget.Button.addHiddenFieldsToForm = function(p_oForm) {

    var aButtons = Dom.getElementsByClassName("yuibutton", "*", p_oForm),
        nButtons = aButtons.length;


    if(nButtons > 0) {

        YAHOO.log("Form contains " + nButtons + " YUI buttons.");

        var oButton = null,
            sType = null,
            oMenu = null;

        for(var i=0; i<nButtons; i++) {

            oButton = m_oButtons[aButtons[i].id];

            if(oButton) {

                sType = oButton.get("type");
                oMenu = oButton.getMenu();


                if(sType == "radio" || sType == "checkbox") {
    
                    YAHOO.log("Creating hidden field for button: " + oButton);
    
                    oButton.createHiddenField();
                
                }
                else if(oMenu) {
    
                    var oSrcElement = oMenu.srcElement;
        
                    if(
                        !oSrcElement || 
                        (
                            oSrcElement && 
                            oSrcElement.tagName.toUpperCase() != "SELECT"
                        )
                    ) {
    
                        var aItems = oMenu.getItems(),
                            nItems = aItems.length,
                            oValue = null,
                            oItem = null;
                        
                    
                        for(var n=0; n<nItems; n++) {
                        
                            oItem = aItems[n];
                            
                            if(oItem.cfg.getProperty("selected")) {
                    
                                oValue = (!oItem.value || oItem.value === "") ? 
                                            oItem.cfg.getProperty("text") : 
                                            oItem.value;
    
                                break;
                            
                            }
                        
                        }
                        
    
                        if(oValue) {
    
                            var oField = createInputElement("hidden");
        
                            oField.name = oButton.get("name") + "_options";
                            oField.value = oValue;
        
                            oButton.getForm().appendChild(oField);
    
                        }
    
                    }                
    
                }
                
            }
        
        }

    }

};


/**
* @event focus
* @description Fires when the menu item receives focus.  Passes back a single 
* object representing the original DOM event object passed back by the event 
* utility (YAHOO.util.Event) when the event was fired.  See <a href="
* YAHOO.util.Element.html#addListener">Element.addListener</a> for more 
* information on listening for this event.
* @type YAHOO.util.CustomEvent
*/


/**
* @event blur
* @description Fires when the menu item loses the input focus.  Passes back a 
* single object representing the original DOM event object passed back by the 
* event utility (YAHOO.util.Event) when the event was fired.  See <a href="
* YAHOO.util.Element.html#addListener">Element.addListener</a> for more 
* information on listening for this event.
* @type YAHOO.util.CustomEvent
*/


/**
* @event option
* @description Fires when the user invokes the button's option.  Passes back a 
* single object representing the original DOM event (either "mousedown" or 
* "keydown") that caused the "option" event to fire.  See <a href="
* YAHOO.util.Element.html#addListener">Element.addListener</a> for more 
* information on listening for this event.
* @type YAHOO.util.CustomEvent
*/

})();