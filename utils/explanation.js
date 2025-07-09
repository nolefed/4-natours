/* This is like a README file or a file which explains the code written in this app to me.

Node.js Runtime: Node.js does not have a traditional compile time like languages like C++ or Java. Instead it executes Javascript code line by line

Application Initialization :  when you start your Node.js application (eg by running node server.js),
the code in your server file is executed

Route Definition: During this initialisation phase,Express.js route definitions are processed. This is where
you use methods like app.get(), app.post(),router.get() etc to define your routes and attach middleware

restrictTo Execution: The authController.restrictTo(...) call happens during this initialization phase when
the route is defined.Express is building its internal route table.

Request Handling (runtime): only after the application has finished initialising and is listening for requests 
does the anonymous middleware function gets called for each incoming request.

Therefore its more accurate to say restrictTo is called during the application's startup or initialisation phase, not during compile time.

The anonymous function returned by restrictTo is called during the runtime of the application when actual HTTP 
requests are followed.

In essence, the anonymous function acts as "carrier" of data from initialisation phase to run time phase.
this pattern is very common in javascript and node.js for creating functions that can be configured at one 
point and executed late with configured values.








*/