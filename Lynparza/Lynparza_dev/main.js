
var lynparza={
	
    onScreen:1,
	
	userID:null,
	
	eventID:null,
	
	room:null,
	
	team:null,
	
	innerCircleLength:4,

        reset:
            function(){
                jQuery("*").removeClass("completed");
                jQuery("*").removeClass("tap");
                
                jQuery(".option,.inner-circle").removeClass("selected");                

                jQuery("input[type='hidden']").attr("value","");

	        lynparza.room=null;
                lynparza.team=null;
	        lynparza.innerCircleLength=4;
                lynparza.userID=null;
                lynparza.eventID=null;
   
                lynparza.initJSON();

                jQuery(".lynparza-select-options").each(
                    function(){
                        jQuery(this).children(".option.initial").trigger("click");
                    }
                );

                jQuery(".button.next.one.delay").hide();
               
            },

	processJSON:
            function(){
		        //console.log("processJSON");

                //grab the select options for pss, customer, and observer from the server based on the event id and room name
                $.post("https://az-onc.mc3tt.com/tabletop/lynparza_judge/getteams",
                    {
                        event_id: lynparza.eventID,
                        location: lynparza.room
                    },
                    function(data){
                       participants = $.parseJSON(data);
                       console.log(participants);
                       /*remove all options (except initial and 'none assigned') before populating pss, customer, and observer, based on room*/ 
                       jQuery(".json-select .option:not(.no-remove)").remove();
                       for (var i=0; i< participants.length; i++){//create new options and append them to pss/customer/observer select menus
                      
                          jQuery("<div class='option'>" + participants[i]['sublocation'] + "</div>").appendTo(jQuery(".json-select"));
                       }
                       
                       
                    }
                );
                //update the hidden form input with the room name 
                jQuery("input[name='room']").attr("value",lynparza.room);

                //update the hidden form input with the room name 
                jQuery("input[name='team']").attr("value",lynparza.team);
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
                lynparza.userID = userID;//set userID from JSON
                jQuery("input[name='userID']").attr("value",lynparza.userID);//append this value to corresponding hidden form input

                var eventID = parsedJSONData['TTInfoDictionary']['TTInfo'][0][1];
                lynparza.eventID = eventID;//set eventID from JSON
                jQuery("input[name='eventID']").attr("value",lynparza.eventID);//append this value to corresponding hidden form input
            },

        alertMessage:
            function(opening){
                if(opening){
					if(lynparza.onScreen==1){
                        jQuery("#screen-1").hide();  
					}else{
					    jQuery("#screen-2").hide();;	
					}jQuery("section#app").css("background-image","url(offline.png)");
					
                    
                    jQuery("#screen-4").show();
                    
                }else{ 
                    jQuery(".lynparza-alert").addClass("hover");

                    setTimeout(
                        function(){
                            location.href="../index.html";
                        },1000
                    );
                }
            },

        validateRadio:
            function(){
                //if the number of filled in circles equals the number of required circles, show the button
		if(jQuery(".inner-circle.tap.selected").length==lynparza.innerCircleLength){
		    jQuery("#screen-2 input.button.next.delay").show();
                }else{//otherwise hide it
		    jQuery("#screen-2 input.button.next.delay").hide();	
	   	}

            },
	
	setOption:
	    function(element){
			parentElement=element.parents(".lynparza-select-options");
			switch(parentElement.attr("data-select")){
			        case "room-name":
				    lynparza.room=element.html();
				break;
					
				case "team-name":
				    lynparza.team=element.html();
				break;
					
			}
		},
	
	allCompleted:
	    function(){
			var allCompleted=false;
			if(lynparza.onScreen==1){
				
				if (jQuery(".lynparza-select.completed").length == jQuery(".lynparza-select").length) {
                    allCompleted=true;
				}
				
				if(allCompleted){
				    jQuery("section#screen-1 .button").show();
					
				}else{
				    jQuery("section#screen-1 .button").hide();	
				}
				
			}else{
				
			}
		},
	
	processSubmit:
	    function(button,form){
			
                        
			jQuery(button).css("color","#7c4096").css("background-color","white");

                        //submit serialized form data to server
                        $.ajax({
                            url:'https://az-onc.mc3tt.com/tabletop/lynparza_judge/submitform',
                            type:'POST',
                            data:jQuery(form).serialize(),
                            success:
                                function(result){
                                    console.log("success");
                                    //after form submission success, move on to the next screen and remove button state
                                    lynparza.processButton(button);
			            lynparza.removeTap(button);                            
                                }

                        });  
                        
                        lynparza.processButton(button);
			lynparza.removeTap(button);
		},
	
	processOption:
	    function(element){
			
			lynparza.removeTap(element);
			element.addClass("selected");
                        jQuery(".inner-circle").removeClass("selected");

			if(!element.hasClass("initial")){
			    var assocSelect=element.parents(".lynparza-select-options").attr("data-select");
			    assocSelect= "#" + assocSelect;
                            console.log(assocSelect);
			    jQuery(assocSelect).addClass("completed");
				jQuery(assocSelect).children("h1").text(element.text());
				lynparza.allCompleted(element);
				lynparza.setOption(element);
				lynparza.processJSON();
		    }else{
                                console.log("initial running");
				var assocSelect=element.parents(".lynparza-select-options").attr("data-select");
			    assocSelect= "#" + assocSelect;
				jQuery(assocSelect).removeClass("completed");
				jQuery(assocSelect).children("h1").text(element.text());
				lynparza.allCompleted();
				lynparza.setOption(element);
			}
			
	    },
	
	processRadio:
	    function(element){
           
			
			if(element.children().hasClass("selected")){
				//if the element is already selected unselect it
				lynparza.removeTap(element);
				if(jQuery(".inner-circle.tap.selected").length==lynparza.innerCircleLength){
					console.log("equal");
					jQuery("#screen-2 input.button.next.delay").show();
				}else{
					console.log("not equal");
				        jQuery("#screen-2 input.button.next.delay").hide();	
				}
			}else{
				//if the element isn't selected, first unselect all other elements...
				lynparza.removeTap(element);	
				
				//...then select the clicked element
				element.children().addClass("selected");

                                var name=element.attr("data-question");
                                var value=element.attr("data-value");
                                var selector="input[name='"+name +"']"
                                
                                jQuery(selector).attr("value",value);
				
				if(jQuery(".inner-circle.tap.selected").length==lynparza.innerCircleLength){
					console.log("equal");
					jQuery("#screen-2 input.button.next.delay").show();
				}else{
					console.log("not equal");
				        jQuery("#screen-2 input.button.next.delay").hide();	
				}  
			}
		},
		
	processSelect:
	    function(element){
			if(element.hasClass("expanded")){
				//if the element is already selected unselect it
				lynparza.removeTap(element);
			}else{
				//if the element isn't selected, first unselect all other elements...
				lynparza.removeTap(element);	
				
				//...then expand the clicked element
				element.addClass("expanded tap");
				element.children().addClass("tap");
				//element.find("span").css("color","#7c4096");
				    jQuery(".lynparza-select-options").scrollTop(0);
			        element.next(jQuery(".lynparza-select-options")).show();
			}
		},
		
	tap:
	    function(element){
			
			//add a class of tap for css purposes
		    element.addClass("tap");
			
			//if the element has children add class of tap to those elements
			if(element.children().length >= 1){
			    element.find("*").addClass("tap");
				
				//if a button was tapped remove the tap
				if(element.hasClass("button")){
				    lynparza.removeTap(element,true);
				
				//if a select button was tapped process that tap
				}else if(element.hasClass("lynparza-select")){
			        lynparza.processSelect(element);
			    }else{
				    lynparza.processRadio(element);   	
				}
			}
			//process the option tapped
			if((element).hasClass("option")){
				setTimeout(
					function(){
                        element.parents(".lynparza-select-options").hide();
				        lynparza.processOption(element);
					},200
				);
			}
		},
		
	next:
	    function(element){
                if(element.hasClass("one")){
                    lynparza.validateRadio();
		    jQuery("#screen-2").show();
		    lynparza.onScreen=2;
                    jQuery("section#app").css("background-image","url(lyn_header.png)");
                    jQuery("#screen-2 form").scrollTop(0);  
                }else{
                    jQuery("#screen-3").show();
		    lynparza.onScreen=3;
                    jQuery("section#app").css("background-image","url(lyn_blank_background.png)");
                    //lynparza.reset();	
		}
	    },
	 
	prev:
	    function(){
			 jQuery(".lynparza-select-options").hide();
			 //go to first screen
			 jQuery("#screen-1").show();   
                         jQuery("section#app").css("background-image","url(lyn_blank_background.png)"); 
			 lynparza.onScreen=1;
	    },
		
	processButton:
	    function(element){
		if(!element.hasClass("input")){
	            lynparza.tap(element);
                }
		
                	
			
			//move to another screen
		        setTimeout(
			    function(){
							 
			        jQuery("#app-body > section").hide();
					
		            if(element.hasClass("next")){
						//next screen
		                lynparza.next(element);
		            }else{
						//first screen
			            lynparza.prev();	
		            }
					
				},1000
			);
		},
		
    removeTap:
	    function(element,hasChildren){
			//unselect the button 1/4 of a second after we move to another screen
			if(element.hasClass("delay")){
                setTimeout(
			        function(){
				        jQuery(element).removeClass("tap");
				        
                        if((element).hasClass("input")){
                            element.css("color","white").css("background-color","transparent");      
                        }
				   	    
                        if(hasChildren){
			                jQuery(element).find("*").removeClass("tap");
				        }
					        	
			        },1250
			    );
				
			}else if (element.hasClass("lynparza-select")){
			    //collapse all select elements element
				jQuery(".lynparza-select").removeClass("expanded").removeClass("tap");
				jQuery(".lynparza-select").find("*").removeClass("tap");
			    jQuery(".lynparza-select-options").hide();
				
				//change all numbers back to white for unselected state
				//jQuery(".faslodex-select").find("span").css("color","#ffffff");	  	
			}
			
			else if (element.hasClass("option")){
			    element.parents(".lynparza-select-options").children().removeClass("selected");	
			}else if(element.hasClass("radio-inner")){
				element.parents("tr").find(".inner-circle").removeClass("selected");
			}
		}	

};

jQuery(document).ready(
    function(){
		
		//set up initial form info 
                lynparza.initJSON();

                if(!navigator.onLine){
		    lynparza.alertMessage(true);
                }
		
		//fires whenever a button is pressed
		jQuery(".button:not(.input), .button:not(.tap)").on("tap",
                    function(){
                        lynparza.processButton(jQuery(this));       
                    }
                );

                jQuery(document).on('click', '.lynparza-select-options .option', 
                    function(event) {
                        lynparza.tap(jQuery(this));
                    }
                )
		
		//fires when an option is selected
                //fires when select numbers are pressed on first screen
                //fires when radio button is hit
		jQuery(".lynparza-select-options .option, .lynparza-select, .radio-inner").on("tap",
		    function(event){
		        lynparza.tap(jQuery(this));

                        if(!navigator.onLine){
		            lynparza.alertMessage(true);
                        }   
		    }
	        );
		
                //Cleans Up textarea for NOTES: placeholder text
		jQuery('textarea').val("");
		
		//Cleans up html from jQuery Mobile
		jQuery(".ui-btn.ui-input-btn.ui-corner-all.ui-shadow").html("<input type='submit' class='button input next delay' value='SUBMIT'>");
            
                //
                jQuery("#lynparza-form").submit(
                    function(event){
                        event.preventDefault();
                        lynparza.processSubmit(jQuery(".button.input.next.delay"),jQuery(this));
                    }
                );

                //back button (upper left hand corner)
                jQuery("#returnBtn").click(
                    function(){
                        jQuery(this).css("background","url(menu_return_down.png)");
                        setTimeout(
                            function(){
                                location.href="../index.html";
                            },1500
                        );
                    }
                );


                //alert button handler
                jQuery(".lynparza-alert").click(
                    function(){
                        lynparza.alertMessage(false);
                    }
                );

	}
);
