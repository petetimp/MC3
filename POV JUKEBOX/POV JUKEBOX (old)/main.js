var videoArray=["ninja_video.mp4","ninja_video2.mp4"];

jQuery(document).ready(
    function(){
        var myVideo=document.getElementById("video-player");

        jQuery("#returnBtn").click(
            function(){
                location.href="../index.html";
            }
        );

        jQuery(".control,.thumbnail").hover(
            function(){
                jQuery(this).addClass("hover");
            },
            function(){
                jQuery(this).removeClass("hover");
            }
        );

        jQuery(".control").on("tap",
            function(){
                console.log("tapped");
                jQuery(this).addClass("hover");
                setTimeout(
                    function(){
                        jQuery(".control").removeClass("hover");
                    },400
                );   
            }
        );
        jQuery("#play, #play-button").click(
            function(){
               if(myVideo.paused){
                   jQuery("#play-button").attr("src","Video_play_down.png");
                   
                   setTimeout(function(){
                       jQuery("#play-button").css("display","none");
                       myVideo.play();
                   },1000);
                     
               }else{
                   myVideo.pause();
                   jQuery("#play-button").attr("src","Video_play.png");
                   jQuery("#play-button").css("display","block");
               }
               jQuery("#play").toggleClass("switch");
            }
        );

        jQuery(".thumbnail").click(
            function(){
                jQuery(".thumbnail").removeClass("selected");
                jQuery(this).addClass("selected");
                var videoIndex=jQuery(this).attr("data-video");
                playVideo(videoIndex);
            }
        );

        function playVideo(index){
            var videoSrc=videoArray[index];
            jQuery("#video-player").attr("src",videoSrc);
            myVideo.play();
            jQuery("#play").addClass("switch");
            jQuery("#play-button").css("display","none");
            
        }

        jQuery("#rewind").click(
            function(){
                forwardRewind(-3);  
            }
        );

        jQuery("#forward").click(
            function(){
                forwardRewind(3);  
            }
        );

        jQuery("#restart").click(
            function(){
                reloadVideo();
            }
        );

        if (typeof(Storage) !== "undefined") {
            console.log("local storage good");
            if(localStorage.getItem("on-site")!="yes"){
                console.log("first time on site");
                myVideo.play();
                jQuery("#play-button").css("display","none");
                jQuery("#play").toggleClass("switch");
                localStorage.setItem("on-site", "yes");
            }
        } else {
            //console.log("Sorry! No Web Storage support..");
        }

        /*Function to Reload video from Beginning*/
        function reloadVideo() {
            myVideo.currentTime = 0;
            myVideo.play();
            jQuery("#play").toggleClass("switch");
            jQuery("#play-button").css("display","none");
        }

        /*Function to Forward & Rewind*/
        function forwardRewind(param) {
            myVideo.currentTime += param;
        }
    }
);


