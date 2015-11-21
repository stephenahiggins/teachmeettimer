/*
	TeachMeet Countdown TImer v0.1. 
	By: Stephen Higgins (stephenahiggins@icloud.com)
	Based on the original code by: marc.fuehnen(at)gmail.com
	
*/

var cont_colours = { 
	0: '236, 240, 241', //Standard
	1: '230, 126, 34', //Amber 
	2: '231, 76, 60', //Red 
} 

var countup = {mins:0, secs: 0}; 

function update_timer_from_user(){
    $('#cd_m').html($('#cd_mins').val());
    $('#cd_s').html($('#cd_seconds').val());
}

$(document).ready(function() {
	//Hide / Show Settings 
	$('#timer_settings').hide();
	$('#btn_settings_toggle').click(function(){ 
			$('#timer_settings').toggle();
		}
	);
	
	 update_timer_from_user();
	
	// When user defined minutes and seconds are changed, change the display 
	jQuery('#cd_mins').on('input', function() {
	    update_timer_from_user();
	});
	
	jQuery('#cd_seconds').on('input', function() {
	    update_timer_from_user();
	});
   
	
    (function($){
        $.extend({
            APP : {                
                formatTimer : function(a) {
                    if (a < 10) {
                        a = '0' + a;
                    }                              
                    return a;
                },    
				
                startTimer : function(dir) {
                    var a;
                    // save type
                    $.APP.dir = dir;
                    // get current date
                    $.APP.d1 = new Date();
                    switch($.APP.state) {    
                        case 'pause' :
                            // resume timer
                            // get current timestamp (for calculations) and
                            // substract time difference between pause and now
                            $.APP.t1 = $.APP.d1.getTime() - $.APP.td;                            
                        break;      
                        default : 
                            // get current timestamp (for calculations)
                            $.APP.t1 = $.APP.d1.getTime(); 
                            // if countdown add ms based on seconds in textfield
                            if ($.APP.dir === 'cd') {
								var total_seconds = parseInt($('#cd_mins').val())* 60; 
								total_seconds = total_seconds + parseInt($('#cd_seconds').val()); 
                                $.APP.t1 += parseInt(total_seconds)*1000;
                            }    
                        break;   
                    }                                   
                    // reset state
                    $.APP.state = 'alive';   
                    $('#' + $.APP.dir + '_status').html('Running');
                    // start loop
                    $.APP.loopTimer();
                },
                
                pauseTimer : function() {
                    // save timestamp of pause
                    $.APP.dp = new Date();
                    $.APP.tp = $.APP.dp.getTime();
                    
                    // save elapsed time (until pause)
                    $.APP.td = $.APP.tp - $.APP.t1;
                    
                    // change button value
                    $('#' + $.APP.dir + '_start').val('Resume');
                    
                    // set state
                    $.APP.state = 'pause';
                    $('#' + $.APP.dir + '_status').html('Paused');
                    
                },
                
                stopTimer : function() {
                    
                    // change button value
                    $('#' + $.APP.dir + '_start').val('Restart');                    
                    
                    // set state
                    $.APP.state = 'stop';
                    $('#' + $.APP.dir + '_status').html('Stopped');
                    
                },
                
                resetTimer : function() {
					
					colour_flag = 0;

                    // reset display
                    $('#' + $.APP.dir + '_ms,#' + $.APP.dir + '_s,#' + $.APP.dir + '_m,#' + $.APP.dir + '_h').html('00');                 
                    
                    // change button value
                    $('#' + $.APP.dir + '_start').val('Start');                    
                    
                    // set state
                    $.APP.state = 'reset';  
                    $('#' + $.APP.dir + '_status').html('Reset & Idle again');
                    
                },
                
                endTimer : function(callback) {
                   
                    // change button value
                    $('#' + $.APP.dir + '_start').val('Restart');
                    
                    // set state
                    $.APP.state = 'end';
                    
                    // invoke callback
                    if (typeof callback === 'function') {
                        callback();
                    }    
                    
                },    
                
                loopTimer : function() {
                    var td;
                    var d2,t2;
                    var ms = 0;
                    var s  = 0;
                    var m  = 0;
                    var h  = 0;
                    
                    if ($.APP.state === 'alive') {
                                
                        // get current date and convert it into 
                        // timestamp for calculations
                        d2 = new Date();
                        t2 = d2.getTime();   

                        // calculate time difference between
                        // initial and current timestamp
                        if ($.APP.dir === 'sw') { //Stopwatch function variable 
                            td = t2 - $.APP.t1;
                        // reversed if countdown
                        } else {
                            td = $.APP.t1 - t2;
                            if (td <= 0) {
                                // if time difference is 0 end countdown
                                $.APP.endTimer(function(){
                                    $.APP.resetTimer();
                                    $('#' + $.APP.dir + '_status').html('Ended & Reset');
                                });
                            }    
                        }    
                        
                        // calculate milliseconds
                        ms = td%1000;
                        if (ms < 1) {
                            ms = 0;
                        } else {    
                            // calculate seconds
                            s = (td-ms)/1000;
                            if (s < 1) {
                                s = 0;
                            } else {
                                // calculate minutes   
                                var m = (s-(s%60))/60;
                                if (m < 1) {
                                    m = 0;
                                } else {
                                    // calculate hours
                                    var h = (m-(m%60))/60;
                                    if (h < 1) {
                                        h = 0;
                                    }                             
                                }    
                            }
                        }
                      
                        // substract elapsed minutes & hours
                        ms = Math.round(ms/100);
                        s  = s-(m*60);
                        m  = m-(h*60);   
					
						if (typeof($.APP.formatTimer(s)) == "number"){ //Fix the flickering bug caused by the timer periodically resetting to a string with with value of  "0". 
							// Set display values 
	                        $('#' + $.APP.dir + '_ms').html($.APP.formatTimer(ms));
	                        $('#' + $.APP.dir + '_s').html($.APP.formatTimer(s));
	                        $('#' + $.APP.dir + '_m').html($.APP.formatTimer(m));
	                        $('#' + $.APP.dir + '_h').html($.APP.formatTimer(h));
							
							
							// Check values of timer, then validate. 
							// If the BG colour is already set, dont change.
			
							if (parseInt($('#cd_thresh_amber_mins').val()) >= parseInt($.APP.formatTimer(m)) ){ //Check under 0 minutes

										if ($.APP.formatTimer(m) > parseInt($('#cd_thresh_amber_mins').val())){
												if ($('#timer_container').css('background-color')!='rgb(' + cont_colours[0] + ')'){
													$('#timer_container').css('background-color', 'rgb(' + cont_colours[0] + ')');
												};
										}

										if ($.APP.formatTimer(s) < parseInt($('#cd_thresh_amber_secs').val())){ //Check Amber
											if ($.APP.formatTimer(s) > 0){  // Check to see if greater than 0 to eliminate
													if ($('#timer_container').css('background-color')!='rgb(' + cont_colours[1] + ')'){
														$('#timer_container').css('background-color', 'rgb(' + cont_colours[1] + ')');
													};
											};
										}
		
										if ($.APP.formatTimer(s) < parseInt($('#cd_thresh_red').val())){ // Check Red
											if ($.APP.formatTimer(s) > 0){ 
												if ($('#timer_container').css('background-color')!='rgb(' + cont_colours[2] + ')'){
													$('#timer_container').css('background-color', 'rgb(' + cont_colours[2] + ')');
												};
											};	
										}
							} // End minutes check 

						} // End typof check 
						
						// Remove flicker bug with formatted numbers
						// The  'formatTimer' returns a string, so a different validation method is required. 
						// This resulted from random zero's being fired. 
						if (typeof($.APP.formatTimer(s)) == "string"){
							//If the value is not 0, display it
							if ($.APP.formatTimer(s) != 0) {
		                        $('#' + $.APP.dir + '_s').html($.APP.formatTimer(s));
		                        $('#' + $.APP.dir + '_m').html($.APP.formatTimer(m));
								
							}
							// If zero, check that it follows the sequence. 
							if ($.APP.formatTimer(s) == 0) {
								if ($('#' + $.APP.dir + '_s').html() - $.APP.formatTimer(s) == 1){
			                        $('#' + $.APP.dir + '_s').html($.APP.formatTimer(s));
			                      //  $('#' + $.APP.dir + '_m').html($.APP.formatTimer(m));
								}
							}
						}
                        $.APP.t = setTimeout($.APP.loopTimer,1);
                    } else {
                        // kill loop
                        clearTimeout($.APP.t);
                        return true;
                    }  
                }
            }    
        });
        $('#sw_start').click(function() {
            $.APP.startTimer('sw');
        });    

        $('#cd_start').click(function() {
            $.APP.startTimer('cd');
        });           
        
        $('#sw_stop,#cd_stop').click(function() {
            $.APP.stopTimer();
        });
        
        $('#sw_reset,#cd_reset').click(function() {
            $.APP.resetTimer();
			$('#timer_container').css('background-color', 'rgb(' + cont_colours[0] + ')'); // Reset the colour 
			  update_timer_from_user();
        });  
        
        $('#sw_pause,#cd_pause').click(function() {
            $.APP.pauseTimer();
        });                
                
    })(jQuery);
	
	
	

});
