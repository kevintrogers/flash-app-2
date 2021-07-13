import './footer.html'

Template.body.events({
    'click #tabButton1' () {
		
		const activeTab = document.getElementsByClassName("active");
		
		activeTab[0].classList.replace("active", "tab");
		
		var newActive = document.getElementById('home').className = ("active");	
		},
	  'click #tabButton2' () {
		
		const activeTab = document.getElementsByClassName("active");
		
		activeTab[0].classList.replace("active", "tab");
		
		var newActive = document.getElementById('study').className = ("active");	
		},
	'click #tabButton3' () {
		
		const activeTab = document.getElementsByClassName("active");
		
		activeTab[0].classList.replace("active", "tab");
		
		var newActive = document.getElementById('create').className = ("active");	
		},
	'click #tabButton4' () {
		
		const activeTab = document.getElementsByClassName("active");
		
		activeTab[0].classList.replace("active", "tab");
		
		var newActive = document.getElementById('message').className = ("active");	
		},
	'click #tabButton5' () {
				
		const activeTab = document.getElementsByClassName("active");
		
		activeTab[0].classList.replace("active", "tab");
		

		var newActive = document.getElementById('help').className = ("active");	
		},
	});




