
     /** Fetches the desired information from the JSON-file, writes it to the DOM element. */
     function getArticle(number) {
		  $.getJSON('https://paivolp01.firebaseio.com/.json', function(newsFeed) { 
		  	if (number == 0) {
		  	$('#newsOne').html('<h3>' + newsFeed.articles[number].header + '</h3>');
		  	$('#newsOne').append('<h5>' + newsFeed.articles[number].date + '</h5>');
		  	$('#newsOne').append('<p>' + newsFeed.articles[number].content + '</p>');
		  } else if (number == 1) {
		  	$('#newsTwo').html('<h3>' + newsFeed.articles[number].header + '</h3>');
		  	$('#newsTwo').append('<h5>' + newsFeed.articles[number].date + '</h5>');
		  	$('#newsTwo').append('<p>' + newsFeed.articles[number].content + '</p>');
		  } else {
		  	$('#newsThree').html('<h3>' + newsFeed.articles[number].header + '</h3>');
		  	$('#newsThree').append('<h5>' + newsFeed.articles[number].date + '</h5>');
		  	$('#newsThree').append('<p>' + newsFeed.articles[number].content + '</p>');
		  }

		  });
	};

	
	/** Executes the getArticle for all desired articles */
	function getContent() {
			for (i = 0; i < 3; i++) {
				getArticle(i);
			}

      Load();
	};

	var nrSlides = 3; // The number of slides/articles
  var IntSeconds = 7; // Set the interval for slide change in seconds
  var nrShown = 0;

  /** Gathers information of where the slideshow was left-off from the local storage, if possible */
  function getLast() {
      if (parseInt(localStorage.getItem("last")) !== "undefined" || parseInt(localStorage.getItem("last")) > 2 ) {
        nrShown = parseInt(localStorage.getItem("last"));
    	} else {
    		nrShown = 0;
    	}
      if (nrShown != 0 || nrShown != 1 || nrShown != 2) {
        nrShown = 0;
      }
    };

    /** Autoplay and loop the slideshow */
    function Load() {
          
          getLast();

          Vect = new Array(nrSlides + 10);
          Vect[0] = document.getElementById("article1");
          console.log("NewsFeed was left at:" + nrShown);
          
        
		  for (var i = 1; i < nrSlides; i++) {
          	Vect[i] = document.getElementById("article" + (i + 1));
          }

          Vect[nrShown].style.display = "block"; // Display the first slide
       	  mytime = setInterval(Timer, IntSeconds * 1000); // Restart interval timer
    };

    function Timer() {
          nrShown++;
          if (nrShown == nrSlides) {
              nrShown = 0; 
            }

          Effect();
          localStorage.setItem("last", nrShown); // Save the current slide to local storage
          clearInterval(mytime);
          play();
        };
        
    function next() {
           nrShown++;
           if (nrShown == nrSlides)
               nrShown = 0;
           Effect();
           localStorage.setItem("last", nrShown);

          clearInterval(mytime);
          play();
        };
        
    function prev() {
           nrShown--;
           if (nrShown == -1) {
               nrShown = nrSlides -1; 
           }

           Effect();
           localStorage.setItem("last", 0);

           clearInterval(mytime);
           play();
        }
        
    function Effect() {
           for (var i = 0; i < nrSlides; i++) {
           	Vect[i].style.display = "none"; 
           }    
           $(Vect[nrShown]).fadeIn("slow"); // jQuery fade-in effect
    }
    
    function pause() {
    	
    	$("#Spause").fadeOut();
		$("#Splay").fadeIn();
		
		clearInterval(mytime);
    };

    function play() {
    	
    	$("#Splay").fadeOut();
		$("#Spause").fadeIn();

		mytime = setInterval(Timer, IntSeconds * 1000);
    };

