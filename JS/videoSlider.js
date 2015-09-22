var Slider = {
		init: function( config ) {
			var self = this;
			
			self.template = config.template;
			self.subTemplate = config.subTemplate;
			self.container = config.container;
			self.subContainer = config.subContainer;
			
			self.easingEffect = config.easingEffect;
			self.delayEffect = config.delayEffect;
			
			self.fetch(); //  fetch the data first and Return the control
			
			self.attachTemplate(); //  Attach the JSON Data to template and Return the control
			
			
			self.automaticPlay(); // Play Video Slider
		},

				
		fetch: function() {
			var self = this;
			
			$.ajax({
				url: 'JS/videos.json',
				dataType: 'json',
				contentType: 'application/json',
				cache: false,
				async: false,
				success: function(data){
						
					   // Main JSON data 
                       self.videoData = data;
					   self.posterData = [];						
					   var tempData;
					   $.each(data, function(i,o){
							
							// for Thumbnail Images
							tempData =  $.map(data[i], function(j, k) {
								
								if(k.toString() == "poster") {
									return {
										'poster' : j
									}
									
								}
							
							});
						
							// Array of objects of Thumbnail images, parsed from main JSON object
							self.posterData.push(tempData[0]);
					   });
						
						
						
						 
                },
                        
				error: function(){
                        
						alert("Something Wrong");
                }
                         
            });
			
				
				
		},
			
		attachTemplate: function() {
			
			var self = this,
			    template = Handlebars.compile( self.template ),      // Handlebar templating for Video data
			    subTemplate = Handlebars.compile( self.subTemplate );	// Handlebar templating for thumbnail images data
			
			
			self.container.append( template(self.videoData) );     // appends video data to video template
			self.subContainer.append( subTemplate(self.posterData) ); // appends thumbnail data to thumbnail template
			
			
			
			self.videos = self.container.find('video');
			self.videoWidth = self.videos[0].width; // 600
			self.videoLen = self.videos.length; // 4
			self.no = 0;
			
			self.posterThumb = self.subContainer.find('img').off('click').on('click', function() {	
								
									self.no = $(self.posterThumb).index(this);
							        self.nextVideo(parseInt(self.no), self);
							   });	
								
			self.totalThumbs = self.posterThumb.length; // 4 
			
			

		},
			
		// Animation effect of sliding 	
		effects: function (no) {
			
			    var self = this;
			
			    self.container.animate({
			        'margin-left': - ( (no || self.no) * self.videoWidth )
				    }, self.delayEffect, self.easingEffect);
					
					
						
		},
			
		
	
		automaticPlay: function() {
	
			var self = this;
			var currentVideo = self.no;
			
			self.videos.eq(currentVideo)[0].play();
			self.videos.eq(currentVideo).on('ended', $.proxy(self.nextVideo, self));
			
		
		
		},
	
		// Handles the recursive playback of videos
		nextVideo: function(currentIndex, self) {
	
			var self = self || this,
			     	   nextvid;
			if(currentIndex == 0) { 
				nextvid = currentIndex;
			}
			else { 
				nextvid = parseInt(currentIndex) || ++ self.no;

			}
			if (nextvid == self.videoLen) {
		
				nextvid = self.no = 0;
		
			}
	
			self.effects(nextvid);
	
	// Plays the current video and pauses all the other videos
			if(parseInt(currentIndex)) {
				for(var i=0; i<self.videoLen; i++) {
					if(i == (nextvid)) {					
						continue;
					}
					else {
						self.videos.eq(i)[0].pause();
					}
				}
			}
	
	
			self.videos.eq(nextvid)[0].play();
			self.no++;
	
		
	//self.videos.eq(nextvid).off('ended').on('ended',$.proxy(self.nextVideo, self));
			self.videos.eq(nextvid).off('ended').on('ended',function() {
				self.nextVideo(self.no,self);
			});
		}
			
};
	
	