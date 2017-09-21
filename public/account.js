//firebase initialization - this is unique to our app
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCq-y-M6MLbSTCWkSH1SurBPcKIkG7izrE",
    authDomain: "girlcode-test.firebaseapp.com",
    databaseURL: "https://girlcode-test.firebaseio.com",
    projectId: "girlcode-test",
    storageBucket: "girlcode-test.appspot.com",
    messagingSenderId: "937873636713"
  };
  firebase.initializeApp(config);

//then the general code
      initApp = function() {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var photoURL = user.photoURL;
            user.getToken().then(function(accessToken) {
                $(".accountInfo").html("Hello, " + displayName + ". <a href='#'>Sign out</a>");
                $(".nameInput").val(displayName);
                $(".accountInfo a").click(function (e) {
                    firebase.auth().signOut();
                    e.preventDefault();
                })
              })
          } else {
            // User is signed out.
            $(".accountInfo").html("<a href='login.html'>sign in</a>")
          }
        }, function(error) {
          console.log(error);
        });
      };
      window.addEventListener('load', function() {
        initApp()
      });
