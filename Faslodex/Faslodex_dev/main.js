
var faslodex={
	
    onScreen:1,
	
	pss:null,
	
	room:null,
	
	station:null,
	
	customer:null,
	
	observer:null,
	
	innerCircleLength:8,

        userID:null,

        eventID:null,

        pssID:null,

        customerID:null,

        observerID:null,

        allComplete:false,

        grayOption:
            function(element){
                    jQuery(element).addClass("gray");

                jQuery(".option").each(
                    function(){
                        
                            //add gray class to options
                            if(jQuery(this).text()==element.text()){
                                jQuery(this).addClass("gray");
                            }else{
                                jQuery(this).removeClass("gray");
                            }

                            if( jQuery(this).text()==faslodex.pss || jQuery(this).text()==faslodex.customer || jQuery(this).text()==faslodex.observer){
                                jQuery(this).addClass("gray");
                            }

                    }
                );
            },

        reset:
            function(){
                jQuery("*").removeClass("completed");
                jQuery("*").removeClass("tap");
                
                jQuery(".option,.inner-circle").removeClass("selected");

                jQuery("input[type='hidden']").attr("value","");

                jQuery("input[name='customer'], input[name='observer'], input[name='maroon-1'], input[name='maroon-2'], input[name='purple-1'], input[name='purple-2']").attr("value","0");

                faslodex.pss=null;
	        faslodex.room=null;
	        faslodex.station=null;
	        faslodex.customer=null;
	        faslodex.observer=null;
	        faslodex.innerCircleLength=8;
                faslodex.userID=null;
                faslodex.eventID=null;
                faslodex.pssID=null;
                faslodex.customerID=null;
                faslodex.observerID=null;
                faslodex.allComplete=false;
                faslodex.initJSON();

                jQuery(".faslodex-select-options").each(
                    function(){
                        jQuery(this).children(".option.initial").trigger("click");
                    }
                );

                jQuery(".button.next.one.delay").hide();
               
            },
	
	    compareInputs:
	        function(){
                            /*var exitFunction=false;
			    var pssText=jQuery("#pss h1").text();
				var customerText=jQuery("#customer h1").text();
				var observerText=jQuery("#observer h1").text();
				
				if (pssText == customerText){
                                    
                                    faslodex.allComplete=false;
                                    faslodex.customer=null;
                                    exitFunction=true;
				}else{
                                    
                                }
                               
                                if ((pssText == observerText) || (customerText == observerText && customerText != "None Assigned")){
                                    
                                    faslodex.allComplete=false;
                                    faslodex.observer=null;
                                    exitFunction=true;
				}else{
				    	
				}

                                if (pssText == customerText && pssText == observerText){
                                    faslodex.customer=null;
                                    faslodex.observer=null;
                                    exitFunction=true;
                                }

                                if(!exitFunction){
                                    jQuery(".json-heading").each(
                                        function(){
                                            var jsonSelect=jQuery(this).next(".json-select").children(".option.selected");
                                            if(!jsonSelect.hasClass("initial")){
                                                console.log("no exit function")
                                                jQuery(this).addClass("completed");
                                            }
                                        }
                                    );
                                }

                            return exitFunction;*/
			},

        processInputs://this method sets the form data from the selections from the first screen (excluding room name)
            function(element){
                //console.log("processInputs");
                switch(element.parents(".faslodex-select-options").attr("data-select")){
                    
                    case "pss":
                        faslodex.pssID=jQuery(element).attr("data-userid");
                        jQuery("input[name='pss']").attr("value",faslodex.pssID);
                        break;
                    
                    case "customer":
                        faslodex.customerID=jQuery(element).attr("data-userid");
                        jQuery("input[name='customer']").attr("value",faslodex.customerID);
                        break;
                    
                    case "observer":
                        faslodex.observerID=jQuery(element).attr("data-userid");
                        jQuery("input[name='observer']").attr("value",faslodex.observerID);
                        break;

                    case "station":
                        var stationValue=jQuery("#station h1").text().slice(0,1);
                        jQuery("input[name='station']").attr("value", stationValue);
                        break;
                    
                }
            },

        processJSON:
            function(){
		//console.log("processJSON");

                /*every time this function is called we reset the select values for pss, observer, and customer to avoid incorrect input values on submission*/
                jQuery(".json-heading").removeClass("completed");//Mark the option uncompleted
                jQuery(".json-heading").each(//set the select text back to what it was when the page loaded.
                    function(){
                        var jsonText = jQuery(this).next(".json-select").children(".initial").text();
                        jQuery(this).find("h1").text(jsonText);
                    }
                );
                
                jQuery(".option").removeClass("gray");
                faslodex.pss=null;
                faslodex.customer=null;
                faslodex.observer=null;

                //grab the select options for pss, customer, and observer from the server based on the event id and room name
                $.post("https://az-onc.mc3tt.com/tabletop/fantasy_faslodex/getparticipants",
                    {
                        event_id: faslodex.eventID,
                        location: faslodex.room
                    },
                    function(data){
                       participants = $.parseJSON(data);
                       /*remove all options (except initial and 'none assigned') before populating pss, customer, and observer, based on room*/
                       jQuery(".json-select .option:not(.no-remove)").remove();
                       for (var i=0; i< participants.length; i++){//create new options and append them to pss/customer/observer select menus
                      
                          jQuery("<div class='option' data-userid='" + participants[i]['user_id'] + "'>" + participants[i]['full_name'] + "</div>").appendTo(jQuery(".json-select"));
                       }

                       
                    }
                );
                //update the hidden form input with the room name
                jQuery("input[name='room']").attr("value",faslodex.room);
            },

        initJSON://this method processes information from wwid.js
            function(){
                //console.log("initJSON");
                if(typeof currentJSONString !== 'undefined') {
                    var parsedJSONData = JSON.parse(currentJSONString);
                    var currentcontentstring = parsedJSONData['TTInfoDictionary']['TTInfo'][15][1];
                    var currentcontentarray = currentcontentstring.split(',');
                        fullname = currentcontentarray[2] + " " + currentcontentarray[3];
                } else {
                    fullname = "Mr. Offline";
                }
 
                var userID = parsedJSONData['TTInfoDictionary']['TTInfo'][1][1];
                faslodex.userID = userID;//set userID from JSON
                jQuery("input[name='userID']").attr("value",faslodex.userID);//append this value to corresponding hidden form input

                var eventID = parsedJSONData['TTInfoDictionary']['TTInfo'][0][1];
                faslodex.eventID = eventID;//set eventID from JSON
                jQuery("input[name='eventID']").attr("value",faslodex.eventID);//append this value to corresponding hidden form input
            },

        alertMessage://This method shows an alert message when not connected to the internet
            function(opening){
                //console.log("alert message");
                if(opening){
					if(faslodex.onScreen==1){
                        jQuery("#screen-1").hide();
					}else{
					    jQuery("#screen-2").hide();
					}
					jQuery("section#app").css("background-image","url(offline.png)");
                                        jQuery("#returnBtn").hide();
					jQuery("#screen-4").show();
                    
                }else{
                    jQuery(".faslodex-alert").addClass("hover");

                    setTimeout(
                        function(){
                            location.href="../index.html";
                            /*jQuery("#screen-4").hide();
                            jQuery("section#app").css("background-image","url(faslodex_screen.png)");
                            
                            if(faslodex.onScreen==1){
                        	jQuery("#screen-1").show();
                                jQuery(".faslodex-alert").removeClass("hover");
                                          
			    }else{
		    		jQuery("#screen-2").show();
                                jQuery(".faslodex-alert").removeClass("hover");
                            }*/
                        },1000
                    );
                }
            },

        validateRadio:
            function(){
                //console.log("validateRadio");
                //if the maroon section is not assigned, show the overlay over it
	        if(faslodex.customer=="None Assigned"){
   	    	    jQuery("#maroon-overlay").show();
	   	    faslodex.innerCircleLength=6;
	    	    jQuery("#maroon-section .inner-circle").removeClass("selected");
		}else{//otherwise hide it
		    jQuery("#maroon-overlay").hide();
		}

                //if the purple section is not assigned, show the overlay over it
		if(faslodex.observer=="None Assigned"){
		    jQuery("#purple-overlay").show();
	   	    faslodex.innerCircleLength=6;
		    jQuery("#purple-section .inner-circle").removeClass("selected");
		}else{//otherwise hide it
	            jQuery("#purple-overlay").hide();
		}
			
                //if both customer and observer are not assigned, set the number of required circles to 4
		if(faslodex.customer=="None Assigned" && faslodex.observer=="None Assigned" ){
                    faslodex.innerCircleLength=4;
		}
			
                //if both overlays are hidden, all of the circles will be required
		if(jQuery("#purple-overlay").css("display")=="none" && jQuery("#maroon-overlay").css("display")=="none"){
	            faslodex.innerCircleLength=8;
		}
			
                //if the number of filled in circles equals the number of required circles, show the button
		if(jQuery(".inner-circle.tap.selected").length==faslodex.innerCircleLength){
		    jQuery("#screen-2 input.button.next.delay").show();
                }else{//otherwise hide it
		    jQuery("#screen-2 input.button.next.delay").hide();
	   	}

            },
	
	inputScreen2Data://This method fills in dynamic info on the second screen
	    function(){
                  //console.log("screen 2 data")
                        //pss section data
			jQuery("#orange-section .name-section").html(faslodex.pss);
                        

                        //customer data
			jQuery("#maroon-section .name-section").html(faslodex.customer);
			
                        
			
                        //observer data
			jQuery("#purple-section .name-section").html(faslodex.observer);
                        
			
			
                        //station data
			jQuery("#purple-skew div").html("<strong>STATION </strong>" + faslodex.station);
                        
		},
	
	setOption://This method sets several properties (what's being selected on first screen) for future retrieval
	    function(element){
                  //console.log("setOption");
			parentElement=element.parents(".faslodex-select-options");
			switch(parentElement.attr("data-select")){
			        case "room-name":
					faslodex.room=element.html();
				        //console.log("room-name");
				break;
					
				case "station":
					faslodex.station=element.html();
					//console.log("station");
				break;
					
				case "pss":
					faslodex.pss=element.html();
					//console.log("station");
				break;
					
				case "customer":
					faslodex.customer=element.html();
					//console.log("customer");
				break;
				
				case "observer":
					faslodex.observer=element.html();
					//console.log("observer");
				break;
			}
		},
	
	allCompleted://This method checks whether all steps on the first screen are complete and shows/hides the submit button based on completion
	    function(){
                   
			
			if(faslodex.onScreen==1){
				
				if (jQuery(".faslodex-select.completed").length == jQuery(".faslodex-select").length) {
                                    faslodex.allComplete=true;
				}else{
                                    faslodex.allComplete=false;
                                }
				

				//console.log(allCompleted);
				if(faslodex.allComplete){
				    jQuery("section#screen-1 .button").show();
                                    //jQuery(".notice-text").show();
					
				}else{
				    jQuery("section#screen-1 .button").hide();
                                    //jQuery(".notice-text").hide();
				}
				
			}else{
				
			}
		},

        processTextarea://this method appends text from textareas to hidden form input on the 2nd screen
            function(){
                //append text input from orange textarea to corresponding hidden input
                var orangeVal=jQuery(".orange textarea").val();
                jQuery("input[name='orange-notes']").attr("value",orangeVal);

                //append text input from maroon textarea to corresponding hidden input
                var maroonVal=jQuery(".maroon textarea").val();
                jQuery("input[name='maroon-notes']").attr("value",maroonVal);

                //append text input from purple textarea to corresponding hidden input
                var purpleVal=jQuery(".purple textarea").val();
                jQuery("input[name='purple-notes']").attr("value",purpleVal);
            },
	
	processSubmit://this method fires when form is ready to be submitted
	    function(button,form){
                        //console.log("process submit");
                        //give submit button on 2nd screen down state
			jQuery(button).css("color","white").css("background-color","#7c4096");

                        //submit serialized form data to server
                        $.ajax({
                            url:'https://az-onc.mc3tt.com/tabletop/fantasy_faslodex/submitform',
                            type:'POST',
                            data:jQuery(form).serialize(),
                            success:
                                function(result){
                                    //console.log("success");
                                    //after form submission success, move on to the next screen and remove button state
                                    faslodex.processButton(button);
			            faslodex.removeTap(button);
                                }

                        });
                        
            },
	
	processOption:
	    function(element){
                        			

                        //console.log("process option");
			faslodex.removeTap(element);//unselect the element to reset all previous selections
			
                        element.addClass("selected");//add class of selected to signify that this element is being selected

                        //if we select an option on the first page clear the radio button selections on the second page
                        jQuery(".inner-circle").removeClass("selected");
                        jQuery("#screen-2 textarea").val("");
                        
			
                        if(!element.hasClass("initial")){//only continue if initial class isn't selected

			    var assocSelect=element.parents(".faslodex-select-options").attr("data-select");//create selector for jquery

			    assocSelect= "#" + assocSelect;
                            jQuery(assocSelect).children("h1").text(element.text());//set selection to heading text
				
                            if(assocSelect.substring(1)=="room-name"){
                                faslodex.setOption(element);//see this method for more info
                                faslodex.processJSON();//if room name, run this method to fill in pss/customer/observer
                            
                            }else if(assocSelect.substring(1)=="pss" || assocSelect.substring(1)=="customer" || assocSelect.substring(1)=="observer"){//else append selected option data to hidden inputs
                                faslodex.processInputs(element,true);
                                faslodex.setOption(element);//see this method for more info
                               
                                if(element.text() != "None Assigned"){
                                    faslodex.grayOption(element);
                                }
                                
                               
                            }else{
                                faslodex.processInputs(element);
                                faslodex.setOption(element);
                            }
                          
                            jQuery(assocSelect).addClass("completed");

		    }else{//if initial option is selected
				var assocSelect=element.parents(".faslodex-select-options").attr("data-select");//create selector for jquery
			        assocSelect= "#" + assocSelect;
				jQuery(assocSelect).removeClass("completed");//initial option will not be complete, therefore, remove this class
				jQuery(assocSelect).children("h1").text(element.text());//set selection to heading text
 
		    }

                        faslodex.allCompleted();//run this method to hide submit button
		        //faslodex.setOption(element);//see this method for more info

                    
			
	    },
	
	processRadio:
	    function(element){
                  //console.log("process Radio");
			if(element.children().hasClass("selected")){
				//if the element is already selected unselect it
				faslodex.removeTap(element);
				if(jQuery(".inner-circle.tap.selected").length==faslodex.innerCircleLength){
					console.log("equal");
					jQuery("#screen-2 input.button.next.delay").show();
				}else{
					console.log("not equal");
				        jQuery("#screen-2 input.button.next.delay").hide();
				}
			}else{
				//if the element isn't selected, first unselect all other elements...
				faslodex.removeTap(element);
				
				//...then select the clicked element
				element.children().addClass("selected");
                               
                                var name=element.attr("data-question");
                                var value=element.attr("data-value");
                                var selector="input[name='"+name +"']"
                                
                                jQuery(selector).attr("value",value);
				
				if(jQuery(".inner-circle.tap.selected").length==faslodex.innerCircleLength){
					//console.log("equal");
					jQuery("#screen-2 input.button.next.delay").show();
				}else{
					//console.log("not equal");
				        jQuery("#screen-2 input.button.next.delay").hide();
				}
			}
		},
		
	processSelect:
	    function(element){
                        //console.log("process Select");
			if(element.hasClass("expanded")){
				//if the element is already selected unselect it
				faslodex.removeTap(element);
			}else{
				//if the element isn't selected, first unselect all other elements...
				faslodex.removeTap(element);
				
				//...then expand the clicked element
				element.addClass("expanded tap");
				element.children().addClass("tap");
				//element.find("span").css("color","#7c4096");
			        element.next(jQuery(".faslodex-select-options")).show();
				    jQuery(".faslodex-select-options").scrollTop(0);
			}
		},
		
	tap:
	    function(element){
			//console.log("tap");
			//add a class of tap for css purposes
		    element.addClass("tap");
			
			//if the element has children add class of tap to those elements
			if(element.children().length >= 1){
			    element.find("*").addClass("tap");
				
				//if a button was tapped remove the tap
				if(element.hasClass("button")){
				    faslodex.removeTap(element,true);
				
				//if a select button was tapped process that tap
				}else if(element.hasClass("faslodex-select")){
			        faslodex.processSelect(element);
			    }else{
				    faslodex.processRadio(element);
				}
			}
			//process the option tapped
			if(element.hasClass("option")){
                            setTimeout(
				function(){
					    element.parents(".faslodex-select-options").hide();
				    },400
				);
                                if(!element.hasClass("gray")){
		   		    faslodex.processOption(element);
                                }
			}
		},
		
	next:
	    function(element){
                //console.log("next");
			        //go to 2nd screen
			if(element.hasClass("one")){
			    faslodex.inputScreen2Data();
            	faslodex.validateRadio();
			    jQuery("#screen-2").show();
			  	faslodex.onScreen=2;
			}else{
				//go to 3rd screen
				jQuery("#screen-3").show();
		        faslodex.onScreen=3;
                            //faslodex.reset();
			}
	    },
	 
	prev:
	    function(){
                       //console.log("prev");
			 jQuery(".faslodex-select-options").hide();
			 //go to first screen
			 jQuery("#screen-1").show();
                         jQuery("section#app").css("background-image","url(faslodex_screen.png)");
			 faslodex.onScreen=1;
	    },
		
	processButton:
	    function(element){
		//console.log("processButton");
		if(!element.hasClass("input")){
	            faslodex.tap(element);
                }
			
			
			//move to another screen
		        setTimeout(
			    function(){
							 
			        jQuery("#app-body > section").hide();
					
		            if(element.hasClass("next")){
						//next screen
		                faslodex.next(element);
		            }else{
						//first screen
			            faslodex.prev();
		            }
					
				},1000
			);
		},
		
    removeTap:
	    function(element,hasChildren){
                        //console.log("removeTap");
			//unselect the button 1/4 of a second after we move to another screen
			if(element.hasClass("delay")){
                            setTimeout(
			        function(){
				        jQuery(element).removeClass("tap");
				        
                                        if((element).hasClass("input")){
                                            element.css("color","#7c4096").css("background-color","transparent");
                                        }
				   	    
                                        if(hasChildren){
			                    jQuery(element).find("*").removeClass("tap");
				        }
					        	
			        },1250
			    );
				
			}else if (element.hasClass("faslodex-select")){
			    //collapse all select elements element
				jQuery(".faslodex-select").removeClass("expanded").removeClass("tap");
				jQuery(".faslodex-select").find("*").removeClass("tap");
			        jQuery(".faslodex-select-options").hide();
				
				//change all numbers back to white for unselected state
				//jQuery(".faslodex-select").find("span").css("color","#ffffff");
			}
			
			else if (element.hasClass("option")){
			    element.parents(".faslodex-select-options").children().removeClass("selected");
			}else if(element.hasClass("radio-inner")){
				element.parents(".radio-section").find(".inner-circle").removeClass("selected");
			}
		}

};

jQuery(document).ready(
    function(){
                if(!navigator.onLine){
		    faslodex.alertMessage(true);
                }
                
                //set up initial form info
                faslodex.initJSON();
		
		//fires whenever a button is pressed
		jQuery(".button:not(.input)").on("tap",
                    function(){
                        faslodex.processButton(jQuery(this));
                    }
                );
		
		
		//fires when an option is selected
                //fires when select numbers are pressed on first screen
                //fires when radio button is hit
		jQuery(".faslodex-select-options .option, .faslodex-select, .radio-inner").on("tap",
		    function(event){
                        //event.stopPropagation();
		        faslodex.tap(jQuery(this));
                        if(!navigator.onLine){
		            faslodex.alertMessage(true);
                        }
		    }
	        );
                
                jQuery(document).on('click', '.faslodex-select-options .option',
                    function(event) {
                        if(!navigator.onLine){
		            faslodex.alertMessage(true);
                        }
                        faslodex.tap(jQuery(this));
                    }
                );
		
                //Cleans Up textarea for NOTES: placeholder text
		jQuery('textarea').val("");
		
		//Cleans up html from jQuery Mobile
		jQuery(".ui-btn.ui-input-btn.ui-corner-all.ui-shadow").html("<input type='submit' class='button input next delay' value='SUBMIT'>");
            
                //
                jQuery("#faslodex-form").submit(
                    function(event){
                        event.preventDefault();
                        faslodex.processTextarea();
                        faslodex.processSubmit(jQuery(".button.input.next.delay"),jQuery(this));
                    }
                );

                //back button (upper left hand corner)
                jQuery("#returnBtn").click(
                    function(){
                        jQuery(this).css("background","url(menu_return.png)");
                        setTimeout(
                            function(){
                                location.href="../index.html";
                            },1500
                        );
                    }
                );


                //alert button handler
                jQuery(".faslodex-alert").click(
                    function(){
                        faslodex.alertMessage(false);
                    }
                );

	}
);
