# General info:
#	This is a template file for writing acceptance test cases with Robot framework syntax.
#	https://robotframework.org/
#	Current framework version: 5.0
#	
# 	Browser interaction is managed by Playwright: https://playwright.dev/
#	Keywords for browser actions are provided by Browser library: https://robotframework-browser.org/
# 	Current version: 12.3.0
#
# User guides:	
# 	Robot Framework User Guide: https://robotframework.org/robotframework/5.0/RobotFrameworkUserGuide.html
# 	Built in libraries: https://robotframework.org/robotframework/#standard-libraries
#		- Dult-in keywords: https://robotframework.org/robotframework/5.0/libraries/BuiltIn.html#library-documentation-top
#	Browser library keywords: https://marketsquare.github.io/robotframework-browser/Browser.html
#
# Execution:
#	- Tests run in Chrome browser by default, there are other browser engines availble if needed, however the test runner is optimized for Chrome.
#	- By default screenshots are taken on each failing test step. It is suggested to not to take to many screenshots manually.
#	- The first failing step halts the subsequent execution.
#	- You can upload multiple test files.


# Global settings. !DO NOT MODIFY THIS SECTION!
*** Settings ***
# Including browser library for web testing
Library   Browser

# Default test timeout is 1 minutes
# Alter timeout on test case basis: https://robotframework.org/robotframework/5.0/RobotFrameworkUserGuide.html#timeouts
Test Timeout	1 minutes


# Variables for test cases
*** Variables ***
# The base url of the application to test. !DO NOT MODIFY THIS VALUE!
${URL}		http://localhost:%{WEB_APP_PORT=80}


# Define test cases below
*** Test Cases ***

# The sole purpose of the first test case to make sure the webserver is up and ready to serve requests.
# It may take some time to the webserver to start serving request, thus this test use a retry mechanism.
# You may alter this test case, but it is strongly recommended that at least the first test case of the suite contain retry logix
Check if webserver is up and running
	[Timeout]   2 minutes
# Try open the root url 6 times with linear back off of 10 sec
	Wait Until Keyword Succeeds     6x  10s     New Page    ${URL}
# Default logging level is INFO
	Log     Webserver is available  INFO